import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import getToken from "../utilities/getToken"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import {Link} from "react-router-dom"
import CrossIcon from "../icons/CrossIcon"
import CheckIcon from "../icons/CheckIcon"
import {QuizWithResponses} from "../types"
import getTimeLabel from "../utilities/getTimeLabel"
import FullScreenPopUp from "../components/FullScreenPopUp"
import AvatarIcon from "../icons/AvatarIcon"
import ChatBubblesIcon from "../icons/ChatBubblesIcon";
import Header from "../components/Header";

export default function Responses() {
    const [quizWithResponses, setQuizWithResponses] = useState<QuizWithResponses>()
    const [retrievalError, setRetrievalError] = useState('')

    const [currentResponse, setCurrentResponse] = useState<QuizWithResponses['responses'][0]>()
    const [isResponseOpen, setIsResponseOpen] = useState(false)

    const {id: quizId} = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/${quizId}/responses`, {headers: {Authorization: `Bearer ${getToken()}`}})
            .then(response => {
                setQuizWithResponses(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [quizId])

    return (
        <>
            <Header />
            {quizWithResponses && (
                <>
                    <FullScreenPopUp isVisible={isResponseOpen} close={() => setIsResponseOpen(false)} className='max-w-2xl w-full p-6 sm:p-12' >
                        <>
                            {currentResponse && (
                                <>
                                    {currentResponse.user ? (
                                        <Link to={`/users/${currentResponse.user._id.$oid}`} className='max-sm:pt-8 mb-14 pb-14 border-b flex items-center space-x-2'>
                                            {currentResponse.user.img ? (
                                                <img src={currentResponse.user.img} className='h-12 w-12 rounded-full' />
                                            ):(
                                                <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                            )}
                                            <div className='pl-1 space-y-0.5'>
                                                <div>{currentResponse.user.username}</div>
                                                <div className='text-slate-400 text-sm'>{getTimeLabel(currentResponse.created_on)}</div>
                                            </div>
                                        </Link>
                                    ):(
                                        <div className='max-sm:pt-8 mb-14 pb-14 border-b flex items-center space-x-2'>
                                            <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                            <div className='pl-1 space-y-0.5'>
                                                <div>[anonymous]</div>
                                                <div className='text-slate-400 text-sm'>{getTimeLabel(currentResponse.created_on)}</div>
                                            </div>
                                        </div>
                                    )}
                                    <h2 className='subtitle'>Breakdown</h2>
                                    <p className='mt-4'>The percentages in each answer choice represent the number of users who picked that choice.</p>
                                    <div className='mt-12 space-y-14'>
                                        {quizWithResponses.questions.map((question, questionIndex) => {
                                            const chosenAnswerId = currentResponse.answers.find(a => a.question_id.$oid === question._id.$oid)!.choice_id
                                            return (
                                                <div>
                                                    <div className='mb-1.5 text-slate-400 text-sm font-semibold'>{questionIndex + 1}/{quizWithResponses.questions.length}</div>
                                                    <p className='italic'>{question.title}</p>
                                                    <div className='mt-6 space-y-2.5'>
                                                        {question.options.map((option, index) => (
                                                            <div className='relative'>
                                                                <div className={'border py-2.5 px-3 rounded flex space-x-2 ' + (chosenAnswerId.$oid === option._id.$oid ? 'border-sky-600' : '')}>
                                                                    {option.is_correct ? (
                                                                        <div className='pt-1.5 shrink-0'>
                                                                            <CheckIcon className='h-4 w-4 text-green-600 shrink-0' strokeWidth={2} />
                                                                        </div>
                                                                    ):(
                                                                        <div className='pt-1.5 shrink-0'>
                                                                            <CrossIcon className='h-4 w-4 text-red-600 shrink-0' />
                                                                        </div>
                                                                    )}
                                                                    <p>{option.body}</p>
                                                                    <p className='text-slate-400 text-sm !ml-auto mt-auto'>{option.pick_rate}%</p>

                                                                </div>
                                                                <div style={{width: `${option.pick_rate}%`}} className='absolute top-0 left-0 z-[-1] h-full bg-slate-100/80 rounded-md dark:bg-gray-800'></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {currentResponse.elapsed_time && <div className='mt-12 text-sm text-slate-400'>The user completed the quiz in {currentResponse.elapsed_time} minutes</div>}
                                    <div className='mb-14 pb-14 border-b'></div>
                                    <h2 className='subtitle'>Comparison</h2>
                                    <p className='mt-4'>The percentages represent the number of correct answers that each user picked.</p>
                                    <div className='max-sm:pb-12 mt-12 space-y-2.5'>
                                        {quizWithResponses.responses.map((r, index) => (
                                            <div className={'relative border p-3 rounded-md ' + (r._id.$oid === currentResponse._id.$oid ? 'border-sky-600' : '')}>
                                                {r.user ? (
                                                    <Link to={`/users/${r.user._id.$oid}`} className='flex items-center justify-between'>
                                                        <div className='flex items-center space-x-1.5'>
                                                            {r.user.img ? (
                                                                <img src={r.user.img} className='h-8 w-8 rounded-full' />
                                                            ):(
                                                                <AvatarIcon className='h-8 w-8 text-slate-400/50 !bg-slate-200/80 dark:!bg-gray-700/80' />
                                                            )}
                                                            <div className='pl-1 text-sm'>{r.user.username}</div>
                                                        </div>
                                                        <div className='text-slate-400'>{r.correctness}%</div>
                                                    </Link>
                                                ):(
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center space-x-1.5'>
                                                            <AvatarIcon className='h-10 w-10 text-slate-400/50 !bg-slate-200/80 dark:!bg-gray-700/80' />
                                                            <div className='pl-1 text-sm'>[anonymous]</div>
                                                        </div>
                                                        <div className='text-slate-400'>{r.correctness}%</div>
                                                    </div>
                                                )}
                                                <div style={{width: `${r.correctness}%`}} className='absolute top-0 left-0 z-[-1] h-full bg-slate-100/80 dark:bg-gray-800'></div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    </FullScreenPopUp>
                    <div className='m-auto container max-w-screen-sm pt-40 pb-20 px-6'>
                        <h1 className='text-2xl tracking-[-0.015em]'>Responses for "{quizWithResponses.title}"</h1>
                        <Link to={`/quizzes/${quizId}`} className='mt-4 block text-sky-600 font-medium' >View quiz</Link>
                        <div className='mt-10 divide-y'>
                            {quizWithResponses.responses.length > 0 ? (
                                quizWithResponses.responses.map((r, responseIndex) => (
                                    <div className='py-5'>
                                        <div className='flex items-center justify-between'>
                                            {r.user ? (
                                                <Link to={`/users/${r.user._id.$oid}`} className='flex items-center space-x-2'>
                                                    {r.user.img ? (
                                                        <img src={r.user.img} className='h-12 w-12 rounded-full' />
                                                    ):(
                                                        <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                                    )}
                                                    <div className='pl-1 space-y-0.5'>
                                                        <div>{r.user.username}</div>
                                                        <div className='text-slate-400 text-sm'>{getTimeLabel(r.created_on)}</div>
                                                    </div>
                                                </Link>
                                            ):(
                                                <div className='flex items-center space-x-2'>
                                                    <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                                                    <div className='pl-1 space-y-0.5'>
                                                        <div>[anonymous]</div>
                                                        <div className='text-slate-400 text-sm'>{getTimeLabel(r.created_on)}</div>
                                                    </div>
                                                </div>
                                            )}
                                            <button className='secondary' onClick={() => {
                                                setCurrentResponse(r)
                                                setIsResponseOpen(true)
                                            }}>View</button>
                                        </div>
                                    </div>
                                ))
                            ):(
                                <div className='w-full pt-12 flex justify-center'>
                                    <div className='text-center max-w-md'>
                                        <ChatBubblesIcon className='h-10 w-10 text-slate-400/60 mx-auto dark:text-gray-600' />
                                        <div className='mt-5 subtitle'>No responses</div>
                                        <p className='mt-3'>No user has decided to take this quiz yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quizWithResponses || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}