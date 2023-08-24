

import {Link, useParams} from "react-router-dom"
import {longQuizzes as dummyQuizzes} from '../dummy/quizzes'
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
import ExclaimationIcon from "../icons/ExclaimationIcon";
import getCurrentUser from "../utilities/getCurrentUser";
import Avatar from "../components/avatar";
import AvatarIcon from "../icons/AvatarIcon";

export default function QuizComponent() {
    const [quiz, setQuiz] = useState<Quiz>()
    const [retrievalError, setRetrievalError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [operationError, setOperationError] = useState('')

    const [commentBody, setCommentBody] = useState('')
    const [commentBodyError, setCommentBodyError] = useState('')

    const [isEditBoxOpen, setIsEditBoxOpen] = useState(false)

    const {id: quizId} = useParams()
    const currentUser = getCurrentUser()

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
                await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/${type}`)
                // update the current quiz stored in the state
                const newQuiz = {...quiz}
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
            const {data: quizWithCommentAdded} = await axios.post(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments`, commentBody)
            setQuiz(quizWithCommentAdded)
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
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/tests/${quizId}`)
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
            })
        }
        setIsDeleting(false)
    }

    async function reactToComment(e: any, commentId: string, type: 'like' | 'dislike') {
        if (quiz && currentUser) {
            e.target.disabled = true
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/comments/${commentId}/${type}`)
                // update the comment of the current quiz stored in the state
                const newQuiz = {...quiz}
                const commentToUpdate = newQuiz.comments.find(c => c._id.$oid === commentId)!
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


    return (
        <>
            <PopUp isVisible={!!operationError} msg={operationError} color='red' />
            {quiz && (
                <div className='m-auto container max-w-screen-md py-20 px-6'>
                    <div className='space-y-6'>
                        {quiz.user ? (
                            <div className='flex items-center space-x-2'>
                                {quiz.user.img ? (
                                    <img src={quiz.user.img} className='h-12 w-12 rounded-full' />
                                ):(
                                    <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                )}
                                <div className='pl-1 space-y-0.5'>
                                    <div>{quiz.user.username}</div>
                                    <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.created_on)}</div>
                                </div>
                            </div>
                        ):(
                            <div className='flex items-center space-x-2'>
                                <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                <div className='pl-1 space-y-0.5'>
                                    <div>[anonymous]</div>
                                    <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.created_on)}</div>
                                </div>
                            </div>
                        )}
                        <h1 className='text-3xl font-bold tracking-tight'>{quiz.title}</h1>
                        <div className='flex gap-x-4 italic'>
                            <div><span className='font-semibold'>{quiz.questions}</span> questions</div>
                            <div><span className='font-semibold'>{quiz.responses}</span> responses</div>
                        </div>
                        <p className='text-lg leading-[1.75] whitespace-break-spaces'>{quiz.description}</p>
                        <div className='pt-1 pb-2 flex flex-wrap gap-2'>
                            {quiz.tags.map((tag, index) => (
                                <div className='bg-slate-100 rounded-md py-1.5 px-2.5 text-slate-500 uppercase' key={index}>{tag}</div>
                            ))}
                        </div>
                        <div className='flex gap-x-4 italic'>
                            <div><span className='font-semibold'>{quiz.liked_users.length}</span> likes</div>
                            <div><span className='font-semibold'>{quiz.disliked_users.length}</span> dislikes</div>
                            <div><span className='font-semibold'>{quiz.comments.length}</span> comments</div>
                        </div>
                    </div>
                    <div className='pt-11 mt-11 border-t'>
                        {quiz.is_response_submitted && (
                            <Link to={`/quizzes/${quizId}/results`} className='primary'>View your results</Link>
                        )}
                        {(!!(currentUser && quiz.blocked_users.find(u => u.$oid === currentUser._id))) && (
                            <div className='bg-slate-100 p-4 pr-5 text-slate-500 rounded-lg flex items-center space-x-2.5'>
                                <ExclaimationIcon className='h-[18px] w-[18px]' />
                                <span className='font-medium tracking-[-0.005em]'>You failed to complete this test in time. You cannot retake.</span>
                            </div>
                        )}
                        {!(quiz.is_response_submitted || (!!(currentUser && quiz.blocked_users.find(u => u.$oid === currentUser._id)))) && (
                            <Link to={`/quizzes/${quizId}/questions`} className='primary'>Take the quiz</Link>
                        )}
                    </div>
                    {currentUser && (
                        ((quiz.user && (currentUser._id === quiz.user._id.$oid)) ? (
                            <div className='pt-11 mt-11 border-t'>
                                <div className='flex space-x-2.5'>
                                    <Link to={`/quizzes/${quizId}/responses`} className='secondary' >View responses</Link>
                                    <button className='secondary' onClick={() => setIsEditBoxOpen(true)}>Edit quiz</button>
                                    <button onClick={deleteQuiz} disabled={isDeleting} className='relative secondary text-red-600 disabled:!text-transparent'>
                                        <span>Delete quiz</span>
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
                                        disabled={!!quiz.disliked_users.find(u => u.$oid === currentUser._id)}
                                        className='secondary flex items-center space-x-1.5'
                                    >
                                        {quiz.liked_users.find(u => u.$oid === currentUser._id) ? (
                                            <>
                                                <LikeIcon fill={true} className='w-5 h-5' />
                                                <span className='font-semibold'>Liked</span>
                                            </>
                                        ):(
                                            <>
                                                <LikeIcon className='w-5 h-5' />
                                                <span>Like</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => reactToQuiz(e,'dislike')}
                                        disabled={!!quiz.liked_users.find(u => u.$oid === currentUser._id)}
                                        className='secondary flex items-center space-x-1.5'
                                    >
                                        {quiz.disliked_users.find(u => u.$oid === currentUser._id) ? (
                                            <>
                                                <DislikeIcon fill={true} className='w-5 h-5' />
                                                <span className='font-semibold'>Disliked</span>
                                            </>
                                        ):(
                                            <>
                                                <DislikeIcon className='w-5 h-5' />
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
                        <div className='relative'>
                            <textarea className='w-full h-32 !pb-16' placeholder='What are your thoughts?' value={commentBody} onChange={e => {
                                handleTextareaResize(e)
                                setCommentBody(e.target.value)
                            }} />
                            <div className='absolute bottom-2.5 right-2.5'>
                                <button onClick={submitComment} disabled={isLoading} className='ml-auto relative block primary disabled:text-transparent'>
                                    <span>Submit</span>
                                    {isLoading && (
                                        <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                            <Spinner className='h-5 w-5 border-[3px] text-white' />
                                        </div>
                                    )}
                                </button>
                            </div>
                            <div className='absolute bottom-2 left-3 text-sm text-slate-400'>{commentBody.length}/500</div>
                        </div>
                        {commentBodyError && (
                            <div className='mt-2.5 text-red-600 text-sm first-letter:capitalize'>{commentBodyError}</div>
                        )}

                        <div className='mt-2 divide-y'>
                            {quiz.comments.map((comment, index) => (
                                <div className='space-y-5 py-11' key={index}>
                                    {quiz.user ? (
                                        <div className='flex items-center space-x-2'>
                                            {quiz.user.img ? (
                                                <img src={quiz.user.img} className='h-10 w-10 rounded-full' />
                                            ):(
                                                <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                                            )}
                                            <div className='pl-1 space-y-0.5'>
                                                <div className='text-sm font-semibold'>{comment.user.username}</div>
                                                <div className='text-slate-400 text-xs'>{getTimeLabel(comment.created_on)}</div>
                                            </div>
                                        </div>
                                    ):(
                                        <div className='flex items-center space-x-2'>
                                            <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                                            <div className='pl-1 space-y-0.5'>
                                                <div className='text-sm font-semibold'>[anonymous]</div>
                                                <div className='text-slate-400 text-xs'>{getTimeLabel(comment.created_on)}</div>
                                            </div>
                                        </div>
                                    )}
                                    <p>{comment.body}</p>
                                    <div className='flex gap-x-2 text-sm'>
                                        <button
                                            onClick={(e) => reactToComment(e, comment._id.$oid, 'like')}
                                            disabled={(!currentUser) || (!!comment.disliked_users.find(u => u.$oid === currentUser._id))}
                                            className='secondary !py-1 !px-2 flex items-center space-x-1'
                                        >
                                            {currentUser && comment.liked_users.find(u => u.$oid === currentUser._id) ? (
                                                <>
                                                    <LikeIcon fill={true} className='w-4 h-4' />
                                                    <span>{comment.liked_users.length}</span>
                                                </>
                                            ):(
                                                <>
                                                    <LikeIcon className='w-4 h-4' />
                                                    <span>{comment.liked_users.length}</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => reactToComment(e, comment._id.$oid, 'dislike')}
                                            disabled={(!currentUser) || (!!comment.liked_users.find(u => u.$oid === currentUser._id))}
                                            className='secondary !py-1 !px-2 flex items-center space-x-1'
                                        >
                                            {currentUser && comment.disliked_users.find(u => u.$oid === currentUser._id) ? (
                                                <>
                                                    <DislikeIcon fill={true} className='w-4 h-4' />
                                                    <span>{comment.disliked_users.length}</span>
                                                </>
                                            ):(
                                                <>
                                                    <DislikeIcon className='w-4 h-4' />
                                                    <span>{comment.disliked_users.length}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quiz || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}
