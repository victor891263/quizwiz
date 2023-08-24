import {QuizWithResponses} from "../types"
import getTimeLabel from "../utilities/getTimeLabel"
import CheckIcon from "../icons/CheckIcon"
import CrossIcon from "../icons/CrossIcon"
import {useState} from "react";

export default function Response({response, questions}: {response?: QuizWithResponses['responses'][0], questions: QuizWithResponses['questions']}) {
    return (
        <>
            {response && (
                <div className='divide-y'>
                    {questions.map((question, questionIndex) => {
                        const chosenAnswerId = response.answers.find(a => a.question_id === question._id.$oid)!.choice_id
                        return (
                            <div className='py-11'>
                                <div className='mb-1.5 text-slate-400 text-sm font-semibold'>{questionIndex + 1}/{questions.length}</div>
                                <p className='italic'>{question.title}</p>
                                <div className='mt-6 space-y-2.5'>
                                    {question.options.map((option, index) => (
                                        <div className={'border py-2.5 px-3 rounded-md flex space-x-2 ' + (chosenAnswerId === option._id.$oid ? 'border-indigo-600' : '')}>

                                            {option.is_correct ? (
                                                <div className='pt-1.5'>
                                                    <CheckIcon className='h-4 w-4 text-green-600 shrink-0' />
                                                </div>
                                            ):(
                                                <div className='pt-1.5'>
                                                    <CrossIcon className='h-4 w-4 text-red-600 shrink-0' />
                                                </div>
                                            )}
                                            <p>{option.body}</p>
                                            <p className='text-slate-400 !ml-auto mt-auto'>{Math.floor(Math.random()*99)}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}