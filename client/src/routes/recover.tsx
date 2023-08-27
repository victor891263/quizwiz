import {useState} from "react"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import Spinner from "../icons/Spinner"
import PopUp from "../components/PopUp"

export default function Recover() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [submissionError, setSubmissionError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    function submitEmail() {
        if (!email) {
            setError('Email address cannot be blank')
            return
        }
        if (email.length > 50) {
            setError('Email address is too long')
            return
        }
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
            setError('You need to enter a valid email address')
            return
        }
        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL}/recover`, {email})
            .then(() => {
                setSuccessMsg('Recovery instructions has been sent to your email address')
                setTimeout(() => setSuccessMsg(''), 3000)
                setIsLoading(false)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => {
                    setSubmissionError(msg)
                    setTimeout(() => setSubmissionError(''), 3000)
                })
                setIsLoading(false)
            })
    }

    return (
        <>
            <PopUp isVisible={!!successMsg} msg={successMsg} color='green' />
            <PopUp isVisible={!!submissionError} msg={submissionError} color='red' />
            <div className='flex items-center justify-center min-h-screen px-6'>
                <div className='container max-w-sm py-20'>
                    <h1 className='text-2xl tracking-tight'>Recover account</h1>
                    <p className='mt-4'>Instructions on how to recover your account will be sent to the email address.</p>
                    <div className='mt-10 space-y-7'>
                        <div>
                            <label htmlFor='email' className='text-sm'>Email address</label>
                            <input type='text' name='email' id='email' className='mt-2 w-full' value={email} onChange={e => setEmail(e.target.value)} />
                            {error && (
                                <div className='mt-2 text-red-600 text-sm'>{error}</div>
                            )}
                        </div>
                        <button onClick={submitEmail} disabled={isLoading} className='relative primary disabled:text-transparent'>
                            <span>Confirm</span>
                            {isLoading && (
                                <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                    <Spinner className='h-5 w-5 border-[3px] text-white' />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}