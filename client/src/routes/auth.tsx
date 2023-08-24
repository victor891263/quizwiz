import {useState, useEffect} from "react"
import { Link, useNavigate } from "react-router-dom"
import Joi from 'joi'
import CheckIcon from "../icons/CheckIcon"
import axios from "axios"
import PopUp from "../components/PopUp"
import handleAxiosError from "../utilities/handleAxiosError"
import Spinner from "../icons/Spinner"

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
        setEmail('')
        setPassword('')
        setErrors({
            email: '',
            password: ''
        })
    }, [type])

    function handleSubmit() {
        const newErrors = {
            email: '',
            password: ''
        }
        const { error } = loginSchema.validate({ email, password, rememberMe }, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            // login
            if (type === 'login') {
                axios.post(`${process.env.REACT_APP_API_URL}/auth`, { email, password })
                    .then(response => {
                        localStorage.setItem('jwt', response.data)
                        // save user's remember-me selection
                        if (rememberMe) localStorage.setItem('rememberMe', 'yes')
                        // navigate to home page
                        navigate('/')
                    })
                    .catch(error => {
                        handleAxiosError(error, (msg: string) => {
                            setSubmissionError(msg)
                            setTimeout(() => setSubmissionError(''), 3000)
                        })
                        setIsLoading(false)
                    })
            }
            // create new account
            if (type === 'register') {
                axios.post(`${process.env.REACT_APP_API_URL}/users`, { email, password })
                    .then(response => {
                        localStorage.setItem('jwt', response.data)
                        navigate('/unverified')
                    })
                    .catch(error => {
                        handleAxiosError(error, (msg: string) => {
                            setSubmissionError(msg)
                            setTimeout(() => setSubmissionError(''), 3000)
                        })
                        setIsLoading(false)
                    })
            }
        }
        setErrors(newErrors)
    }

    return (
        <>
            <PopUp isVisible={!!submissionError} msg={submissionError} color='red' />
            <div className='flex min-h-screen px-6'>
                <div className='m-auto container max-w-sm py-20'>
                    <div>
                        <h1 className='text-2xl tracking-tight'>{ type === 'login' ? 'Welcome back!': 'Join Quizwiz' }</h1>
                        {type === 'login' && <span className="block mt-3 leading-6">Not a member? <Link to='/register' className="text-indigo-600">Join quizwiz</Link></span>}
                        {type === 'register' && <span className="block mt-3 leading-6">Already have an account? <Link to='/login' className="text-indigo-600">Login</Link></span>}
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
                        {type === 'login' && (
                            <div className='flex items-center justify-between text-sm py-1'>
                                <div onClick={() => setRememberMe(!rememberMe)} className='flex items-center space-x-2 cursor-pointer'>
                                    <div className={'h-4 w-4 ring-1 ring-slate-300 rounded flex items-center justify-center' + (rememberMe ? ' bg-slate-900 !ring-slate-900 text-white' : '')}>
                                        <CheckIcon className='w-3 h-3 text-white' />
                                    </div>
                                    <div>Remember me</div>
                                </div>
                                <Link to='/recover' className="text-indigo-600">Forgot password?</Link>
                            </div>
                        )}
                        <div className={type === 'register' ? '!mt-7' : ''}>
                            <button onClick={handleSubmit} disabled={isLoading} className='relative primary w-full disabled:text-transparent'>
                                <span>{type === 'login' ? 'Login' : 'Create account'}</span>
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
        </>
    )
}