import PopUp from "../components/PopUp"
import Joi from "joi"
import {Link, useNavigate} from "react-router-dom"
import getCurrentUser from "../utilities/getCurrentUser"
import {useEffect, useState} from "react"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import Spinner from "../icons/Spinner"

export default function Join() {
    const schema = Joi.object({
        username: Joi.string().min(1).max(60).required(),
        email: Joi.string().email({ tlds: { allow: false } }).min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required()
    })
    const navigate = useNavigate()
    const currentUser = getCurrentUser()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
        const { error } = schema.validate({ username, email, password }, { abortEarly: false })
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            setIsLoading(true)
            // create account
            axios.post(`${process.env.REACT_APP_API_URL}/users`, { username, email, password, created_on: new Date().getTime(), updated_on: new Date().getTime() })
                .then(response => {
                    localStorage.setItem('jwt', response.data)
                    localStorage.setItem('rememberMe', 'yes')
                    window.location.href = `${window.location.origin}`
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
                            <h1 className='text-2xl tracking-[-0.01em]'>Join Quizwiz</h1>
                            <span className="block mt-3 leading-6">Already have an account? <Link to='/login' className="text-sky-600">Login</Link></span>
                        </div>
                        <div className='mt-10 space-y-5'>
                            <div>
                                <label htmlFor='username' className='text-sm'>Username</label>
                                <input type='text' name='username' id='username' className='mt-2 w-full' value={username} onChange={e => setUsername(e.target.value)} />
                                {errors.username && (
                                    <div className='mt-2 text-red-600 text-sm first-letter:capitalize'>{errors.username}</div>
                                )}
                            </div>
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
                            <div className='!mt-7'>
                                <button onClick={handleSubmit} disabled={isLoading} className='relative primary w-full disabled:text-transparent'>
                                    <span>Create account</span>
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