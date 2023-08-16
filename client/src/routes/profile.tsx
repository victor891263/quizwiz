import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import getToken from "../utilities/getToken"
import {User} from "../types"
import CalendarIcon from "../icons/CalendarIcon"
import LinkIcon from "../icons/LinkIcon"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import {profiles} from "../dummy/profiles"
import FullScreenPopUp from "../components/FullScreenPopUp"
import EditProfile from "../components/EditProfile"
import PopUp from "../components/PopUp"

export default function Profile() {
    const [profile, setProfile] = useState<User>()
    const [retrievalError, setRetrievalError] = useState('')
    const [operationError, setOperationError] = useState('')
    const [operationSuccess, setOperationSuccess] = useState('')
    const [isEditOpen, setIsEditOpen] = useState(false)

    const { userId } = useParams()

    useEffect(() => {
        setProfile(profiles[0])
        /*
        axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then(response => {
                setProfile(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })

         */
    }, [userId])

    return (
        <>
            {profile && (
                <>
                    <FullScreenPopUp isVisible={isEditOpen} close={() => setIsEditOpen(false)} className='max-w-screen-sm w-full p-10' >
                        <EditProfile
                            profile={profile}
                            updateDetails={details => setProfile({...profile, ...details})}
                            updateNewEmail={email => setProfile({...profile, new_email: {...profile.new_email, address: email}})}
                            setError={msg => setOperationError(msg)}
                            setSuccess={msg => setOperationSuccess(msg)}
                            operationError={operationError}
                            operationSuccess={operationSuccess}
                        />
                    </FullScreenPopUp>
                    <PopUp isVisible={!!operationError} msg={operationError} color='red' />
                    <PopUp isVisible={!!operationSuccess} msg={operationSuccess} color='green' />
                    <div className='m-auto container max-w-screen-md py-20 px-6'>
                        <div className='grid grid-cols-[max-content_auto]'>
                            <div className='bg-slate-100 rounded-full h-24 w-24'></div>
                            <div className='pl-12 relative'>
                                <button onClick={() => setIsEditOpen(true)} className='absolute top-0 right-0 secondary'>Edit profile</button>
                                <div>
                                    <div className='subtitle'>{profile.name || profile.username}</div>
                                    <div className='mt-0.5 text-slate-400'>@{profile.username}</div>
                                </div>
                                <div className='mt-7 space-y-1.5'>
                                    <div className='flex items-center space-x-2 italic'>
                                        <CalendarIcon className='h-5 w-5' />
                                        <div>Joined on {new Date(profile.created_on).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </div>
                                    {profile.link && (
                                        <div className='flex items-center space-x-2 italic'>
                                            <LinkIcon className='h-5 w-5' />
                                            <div>{profile.link}</div>
                                        </div>
                                    )}
                                </div>
                                {profile.about && (
                                    <p className='mt-7'>{profile.about}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(profile || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}