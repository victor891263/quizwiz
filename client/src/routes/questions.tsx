import {Link, useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {QuizWithQuestions, QuizWithResponses} from "../types"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError"
import GenericLoadingScreen from "../components/GenericLoadingScreen"
import CheckIcon from "../icons/CheckIcon"
import ChevronIcon from "../icons/ChevronIcon"
import ArrowUpDown from "../icons/ArrowUpDown"
import PopUp from "../components/PopUp"
import ClockIcon from "../icons/ClockIcon"
import createTimer from "../utilities/createTimer"
import Spinner from "../icons/Spinner"
import getToken from "../utilities/getToken"
import convertTimeLabelToMinutes from "../utilities/convertTimeLabelToMinutes"

export default function Questions() {
    const [quizWithQuestions, setQuizWithQuestions] = useState<QuizWithQuestions>()
    const [retrievalError, setRetrievalError] = useState('')

    const [currentQuestionId, setCurrentQuestionId] = useState<string>()
    const [answers, setAnswers] = useState<QuizWithResponses['responses'][0]['answers']>([])

    const [isLoading, setIsLoading] = useState(false)
    const [operationError, setOperationError] = useState('')

    const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState(false)

    const [timeLabel, setTimeLabel] = useState('')
    const [isTimerExpired, setIsTimerExpired] = useState(false)

    const {id: quizId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/${quizId}/questions`)
            .then(response => {
                setQuizWithQuestions(response.data[0])
                setCurrentQuestionId(response.data[0].questions[0]._id.$oid)

                // set the timer if applicable
                if (response.data[0].time_limit) {
                    setTimeLabel(`${response.data[0].time_limit > 10 ? response.data[0].time_limit : `0${response.data[0].time_limit}`}:00`)
                    createTimer(response.data[0].time_limit, (label) => setTimeLabel(label), handleExpiredTimer)
                }
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [quizId])

    async function submitAnswers() {
        if (answers.length !== quizWithQuestions!.questions.length) {
            setOperationError('You need to answer every question')
            setTimeout(() => setOperationError(''), 3000)
            return
        }
        setIsLoading(true)
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/responses`, {answers, elapsed_time: convertTimeLabelToMinutes(timeLabel), created_on: new Date().getTime()}, {headers: {Authorization: `Bearer ${getToken()}`}})
            navigate(`/quizzes/${quizId}/results`)
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
                setIsLoading(false)
            })
        }
    }

    async function handleExpiredTimer() {
        setIsTimerExpired(true)
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizId}/expired`, undefined, {headers: {Authorization: `Bearer ${getToken()}`}})
        } catch (error) {
            handleAxiosError(error, (msg: string) => {
                setOperationError(msg)
                setTimeout(() => setOperationError(''), 3000)
            })
        }
    }

    function pickChoice(choiceId: string, questionId: string) {
        const newAnswers = [...answers]
        const answer = newAnswers.find(a => a.question_id.$oid === questionId)
        if (answer) answer.choice_id.$oid = choiceId
        else newAnswers.push({ question_id: { $oid: questionId }, choice_id: { $oid: choiceId } })
        setAnswers(newAnswers)
    }

    const currentQuestion = quizWithQuestions && quizWithQuestions.questions.find(q => q._id.$oid === currentQuestionId)
    const questionIds = quizWithQuestions && quizWithQuestions.questions.map(q => q._id.$oid)

    return (
        <>
            <PopUp isVisible={!!operationError} msg={operationError} color='red' />
            {(quizWithQuestions && currentQuestionId && currentQuestion && questionIds) && (
                <div className='flex min-h-screen px-6'>
                    {isTimerExpired ? (
                        <div className='m-auto max-w-md text-center py-12 sm:py-20'>
                            <ClockIcon className='h-10 w-10 text-slate-400/60 mx-auto' />
                            <div className='mt-5 subtitle'>Time is up!</div>
                            <p className='mt-3'>Unfortunately, you've ran out of time to finish the quiz. You can't try again but you can take other quizzes.</p>
                            <Link to={'/'} className='mt-7 w-fit block mx-auto primary' >Go home</Link>
                        </div>
                    ):(
                        <div className='m-auto container max-w-screen-sm py-12 sm:py-20'>
                            <div className='mb-10 pb-10 border-b flex justify-between items-end'>
                                <div className='relative w-fit'>
                                    <button onClick={() => setIsQuestionMenuOpen(!isQuestionMenuOpen)} className={'secondary flex items-center space-x-1 !pr-2 ' + (isQuestionMenuOpen ? 'bg-slate-100' : '')}>
                                        <div>Question: <span className='font-semibold'>{questionIds.indexOf(currentQuestion._id.$oid) + 1}</span></div>
                                        <ArrowUpDown className='h-5 w-5' />
                                    </button>
                                    {isQuestionMenuOpen && (
                                        <div className='absolute mt-2 w-full bg-white border rounded-md p-2 shadow max-h-52 overflow-y-auto'>
                                            {questionIds.map((q, index) => (
                                                <button onClick={() => setCurrentQuestionId(q)} className='flex items-center justify-between text-sm w-full py-1 px-2 rounded hover:bg-slate-100'>
                                                    <span>{index + 1}</span>
                                                    {!!answers.find(a => a.question_id.$oid === q) && (
                                                        <CheckIcon className='h-4 w-4 text-sky-600' strokeWidth={2} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {timeLabel && (
                                    <div className='flex items-center space-x-1.5'>
                                        <ClockIcon className='small-height small-width' />
                                        <div>{timeLabel}</div>
                                    </div>
                                )}
                            </div>
                            <div className='mb-1.5 text-slate-400 text-sm font-semibold'>{questionIds!.indexOf(currentQuestion._id.$oid) + 1}/{quizWithQuestions.questions.length}</div>
                            <p>{currentQuestion.title}</p>
                            <div className='mt-8 space-y-3.5'>
                                {currentQuestion.options.map((option, index) => (
                                    <div onClick={() => pickChoice(option._id.$oid, currentQuestion._id.$oid)} className='flex space-x-3 cursor-pointer '>
                                        <div className='pt-[3px]'>
                                            <div className={'h-5 w-5 rounded-full ' + (answers.find(a => a.choice_id.$oid === option._id.$oid) ? 'border-[5px] border-sky-600' : 'border border-slate-300')}></div>
                                        </div>
                                        <p>{option.body}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='mt-10 pt-10 border-t flex items-center justify-between'>
                                <div className='flex space-x-2'>
                                    {questionIds.indexOf(currentQuestionId) > 0 && (
                                        <button onClick={() => setCurrentQuestionId(questionIds[questionIds.indexOf(currentQuestionId) - 1])} className='secondary flex items-center !pl-2 max-sm:!pr-2 sm:space-x-1'>
                                            <ChevronIcon className='h-4 w-4 rotate-90' />
                                            <span className='max-sm:hidden'>Back</span>
                                        </button>
                                    )}
                                    {questionIds.indexOf(currentQuestionId) < (questionIds.length - 1) && (
                                        <button onClick={() => setCurrentQuestionId(questionIds[questionIds.indexOf(currentQuestionId) + 1])} className='secondary flex items-center !pr-2 max-sm:!pl-2 sm:space-x-1'>
                                            <span className='max-sm:hidden'>Next</span>
                                            <ChevronIcon className='h-4 w-4 -rotate-90' />
                                        </button>
                                    )}
                                </div>
                                <button onClick={submitAnswers} disabled={isLoading} className='relative block primary disabled:text-transparent'>
                                    <span>Submit</span>
                                    {isLoading && (
                                        <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                            <Spinner className='h-5 w-5 border-[3px] text-white' />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quizWithQuestions || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}