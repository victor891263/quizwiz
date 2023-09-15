import {useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import CheckWithCircle from "../icons/CheckWithCircle"
import getToken from "../utilities/getToken"
import getCurrentUser from "../utilities/getCurrentUser"

export default function VerifyEmail() {
    const [retrievalError, setRetrievalError] = useState('')
    const [isASuccess, setIsASuccess] = useState(false)

    const {id: verificationId} = useParams()
    const currentUser = getCurrentUser()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/verify_new_email/${verificationId}`, {headers: {Authorization: `Bearer ${getToken()}`}})
            .then(response => {
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
                        <p className='mt-3'>Your new email has been verified successfully and your profile has been updated.</p>
                        <Link to={`/users/${currentUser!._id}`} className='mt-7 block w-fit mx-auto primary' >View profile</Link>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(isASuccess || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}