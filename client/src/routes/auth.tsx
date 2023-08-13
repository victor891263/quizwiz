import {useState, useEffect} from "react"
import { Link, useNavigate } from "react-router-dom"
import Joi from 'joi'
import CheckIcon from "../icons/CheckIcon"
import axios from "axios";
import PopUp from "../components/PopUp";
import handleAxiosError from "../utilities/handleAxiosError";
import Spinner from "../components/Spinner";

export default function Auth({ type }: { type: 'login' | 'register' }) {
    const loginSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required(),
        rememberMe: Joi.boolean(),
    })
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [submissionError, setSubmissionError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setErrors({
            email: '',
            password: ''
        })
    }, [type])

    function handleSubmit(e: any) {
        e.preventDefault()
        const { error } = loginSchema.validate({ email, password, rememberMe }, { abortEarly: false })
        if (error) {
            const newErrors = {
                email: '',
                password: ''
            }
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
            setErrors(newErrors)
        } else {
            setIsLoading(true)
            axios.post(`${process.env.REACT_APP_API_URL}/auth`, { email, password })
                .then(() => {
                    navigate('/')
                })
                .catch(error => {
                    handleAxiosError(error, (msg: string) => setSubmissionError(msg), true)
                    setIsLoading(false)
                })
        }
    }

    return (
        <>
            {submissionError && <PopUp msg={submissionError} color='red' />}
            <div className='flex min-h-screen px-6'>
                <div className='m-auto container max-w-sm py-20'>
                    <div>
                        <h1 className='text-2xl tracking-[-.015em]'>{ type === 'login' ? 'Welcome back!': 'Join Flavorverse' }</h1>
                        {type === 'login' && <span className="block mt-3 leading-6">Not a member? <Link to='/register' className="text-green-600 font-medium">Join quizwiz</Link></span>}
                        {type === 'register' && <span className="block mt-3 leading-6">Already have an account? <Link to='/login' className="text-lime-600 font-medium">Login</Link></span>}
                    </div>
                    <form className='mt-10 space-y-5' onSubmit={handleSubmit}>
                        <div className='relative'>
                            <label htmlFor='email' className='absolute top-2 left-3 text-sm text-slate-400'>Email</label>
                            <input type='text' name='email' id='email' className='w-full' value={email} onChange={e => setEmail(e.target.value)} />
                            {errors.email && (
                                <div className='mt-2 text-red-600 flex items-center space-x-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    <div className="text-sm first-letter:capitalize">{errors.email}</div>
                                </div>
                            )}
                        </div>
                        <div className='relative'>
                            <label htmlFor='password' className='absolute top-2 left-3 text-sm text-slate-400'>Password</label>
                            <input type='password' name='password' id='password' className='w-full' value={password} onChange={e => setPassword(e.target.value)} />
                            {errors.password && (
                                <div className="mt-2 text-red-600 flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    <div className="text-sm first-letter:capitalize">{errors.password}</div>
                                </div>
                            )}
                        </div>
                        {type === 'login' && (
                            <div className='flex items-center justify-between text-sm py-1'>
                                <div onClick={() => setRememberMe(!rememberMe)} className='flex items-center space-x-2 cursor-pointer'>
                                    <div className={'h-4 w-4 pt-0.5 rounded ring-1 ring-slate-300 flex items-center justify-center' + (rememberMe ? ' bg-lime-600 !ring-lime-600 text-white' : '')}>
                                        <CheckIcon className='w-3 h-3 text-white' />
                                    </div>
                                    <div>Remember me</div>
                                </div>
                                <Link to='/recover' className="text-green-600 font-medium">Forgot password?</Link>
                            </div>
                        )}
                        {isLoading ? (
                            <div className='relative bg-lime-600 rounded-lg py-2 px-3 w-full opacity-80 cursor-disabled'>
                                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                                    <Spinner className='h-5 w-5 text-white' />
                                </div>
                                <div className='opacity-0'>Login</div>
                            </div>
                        ):(
                            <input type='submit' className='w-full' value={type === 'login' ? 'Login' : 'Create account'} />
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}