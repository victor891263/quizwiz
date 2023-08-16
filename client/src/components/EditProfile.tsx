import {useState} from "react"
import Joi from 'joi'
import {useNavigate} from "react-router-dom"
import {User} from "../types"
import handleTextareaResize from "../utilities/handleTextareaResize"
import axios from "axios";
import handleAxiosError from "../utilities/handleAxiosError"
import getToken from "../utilities/getToken"
import CrossIcon from "../icons/CrossIcon"
import ButtonWithSpinner from "./ButtonWithSpinner"
import MailIcon from "../icons/MailIcon";
import ButtonWithLoader from "./ButtonWithLoader";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

type Props = {
    profile: User
    updateDetails: (details: {
        name: string | undefined
        username: string
        about: string | undefined
        link: string | undefined
    }) => void
    updateNewEmail: (email: string) => void
    setError: (msg: string) => void
    setSuccess: (msg: string) => void
    operationError: string
    operationSuccess: string
}

export default function EditProfile({ profile, updateDetails, updateNewEmail, setError, setSuccess, operationError, operationSuccess }: Props) {
    const detailsSchema = Joi.object({
        name: Joi.string().min(0).max(50),
        username: Joi.string().min(1).max(50).required(),
        about: Joi.string().min(0).max(300),
        link: Joi.string().min(0).max(50)
    })
    const emailSchema = Joi.object({
        newEmail: Joi.string().email({ tlds: { allow: false } }).min(1).max(50).required()
    })
    const passwordSchema = Joi.object({
        currentPassword: Joi.string().min(1).max(50),
        newPassword: Joi.string().min(1).max(50)
    })

    const [details, setDetails] = useState({
        name: profile.name,
        username: profile.username,
        about: profile.about,
        link: profile.link
    })
    const [currentEmail, setCurrentEmail] = useState(profile.email.address)
    const [newEmail, setNewEmail] = useState(profile.new_email.address || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [detailsErrors, setDetailsErrors] = useState({
        name: '',
        username: '',
        about: '',
        link: ''
    })
    const [emailErrors, setEmailErrors] = useState({
        newEmail: ''
    })
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        newPassword: ''
    })

    const [isLoading, setIsLoading] = useState(false)
    const [showing, setShowing] = useState<'details' | 'email' | 'password' | 'misc'>('details')

    const navigate = useNavigate()

    // update details
    async function submitDetails() {
        // clear errors
        const newErrors = {
            name: '',
            username: '',
            about: '',
            link: ''
        }
        // validate
        const { error } = detailsSchema.validate(details, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/users`, details, {headers: {Authorization: `Bearer ${getToken()}`}})
                updateDetails(details)
                setSuccess('Your details has been updated successfully')
                setTimeout(() => setSuccess(''), 3000)
                setIsLoading(false)
            }
            catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setError(msg)
                    setTimeout(() => setError(''), 3000)
                    setIsLoading(false)
                })
            }
        }
        setDetailsErrors(newErrors)
    }

    // update email
    async function submitEmail() {
        // clear errors
        const newErrors = {
            newEmail: ''
        }
        // validate
        const { error } = emailSchema.validate({ newEmail }, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/users/email`, newEmail, {headers: {Authorization: `Bearer ${getToken()}`}})
                updateNewEmail(newEmail)
                setIsLoading(false)
            }
            catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setError(msg)
                    setTimeout(() => setError(''), 3000)
                    setIsLoading(false)
                })
            }
        }
        setEmailErrors(newErrors)
    }

    // update password
    async function submitPassword() {
        // clear errors
        const newErrors = {
            currentPassword: '',
            newPassword: ''
        }
        // validate
        const { error } = passwordSchema.validate({ currentPassword, newPassword }, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/users/password`, newPassword, {headers: {Authorization: `Bearer ${getToken()}`}})
                setSuccess('Your password has been updated successfully')
                setTimeout(() => setSuccess(''), 3000)
                setIsLoading(false)
            }
            catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setError(msg)
                    setTimeout(() => setError(''), 3000)
                    setIsLoading(false)
                })
            }
        }
        setPasswordErrors(newErrors)
    }

    // delete account
    async function deleteProfile() {
        setIsLoading(true)
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/users`, {headers: {Authorization: `Bearer ${getToken()}`}})
            setSuccess('Your account has been deleted successfully. Logging you out now')
            setTimeout(() => {
                setSuccess('')
                localStorage.removeItem('jwt') // logout
                navigate('/') // redirect to home page
            }, 3000)
            setIsLoading(false)
        }
        catch (error) {
            handleAxiosError(error, (msg: string) => {
                setError(msg)
                setTimeout(() => setError(''), 3000)
                setIsLoading(false)
            })
        }
    }

    async function cancelEmailUpdate() {
        setIsLoading(true)
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/user/email`, {headers: {Authorization: `Bearer ${getToken()}`}})
            setSuccess('The process of updating your email has been stopped.')
            setTimeout(() => setSuccess(''), 3000)
            setIsLoading(false)
        }
        catch (error) {
            handleAxiosError(error, (msg: string) => {
                setError(msg)
                setTimeout(() => setError(''), 3000)
                setIsLoading(false)
            })
        }
    }

    return (
        <div className='space-y-8'>
            <h2 className='subtitle'>Edit profile</h2>
            <div className='text-slate-400 flex'>
                {['details', 'email', 'password', 'misc'].map(item => (
                    <button onClick={() => setShowing(item as ('details' | 'email' | 'password' | 'misc'))} className={'px-4 py-2.5 border-b capitalize ' + (showing === item ? 'border-slate-900 text-slate-900' : '')}>{item}</button>
                ))}
                <div className='border-b w-full'></div>
            </div>
            {showing === 'details' && (
                <>
                    {Object.keys(details).map(item => ((item === 'name') || (item === 'username') || (item === 'about') || (item === 'link')) && (
                        <div>
                            <label htmlFor={item} className='text-sm capitalize'>{item}</label>
                            {item === 'about' ? (
                                <textarea className='mt-2 w-full h-32' name={item} id={item} value={details[item]} onChange={e => {
                                    setDetails({...details, [item]: e.target.value})
                                    handleTextareaResize(e)
                                }} />
                            ):(
                                <input className='mt-2 w-full' type='text' name={item} id={item} value={details[item]} onChange={e => setDetails({...details, [item]: e.target.value})} />
                            )}
                            {detailsErrors[item] && (
                                <div className='mt-2 text-red-600 flex items-center space-x-1'>
                                    <CrossIcon className='h-5 w-5' />
                                    <div className="text-sm first-letter:capitalize">{detailsErrors[item]}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className='!mt-10'>
                        <ButtonWithLoader onClick={submitDetails} isOver={!!(operationError || operationSuccess)} type='light' >
                            <button className='primary disabled:text-transparent'>Save changes</button>
                        </ButtonWithLoader>
                    </div>
                </>
            )}
            {showing === 'email' && (
                <>
                    <div>
                        <label htmlFor='currentEmail' className='text-sm'>Current email</label>
                        <input disabled={true} className='mt-2 w-full' type='text' name='currentEmail' id='currentEmail' value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                    </div>
                    {profile.new_email.address ? (
                        <div className='border p-6 space-y-4 flex flex-col items-center text-center'>
                            <MailIcon className='h-8 w-8' />
                            <p>Follow the instructions sent to {profile.new_email.address} to finish updating. You can revert the change to nullify this process.</p>
                            <ButtonWithLoader onClick={cancelEmailUpdate} isOver={!!(operationError || operationSuccess)} type='dark' >
                                <button className='secondary disabled:text-transparent'>I don't want to update anymore</button>
                            </ButtonWithLoader>
                        </div>
                    ):(
                        <>
                            <div>
                                <label htmlFor='newEmail' className='text-sm'>New email</label>
                                <input className='mt-2 w-full' type='text' name='newEmail' id='newEmail' value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                                {emailErrors.newEmail && (
                                    <div className='mt-2 text-red-600 flex items-center space-x-1'>
                                        <CrossIcon className='h-5 w-5' />
                                        <div className="text-sm first-letter:capitalize">{emailErrors.newEmail}</div>
                                    </div>
                                )}
                            </div>
                            <div className='!mt-10'>
                                <ButtonWithLoader onClick={submitEmail} isOver={!!(operationError || operationSuccess)} type='light' >
                                    <button className='primary disabled:text-transparent'>Update email</button>
                                </ButtonWithLoader>
                            </div>
                        </>
                    )}
                </>
            )}
            {showing === 'password' && (
                <>
                    <div>
                        <label htmlFor='currentPassword' className='text-sm'>Current password</label>
                        <input className='mt-2 w-full' type='password' name='currentPassword' id='currentPassword' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        {passwordErrors.currentPassword && (
                            <div className='mt-2 text-red-600 flex items-center space-x-1'>
                                <CrossIcon className='h-5 w-5' />
                                <div className="text-sm first-letter:capitalize">{passwordErrors.currentPassword}</div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor='newPassword' className='text-sm'>New password</label>
                        <input className='mt-2 w-full' type='password' name='newPassword' id='newPassword' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        {passwordErrors.newPassword && (
                            <div className='mt-2 text-red-600 flex items-center space-x-1'>
                                <CrossIcon className='h-5 w-5' />
                                <div className="text-sm first-letter:capitalize">{passwordErrors.newPassword}</div>
                            </div>
                        )}
                    </div>
                    <div className='!mt-10'>
                        <ButtonWithLoader onClick={submitPassword} isOver={!!(operationError || operationSuccess)} type='light' >
                            <button className='primary disabled:text-transparent'>Update password</button>
                        </ButtonWithLoader>
                    </div>
                </>
            )}
            {showing === 'misc' && (
                <>
                    <div>
                        <h3 className='mb-3 text-lg font-semibold'>Leaving Quizwiz?</h3>
                        <p>All quizzes, answers, and comments attributed to this account will be deleted permanently. This action is not reversible.</p>
                    </div>
                    <ButtonWithLoader onClick={submitPassword} isOver={!!(operationError || operationSuccess)} type='light' >
                        <button className='danger disabled:text-transparent'>Delete my account</button>
                    </ButtonWithLoader>
                </>
            )}
        </div>
    )
}