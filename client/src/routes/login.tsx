import PopUp from "../components/PopUp"
import Joi from "joi"
import {Link, useNavigate} from "react-router-dom"
import getCurrentUser from "../utilities/getCurrentUser"
import {useEffect, useState} from "react"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import CheckIcon from "../icons/CheckIcon"
import Spinner from "../icons/Spinner"

export default function Login() {
    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required(),
        rememberMe: Joi.boolean(),
    })
    const navigate = useNavigate()
    const currentUser = getCurrentUser()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [submissionError, setSubmissionError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (currentUser) navigate('/')
    }, [])

    function handleSubmit() {
        const newErrors = {
            username: '',
            email: '',
            password: ''
        }
        const { error } = schema.validate({ email, password, rememberMe }, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            // login
            axios.post(`${process.env.REACT_APP_API_URL}/auth`, { email, password })
                .then(response => {
                    localStorage.setItem('jwt', response.data)
                    // save user's remember-me selection
                    if (rememberMe) localStorage.setItem('rememberMe', 'yes')
                    // navigate to home page
                    window.location.href = window.location.origin
                })
                .catch(error => {
                    handleAxiosError(error, (msg: string) => {
                        setSubmissionError(msg)
                        setTimeout(() => setSubmissionError(''), 3000)
                    })
                    setIsLoading(false)
                })
        }
        setErrors(newErrors)
    }

    return (
        <>
            <PopUp isVisible={!!submissionError} msg={submissionError} color='red' />
            <div className="bg-white dark:bg-gray-900">
                <div className="flex items-center h-screen">
                    <div className="max-lg:hidden h-full w-full bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1551836022-4c4c79ecde51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`}}>
                        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                            <div className='max-w-sm text-white'>
                                <h1 className='text-2xl font-bold text-white tracking-tight'>Test your knowledge, create your quizzes</h1>
                                <p className="mt-4 leading-[1.6]">a dynamic platform where you can both take captivating quizzes on a variety of topics and create your own to share with the global community. Join us now!</p>
                            </div>
                        </div>
                    </div>
                    <div className="max-lg:mx-auto shrink-0 w-full max-w-md max-lg:px-6 lg:px-12">
                        <div>
                            <h1 className='text-2xl tracking-[-0.01em]'>Welcome back!</h1>
                            <span className="block mt-3 leading-6">Not a member? <Link to='/join' className="text-sky-600">Join quizwiz</Link></span>
                        </div>
                        <div className='mt-10 space-y-5'>
                            <div>
                                <label htmlFor='email' className='text-sm'>Email address</label>
                                <input type='text' name='email' id='email' className='mt-2 w-full' value={email} onChange={e => setEmail(e.target.value)} />
                                {errors.email && (
                                    <div className='mt-2 text-red-600 text-sm first-letter:capitalize'>{errors.email}</div>
                                )}
                            </div>
                            <div>
                                <label htmlFor='password' className='text-sm'>Password</label>
                                <input type='password' name='password' id='password' className='mt-2 w-full' value={password} onChange={e => setPassword(e.target.value)} />
                                {errors.password && (
                                    <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{errors.password}</div>
                                )}
                            </div>
                            <div className='flex items-center justify-between text-sm py-1'>
                                <div onClick={() => setRememberMe(!rememberMe)} className='flex items-center space-x-2 cursor-pointer'>
                                    <div className={'h-4 w-4 ring-1 ring-slate-300 rounded flex items-center justify-center' + (rememberMe ? ' bg-sky-600 !ring-sky-600' : '')}>
                                        {rememberMe && <CheckIcon className='w-3 h-3 !text-white' />}
                                    </div>
                                    <div>Remember me</div>
                                </div>
                                <Link to='/recover' className="text-sky-600">Forgot password?</Link>
                            </div>
                            <div>
                                <button onClick={handleSubmit} disabled={isLoading} className='relative primary w-full disabled:text-transparent'>
                                    <span>Login</span>
                                    {isLoading && (
                                        <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                            <Spinner className='h-5 w-5 border-[3px] text-white' />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}