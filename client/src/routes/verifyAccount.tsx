import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import CheckWithCircle from "../icons/CheckWithCircle"
import getToken from "../utilities/getToken"

export default function VerifyAccount() {
    const [retrievalError, setRetrievalError] = useState('')
    const [isASuccess, setIsASuccess] = useState(false)

    const {id: verificationId} = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/verify_account/${verificationId}`, {headers: {Authorization: `Bearer ${getToken()}`}})
            .then(response => {
                localStorage.setItem('jwt', response.data)
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
                        <p className='mt-3'>Your email has been verified successfully. You can now start using Quizwiz.</p>
                        <button onClick={() => window.location.href = window.location.origin} className='mt-7 mx-auto primary' >Start browsing</button>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(isASuccess || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}