import {Link, useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {Quiz} from "../types"
import getTimeLabel from "../utilities/getTimeLabel"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import axios from "axios"
import getToken from "../utilities/getToken"
import handleAxiosError from "../utilities/handleAxiosError"
import DislikeIcon from "../icons/DislikeIcon"
import LikeIcon from "../icons/LikeIcon"
import Spinner from "../icons/Spinner"
import PopUp from "../components/PopUp"
import handleTextareaResize from "../utilities/handleTextareaResize"
import ExclaimationIcon from "../icons/ExclaimationIcon"
import getCurrentUser from "../utilities/getCurrentUser"
import AvatarIcon from "../icons/AvatarIcon"
import CrossWithCircle from "../icons/CrossWithCircle";
import ChatBubblesIcon from "../icons/ChatBubblesIcon";
import ClockIcon from "../icons/ClockIcon";
import Comment from "../components/Comment";
import PencilIcon from "../icons/PencilIcon";
import TrashIcon from "../icons/TrashIcon";
import Header from "../components/Header";
import UserIcon from "../icons/UserIcon";

export default function QuizComponent() {
    const [quiz, setQuiz] = useState<Quiz>()
    const [retrievalError, setRetrievalError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [operationError, setOperationError] = useState('')

    const [commentBody, setCommentBody] = useState('')
    const [commentBodyError, setCommentBodyError] = useState('')

    const {id: quizId} = useParams()
    const currentUser = getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/${quizId}`, {headers: {Authorization: `Bearer ${getToken()}`}})
            .then(response => {
                setQuiz(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [quizId])

    async function reactToQuiz(e: any, type: 'like' | 'dislike') {
        if (quiz && currentUser) {
            e.target.disabled = true
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/${type}`, undefined, {headers: {Authorization: `Bearer ${getToken()}`}})
                // update the current quiz stored in the state
                const newQuiz = {...quiz}
                // because of the mongoengine's weird issue, likes and dislikes cannot be removed once they are made - "unliking" is not possible for example
                if (type === 'like') newQuiz.liked_users.push({ $oid: currentUser._id })
                if (type === 'dislike') newQuiz.disliked_users.push({ $oid: currentUser._id })
                setQuiz(newQuiz)
            } catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setOperationError(msg)
                    setTimeout(() => setOperationError(''), 3000)
                })
            }
            e.target.disabled = false
        }
    }

    async function submitComment() {
        setCommentBodyError('')
        if (commentBody.length < 1) {
            setCommentBodyError('Comment cannot be blank')
            return
        }
        if (commentBody.length > 500) {
            setCommentBodyError('Comment is too long')
            return
        }
        setIsLoading(true)
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments`, {commentBody, created_on: new Date().getTime(), updated_on: new Date().getTime()}, {headers: {Authorization: `Bearer ${getToken()}`}})
            navigate(0)
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
            })
        }
        setIsLoading(false)
    }

    async function deleteQuiz() {
        setIsDeleting(true)
        console.log('triggered', isDeleting)
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/tests/${quizId}`, {headers: {Authorization: `Bearer ${getToken()}`}})
            navigate('/')
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
            })
        }
        setIsDeleting(false)
        console.log('done', isDeleting)
    }

    async function reactToComment(e: any, commentId: string, type: 'like' | 'dislike') {
        if (quiz && currentUser) {
            e.target.disabled = true
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments/${commentId}/${type}`, undefined, {headers: {Authorization: `Bearer ${getToken()}`}})
                // update the comment of the current quiz stored in the state
                const newQuiz = {...quiz}
                const commentToUpdate = newQuiz.comments.find(c => c._id.$oid === commentId)!
                // because of the mongoengine's weird issue, likes and dislikes cannot be removed once they are made - "unliking" is not possible for example
                if (type === 'like') commentToUpdate.liked_users.push({ $oid: currentUser._id })
                if (type === 'dislike') commentToUpdate.disliked_users.push({ $oid: currentUser._id })
                setQuiz(newQuiz)
            } catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setOperationError(msg)
                    setTimeout(() => setOperationError(''), 3000)
                })
            }
            e.target.disabled = false
        }
    }

    async function updateComment(e:any, commentId: string, newComment:string) {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments/${commentId}`, {newComment, updated_on: new Date().getTime()}, {headers: {Authorization: `Bearer ${getToken()}`}})
            navigate(0)
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
            })
        }
    }

    async function deleteComment(e:any, commentId: string) {
        e.target.disabled = true
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments/${commentId}`, {headers: {Authorization: `Bearer ${getToken()}`}})
            navigate(0)
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
                e.target.disabled = false
            })
        }
    }

    return (
        <>
            <Header />
            <PopUp isVisible={!!operationError} msg={operationError} color='red' />
            {quiz && (
                <div className='m-auto container max-w-screen-md pt-40 pb-20 px-6'>
                    <div className='space-y-6'>
                        {quiz.user ? (
                            <Link to={`/users/${quiz.user._id.$oid}`} className='flex items-center space-x-2 w-fit'>
                                {quiz.user.img ? (
                                    <img src={quiz.user.img} className='h-12 w-12 rounded-full' />
                                ):(
                                    <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                )}
                                <div className='pl-1 space-y-0.5'>
                                    <div>{quiz.user.username}</div>
                                    <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.created_on)}</div>
                                </div>
                            </Link>
                        ):(
                            <div className='flex items-center space-x-2'>
                                <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                <div className='pl-1 space-y-0.5'>
                                    <div>[anonymous]</div>
                                    <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.created_on)}</div>
                                </div>
                            </div>
                        )}
                        <h1 className='text-3xl font-bold tracking-[0]'>{quiz.title}</h1>
                        <div className='flex gap-x-4'>
                            <div><span className='font-semibold'>{quiz.questions}</span> questions</div>
                            <div><span className='font-semibold'>{quiz.responses}</span> responses</div>
                        </div>
                        {quiz.time_limit && (
                            <div className='flex items-center space-x-2'>
                                <div className='font-bold'>Timer:</div>
                                <div>{quiz.time_limit} minutes</div>
                            </div>
                        )}
                        <p className='text-lg leading-[1.65] whitespace-break-spaces'>{quiz.description}</p>
                        <div className='pt-2.5 pb-3 flex flex-wrap gap-2'>
                            {quiz.tags.map((tag, index) => (
                                <div className='bg-slate-100 rounded-md py-1.5 px-2.5 text-slate-400 uppercase' key={index}>{tag}</div>
                            ))}
                        </div>
                        <div className='flex gap-x-4 italic'>
                            <div><span className='font-semibold'>{quiz.liked_users.length}</span> likes</div>
                            <div><span className='font-semibold'>{quiz.disliked_users.length}</span> dislikes</div>
                            <div><span className='font-semibold'>{quiz.comments.length}</span> comments</div>
                        </div>
                    </div>
                    {currentUser && (
                        <>
                            {quiz.is_response_submitted && (
                                <div className='pt-11 mt-11 border-t'>
                                    <div className=''>
                                        <Link to={`/quizzes/${quizId}/results`} className='block w-fit primary'>View your results</Link>
                                    </div>
                                </div>
                            )}
                            {(!!quiz.blocked_users.find(u => u.$oid === currentUser._id)) && (
                                <div className='pt-11 mt-11 border-t'>
                                    <div className='bg-slate-100 p-4 pr-5 text-slate-500 rounded-lg flex space-x-2.5'>
                                        <div className='pt-0.5'><ClockIcon className='h-5 w-5' /></div>
                                        <span className='font-medium tracking-[-0.005em]'>You failed to complete this test in time. You cannot retake.</span>
                                    </div>
                                </div>
                            )}
                            {((quiz.user?._id.$oid !== currentUser._id) && (!quiz.is_response_submitted) && (!quiz.blocked_users.find(u => u.$oid === currentUser._id))) && (
                                <div className='pt-11 mt-11 border-t'>
                                    <Link to={`/quizzes/${quizId}/questions`} className='block w-fit primary'>Take the quiz</Link>
                                </div>
                            )}
                        </>
                    )}
                    {(!currentUser) && (
                        <div className='pt-11 mt-11 border-t'>
                            <div className='bg-slate-100 p-4 pr-5 text-slate-500 rounded-lg flex space-x-2.5'>
                                <div className='pt-0.5'><UserIcon className='h-5 w-5' /></div>
                                <span className='font-medium tracking-[-0.005em]'>Only logged in users can take the quiz.</span>
                            </div>
                        </div>
                    )}
                    {currentUser && (
                        ((quiz.user && (currentUser._id === quiz.user._id.$oid)) ? (
                            <div className='pt-11 mt-11 border-t'>
                                <div className='flex space-x-2.5'>
                                    <Link to={`/quizzes/${quizId}/responses`} className='secondary' >View responses</Link>
                                    <Link to={`/quizzes/${quizId}/edit`} className='secondary' >
                                        <span className='max-[440px]:hidden'>Edit quiz</span>
                                        <div className='min-[440px]:hidden h-full w-full flex items-center justify-center'><PencilIcon className='small-height small-width' /></div>
                                    </Link>
                                    <button onClick={deleteQuiz} disabled={isDeleting} className='relative secondary'>
                                        <span className={'max-[440px]:hidden ' + (isDeleting ? 'text-transparent' : 'text-red-600')}>Delete quiz</span>
                                        <div className={'min-[440px]:hidden h-full w-full flex items-center justify-center ' + (isDeleting ? 'text-transparent' : 'text-red-600')}><TrashIcon className='h-[18px] w-[18px]' /></div>
                                        {isDeleting && (
                                            <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                                <Spinner className='h-5 w-5 border-[3px] text-slate-500' />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ):(
                            <div className='pt-11 mt-11 border-t'>
                                <div className='flex space-x-2.5'>
                                    <button
                                        onClick={(e) => reactToQuiz(e,'like')}
                                        disabled={(!!quiz.liked_users.find(u => u.$oid === currentUser._id)) || (!!quiz.disliked_users.find(u => u.$oid === currentUser._id))}
                                        className='secondary flex items-center space-x-1.5'
                                    >
                                        {quiz.liked_users.find(u => u.$oid === currentUser._id) ? (
                                            <>
                                                <LikeIcon fill={true} className='w-4 h-4 rotate-180 scale-x-[-1]' />
                                                <span className='font-semibold'>Liked</span>
                                            </>
                                        ):(
                                            <>
                                                <LikeIcon className='w-4 h-4 rotate-180 scale-x-[-1]' />
                                                <span>Like</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => reactToQuiz(e,'dislike')}
                                        disabled={(!!quiz.liked_users.find(u => u.$oid === currentUser._id)) || (!!quiz.disliked_users.find(u => u.$oid === currentUser._id))}
                                        className='secondary flex items-center space-x-1.5'
                                    >
                                        {quiz.disliked_users.find(u => u.$oid === currentUser._id) ? (
                                            <>
                                                <LikeIcon fill={true} className='w-4 h-4' />
                                                <span className='font-semibold'>Disliked</span>
                                            </>
                                        ):(
                                            <>
                                                <LikeIcon className='w-4 h-4' />
                                                <span>Dislike</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    <div className='pt-11 mt-11 border-t'>
                        <h2 className='subtitle mb-10'>Comments ({quiz.comments.length})</h2>
                        {currentUser ? (
                            <div className='relative'>
                                <textarea className='w-full h-32 !py-2.5 !px-3.5 !pb-16' placeholder='What are your thoughts?' value={commentBody} onChange={e => {
                                    handleTextareaResize(e)
                                    setCommentBody(e.target.value)
                                }} />
                                <div className='absolute bottom-2.5 right-2.5'>
                                    <button onClick={submitComment} disabled={isLoading} className='ml-auto relative block primary disabled:text-transparent'>
                                        <span>Post</span>
                                        {isLoading && (
                                            <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                                <Spinner className='h-5 w-5 border-[3px] text-white' />
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <div className='absolute bottom-2.5 left-3.5 text-sm text-slate-400'>{commentBody.length}/500</div>
                            </div>
                        ):(
                            <div className='bg-slate-100 p-4 pr-5 text-slate-500 rounded-lg flex space-x-2.5'>
                                <div className='pt-0.5'><UserIcon className='h-5 w-5' /></div>
                                <span className='font-medium tracking-[-0.005em]'>Only logged in users can post a comment</span>
                            </div>
                        )}
                        {commentBodyError && (
                            <div className='mt-2.5 text-red-600 text-sm first-letter:capitalize'>{commentBodyError}</div>
                        )}

                        <div className='mt-2 divide-y'>
                            {quiz.comments.length > 0 ? (
                                quiz.comments.map((comment, index) => (
                                    <Comment comment={comment} currentUser={currentUser!} reactToComment={reactToComment} updateComment={updateComment} deleteComment={deleteComment} isError={!!operationError} />
                                ))
                            ):(
                                <div className='w-full pt-12 flex justify-center'>
                                    <div className='text-center max-w-md'>
                                        <ChatBubblesIcon className='h-10 w-10 text-slate-400/60 mx-auto dark:text-gray-600' />
                                        <div className='mt-5 subtitle'>No comments</div>
                                        <p className='mt-3'>No user has added a comment to this quiz.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quiz || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}
