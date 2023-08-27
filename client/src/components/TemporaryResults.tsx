import AvatarIcon from "../icons/AvatarIcon"
import CheckIcon from "../icons/CheckIcon"
import CrossIcon from "../icons/CrossIcon"
import {Link} from "react-router-dom"
import {QuizWithResponses} from "../types"

export default function TemporaryResults({quiz}: {quiz: QuizWithResponses}) {
    return (
        <div>
            <h1 className='mb-14 text-2xl font-bold tracking-tight'>Your results for "{quiz.title}"</h1>
            <div className='mb-14 pb-14 border-b flex items-center space-x-2'>
                <AvatarIcon className='h-12 w-12 text-slate-400/50' />
                <div className='pl-1 space-y-0.5'>
                    <div>[anonymous]</div>
                    <div className='text-slate-400 text-sm'>Now</div>
                </div>
            </div>
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
                                        <div className={'border py-2.5 px-3 rounded-md flex space-x-2 ' + (chosenAnswerId.$oid === option._id.$oid ? 'border-indigo-600' : '')}>
                                            {option.is_correct ? (
                                                <div className='pt-1.5'>
                                                    <CheckIcon className='h-4 w-4 text-green-600 shrink-0' strokeWidth={2} />
                                                </div>
                                            ):(
                                                <div className='pt-1.5'>
                                                    <CrossIcon className='h-4 w-4 text-red-600 shrink-0' />
                                                </div>
                                            )}
                                            <p>{option.body}</p>
                                            <p className='text-slate-400 text-sm !ml-auto mt-auto'>{option.pick_rate}%</p>

                                        </div>
                                        <div style={{width: `${option.pick_rate}%`}} className='absolute top-0 left-0 z-[-1] h-full bg-slate-100/80 rounded-md'></div>
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
                    <div className={'relative border p-3 rounded-lg ' + (r._id.$oid === quiz.responses[0]._id.$oid ? 'border-indigo-600' : '')}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-1.5'>
                                <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                                <div className='pl-1 text-sm'>[anonymous]</div>
                            </div>
                            <div className='text-slate-400'>{r.correctness}%</div>
                        </div>
                        <div style={{width: `${r.correctness}%`}} className='absolute top-0 left-0 z-[-1] h-full bg-slate-100/80'></div>
                    </div>
                ))}
            </div>
            <div className='mt-14 pt-14 border-t'>
                <Link className='primary block w-fit' to={'/'} >Go home</Link>
            </div>
        </div>
    )
}