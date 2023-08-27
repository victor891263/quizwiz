import {useState} from "react"
import PopUp from "../components/PopUp"
import Spinner from "../icons/Spinner"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import {useParams} from "react-router-dom"

export default function Reset() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [submissionError, setSubmissionError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const {id: resetId} = useParams()

    function submitPassword() {
        if (!password) {
            setError('Password cannot be blank')
            return
        }
        if (password.length > 50) {
            setError('Password is too long')
            return
        }
        setIsLoading(true)
        axios.put(`${process.env.REACT_APP_API_URL}/reset/${resetId}`, {password})
            .then(() => {
                setSuccessMsg('Your password has been successfully updated')
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
                    <h1 className='text-2xl tracking-tight'>Reset password</h1>
                    <p className='mt-4'>You'll be able to use this new password the next time you sign in.</p>
                    <div className='mt-10 space-y-7'>
                        <div>
                            <label htmlFor='password' className='text-sm'>Password</label>
                            <input type='password' name='password' id='password' className='mt-2 w-full' value={password} onChange={e => setPassword(e.target.value)} />
                            {error && (
                                <div className='mt-2 text-red-600 text-sm'>{error}</div>
                            )}
                        </div>
                        <button onClick={submitPassword} disabled={isLoading} className='relative primary disabled:text-transparent'>
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