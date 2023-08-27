import {useEffect, useState} from "react"
import {QuizWithResponses} from "../types"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import getTimeLabel from "../utilities/getTimeLabel"
import CheckIcon from "../icons/CheckIcon"
import CrossIcon from "../icons/CrossIcon"
import {Link, useParams} from "react-router-dom"
import AvatarIcon from "../icons/AvatarIcon"
import axios from "axios"
import getToken from "../utilities/getToken"
import handleAxiosError from "../utilities/handleAxiosError"
import Header from "../components/Header";

export default function Results() {
    const [quiz, setQuiz] = useState<QuizWithResponses>()
    const [retrievalError, setRetrievalError] = useState('')

    const {id: quizId} = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/${quizId}/answer`, {headers: {Authorization: `Bearer ${getToken()}`}})
            .then(response => {
                setQuiz(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [quizId])

    return (
        <>
            <Header />
            {quiz && (
                <div className='m-auto max-w-screen-sm px-6 pt-40 pb-20'>
                    <h1 className='mb-14 text-2xl font-bold tracking-[0]'>Your results for "{quiz.title}"</h1>
                    {quiz.responses[0].user ? (
                        <Link to={`/users/${quiz.responses[0].user._id.$oid}`} className='mb-14 pb-14 border-b flex items-center space-x-2'>
                            {quiz.responses[0].user.img ? (
                                <img src={quiz.responses[0].user.img} className='h-12 w-12 rounded-full' />
                            ):(
                                <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                            )}
                            <div className='pl-1 space-y-0.5'>
                                <div>{quiz.responses[0].user.username}</div>
                                <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.responses[0].created_on)}</div>
                            </div>
                        </Link>
                    ):(
                        <div className='mb-14 pb-14 border-b flex items-center space-x-2'>
                            <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                            <div className='pl-1 space-y-0.5'>
                                <div>[anonymous]</div>
                                <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.responses[0].created_on)}</div>
                            </div>
                        </div>
                    )}
                    <h2 className='subtitle'>Breakdown</h2>
                    <p className='mt-4'>The percentages in each answer choice represent the number of users who picked that choice.</p>
                    <div className='mt-12 space-y-14'>
                        {quiz.questions.map((question, questionIndex) => {
                            const chosenAnswerId = quiz.responses[0].answers.find(a => a.question_id.$oid === question._id.$oid)!.choice_id
                            return (
                                <div>
                                    <div className='mb-1.5 text-slate-400 text-sm font-semibold'>{questionIndex + 1}/{quiz.questions.length}</div>
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
                    <div className='mt-12 text-sm text-slate-400'>The user completed the quiz in {quiz.responses[0].elapsed_time} minutes</div>
                    <div className='mb-14 pb-14 border-b'></div>
                    <h2 className='subtitle'>Comparison</h2>
                    <p className='mt-4'>The percentages represent the number of correct answers that each user picked.</p>
                    <div className='mt-12 space-y-2.5'>
                        {quiz.correctness_of_responses!.map((r, index) => (
                            <div className={'relative border p-3 rounded-md ' + (r._id.$oid === quiz.responses[0]._id.$oid ? 'border-sky-600' : '')}>
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
                    <div className='mt-14 pt-14 border-t'>
                        <Link className='primary block w-fit' to={'/'} >Go home</Link>
                    </div>
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quiz || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}