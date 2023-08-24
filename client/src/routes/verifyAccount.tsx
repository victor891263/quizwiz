import {useEffect, useState} from "react"
import {Link, useParams, useSearchParams} from "react-router-dom"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import CheckWithCircle from "../icons/CheckWithCircle"

export default function VerifyAccount() {
    const [retrievalError, setRetrievalError] = useState('')
    const [isASuccess, setIsASuccess] = useState(false)

    const {id: verificationId} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/${searchParams.get('mail') ? 'verify_new_email' : 'verify_account'}/${verificationId}`)
            .then(response => {
                if (!searchParams.get('mail')) localStorage.setItem('jwt', response.data)
                setIsASuccess(true)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [verificationId])

    return (
        <>
            {isASuccess && (
                <div className='flex items-center justify-center min-h-screen px-6'>
                    <div className='text-center max-w-md'>
                        <CheckWithCircle className='h-10 w-10 text-slate-400/60 mx-auto' />
                        <div className='mt-5 subtitle'>Successfully verified!</div>
                        <p className='mt-3'>{searchParams.get('mail') ? 'Your new email has been verified successfully and your profile has been updated.' : 'Your email has been verified successfully. You can now start using Quizwiz.'}</p>
                        <Link to='/' className='mt-7 primary block w-fit mx-auto' >Start browsing</Link>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(isASuccess || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}