import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import getToken from "../utilities/getToken"
import {QuizBrief, User} from "../types"
import CalendarIcon from "../icons/CalendarIcon"
import LinkIcon from "../icons/LinkIcon"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import FullScreenPopUp from "../components/FullScreenPopUp"
import EditProfile from "../components/EditProfile"
import PopUp from "../components/PopUp"
import {profiles} from "../dummy/profiles"
import {quizzes as dummyQuizzes} from "../dummy/quizzes"
import QuizBriefComponent from "../components/quizBrief"
import ArrowUpDown from "../icons/ArrowUpDown"
import CheckIcon from "../icons/CheckIcon"
import AvatarIcon from "../icons/AvatarIcon";

export default function Profile() {
    type Filters = 'Date' | 'Impression' | 'Questions' | 'Responses' | 'Title'

    const [profile, setProfile] = useState<User>()
    const [quizzes, setQuizzes] = useState<QuizBrief[]>()
    const [retrievalError, setRetrievalError] = useState('')
    const [operationError, setOperationError] = useState('')
    const [operationSuccess, setOperationSuccess] = useState('')
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [sortBy, setSortBy] = useState<Filters>('Date')

    const { id: userId } = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`)
            .then(response => {
                setProfile(response.data.user_details)
                setQuizzes(response.data.quizzes)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [userId])

    function sortQuizzes(quizzes: QuizBrief[], attribute: Filters) {
        if (attribute === 'Date') {
            quizzes.sort((a, b) => {
                return - a.created_on + b.created_on
            })
            return quizzes
        }
        if (attribute === 'Impression') {
            quizzes.sort((a, b) => {
                return - (a.liked_users + a.disliked_users + a.comments) + (b.liked_users + b.disliked_users + b.comments)
            })
            return quizzes
        }
        if (attribute === 'Questions') {
            quizzes.sort((a, b) => {
                return - a.questions + b.questions
            })
            return quizzes
        }
        if (attribute === 'Responses') {
            quizzes.sort((a, b) => {
                return - a.responses + b.responses
            })
            return quizzes
        }
        if (attribute === 'Title') {
            quizzes.sort((a, b) => {
                if (a.title.toUpperCase() < b.title.toUpperCase()) return -1
                if (a.title.toUpperCase() > b.title.toUpperCase()) return 1
                return 0
            })
            return quizzes
        }
        return quizzes
    }

    const sortedQuizzes = quizzes ? sortQuizzes([...quizzes], sortBy) : []

    return (
        <>
            {(profile && quizzes) && (
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
                            {profile.img ? (
                                <img src={profile.img} className='h-24 w-24 rounded-full' />
                            ):(
                                <AvatarIcon className='h-24 w-24 text-slate-400/50' />
                            )}
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
                        <div className='mt-12 pt-12 border-t'>
                            <div className='flex items-end justify-between'>
                                <div className='text-sm text-slate-400'>{quizzes.length} quizzes found</div>
                                <div className='relative'>
                                    <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} disabled={!quizzes} className={'secondary flex items-center justify-between w-48 !pr-2 ' + (isSortMenuOpen ? 'bg-slate-100' : '')}>
                                        <div>Sort by: <span className='font-bold'>{sortBy}</span></div>
                                        <ArrowUpDown className='h-5 w-5' />
                                    </button>
                                    {isSortMenuOpen && (
                                        <div className='absolute mt-2 w-full bg-white border rounded-md p-2 shadow'>
                                            {['Date', 'Impression', 'Questions', 'Responses', 'Title'].map(item => (
                                                <button onClick={() => setSortBy(item as Filters)} className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100'>
                                                    <span className={sortBy === item ? 'font-semibold' : ''}>{item}</span>
                                                    {sortBy === item && <CheckIcon className='h-4 w-4 text-indigo-600' strokeWidth={2.5} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='divide-y'>
                                {sortedQuizzes.map(quiz => (
                                    <QuizBriefComponent quiz={quiz} />
                                ))}
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