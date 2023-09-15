//@ts-nocheck

import {Question, QuizInput, QuizWithQuestions} from "../types"
import {useEffect, useRef, useState} from "react"
import Joi from "joi"
import axios from "axios"
import {BSON} from "bson"
import handleAxiosError from "../utilities/handleAxiosError"
import getToken from "../utilities/getToken"
import {useNavigate} from "react-router-dom"
import handleTextareaResize from "../utilities/handleTextareaResize"
import CrossIcon from "../icons/CrossIcon"
import GlassIcon from "../icons/GlassIcon"
import CheckIcon from "../icons/CheckIcon"
import addOrdinalIndicator from "../utilities/addOrdinalIndicator"
import PopUp from "./PopUp"
import Spinner from "../icons/Spinner"

export default function QuizForm({quizInput}: {quizInput?: QuizWithQuestions}) {
    const validationSchema = Joi.object({
        title: Joi.string().min(1).max(60).required(),
        description: Joi.string().min(1).max(500).required(),
        time_limit: Joi.number().min(1).max(60)
    })

    const [allTags, setAllTags] = useState<string[]>()
    const [tagRetrievalError, setTagRetrievalError] = useState('')

    const [quiz, setQuiz] = useState<QuizInput>({
        questions: quizInput ? quizInput.questions : [],
        tags: quizInput ? quizInput.tags : [],
        title: quizInput ? quizInput.title : '',
        description: quizInput ? quizInput.description : '',
        time_limit: (quizInput && quizInput.time_limit) ? quizInput.time_limit : undefined
    })
    const [formErrors, setFormErrors] = useState({
        time_limit: '',
        title: '',
        description: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [operationError, setOperationError] = useState('')

    const tagMenu = useRef(null)
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
    const [tagKeyword, setTagKeyword] = useState('')

    const [questionBody, setQuestionBody] = useState('')
    const [choiceObject, setChoiceObject] = useState<{ body: string, is_correct: boolean }>({ body: '', is_correct: false })
    const [choices, setChoices] = useState<{ body: string, is_correct: boolean }[]>([])
    const [questions, setQuestions] = useState<{ title: string, options: { body: string, is_correct: boolean }[] }[]>(quizInput ? quizInput.questions : [])

    const [questionBodyError, setQuestionBodyError] = useState('')
    const [choiceBodyError, setChoiceBodyError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/tags`)
            .then(response => {
                setAllTags(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => {
                    setTagRetrievalError(msg)
                })
            })
    }, [])

    // close tag menu when click outside
    useEffect(() => {
        const handleClick = event => {
            if (tagMenu.current && !tagMenu.current.contains(event.target)) setIsTagMenuOpen(false)
        }
        if (isTagMenuOpen) document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [isTagMenuOpen])

    async function submitQuiz() {
        // clear errors
        const newErrors = {
            title: '',
            description: '',
            time_limit: ''
        }

        // validate inputs
        const { error } = validationSchema.validate({
            title: quiz.title,
            description: quiz.description,
            time_limit: quiz.time_limit
        }, { abortEarly: false })

        // check if there are any questions
        if (questions.length < 1) {
            setOperationError('You need to add at least one question')
            setTimeout(() => setOperationError(''), 3000)
            return
        }

        // proceed if no errors
        if (error) {
            error.details.forEach((detail) => {
                // @ts-ignore
                newErrors[detail.context.key] = detail.message.replace(/"/g, '')
            })
        } else {
            // submit the quiz
            setIsLoading(true)
            try {
                if (quizInput) {
                    // update an existing quiz
                    await axios.put(`${process.env.REACT_APP_API_URL}/tests/${quizInput._id.$oid}`, { ...quiz, questions, updated_on: new Date().getTime() }, {headers: {Authorization: `Bearer ${getToken()}`}})
                    navigate(`/quizzes/${quizInput._id.$oid}`)
                } else {
                    // add a new quiz
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/tests`, { ...quiz, questions, created_on: new Date().getTime(), updated_on: new Date().getTime() }, {headers: {Authorization: `Bearer ${getToken()}`}})
                    navigate(`/quizzes/${response.data._id.$oid}`)
                }
            } catch (error) {
                handleAxiosError(error, (msg: string) => {
                    setOperationError(msg)
                    setTimeout(() => setOperationError(''), 3000)
                })
                setIsLoading(false)
            }
        }
        setFormErrors(newErrors)
    }

    function addQuestion() {
        setQuestionBodyError('')
        if (!questionBody) {
            setQuestionBodyError('Question body cannot be empty')
            return
        }
        if (!(choices.find(c => c.is_correct) && choices.find(c => !c.is_correct))) {
            setQuestionBodyError('Question must have at least one correct choice and one incorrect choice')
            return
        }
        setQuestions([...questions, { title: questionBody, options: choices }])
        setQuestionBody('')
        setChoices([])
        setChoiceObject({ body: '', is_correct: false })
    }

    function removeQuestion(content: string) {
        setQuestions([...questions.filter(q => q.title.toLowerCase() !== content.toLowerCase())])
    }

    function addChoice() {
        setChoiceBodyError('')
        if (!choiceObject.body) {
            setChoiceBodyError('Choice body cannot be empty')
            return
        }
        if (!!choices.find(c => c.body.toLowerCase() === choiceObject.body.toLowerCase())) {
            setChoiceBodyError('This choice has already been added')
            return
        }
        if (choiceObject.is_correct && (!!choices.find(c => c.is_correct))) {
            setChoiceBodyError('You cannot add more than one correct choice')
            return
        }
        setChoices([...choices, choiceObject])
        setChoiceObject({ body: '', is_correct: false })
    }

    function removeChoice(content: string) {
        setChoices([...choices.filter(c => c.body.toLowerCase() !== content.toLowerCase())])
    }

    function setTags(array: string[]) {
        setQuiz({...quiz, tags: array})
    }

    const filteredTags = allTags && allTags.filter(t => t.toLowerCase().includes(tagKeyword.toLowerCase()))

    return (
        <>
            <PopUp isVisible={!!operationError} msg={operationError} color='red' />
            <div className='space-y-6'>
                <div>
                    <label htmlFor='title' className='text-sm'>Title <span className='text-red-600'>*</span></label>
                    <input type='text' name='title' id='title' className='mt-2 w-full' value={quiz.title} onChange={e => setQuiz({...quiz, title: e.target.value})} />
                    {formErrors.title && (
                        <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{formErrors.title}</div>
                    )}
                </div>
                <div>
                    <label htmlFor='description' className='text-sm'>Description <span className='text-red-600'>*</span></label>
                    <textarea
                        name='description'
                        id='description'
                        className='mt-2 w-full h-24'
                        value={quiz.description}
                        onChange={e => {
                            handleTextareaResize(e)
                            setQuiz({...quiz, description: e.target.value})
                        }}
                        ref={e => {
                            if (e) handleTextareaResize({ target: e })
                        }}
                    />
                    {formErrors.description && (
                        <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{formErrors.description}</div>
                    )}
                </div>
                <div>
                    <label htmlFor='time_limit' className='text-sm block'>Time limit</label>
                    <input type='number' name='time_limit' id='time_limit' className='mt-2 w-32' value={quiz.time_limit} onChange={e => setQuiz({...quiz, time_limit: Number(e.target.value)})} />
                    {formErrors.time_limit && (
                        <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{formErrors.time_limit}</div>
                    )}
                </div>


                <div ref={tagMenu} className='relative'>
                    <label htmlFor='email' className='text-sm block mb-2'>Tags</label>
                    <div className='flex flex-wrap gap-1.5'>
                        {quiz.tags.map(tag => (
                            <button onClick={() => setTags(quiz.tags.filter(item => item !== tag))} className='flex items-center space-x-1 border border-sky-600 text-sm p-1.5 pl-2.5 rounded-md uppercase text-sky-600 hover:bg-sky-50'>
                                <span>{tag}</span>
                                <CrossIcon className='h-3.5 w-3.5' />
                            </button>
                        ))}
                        <button onClick={() => setIsTagMenuOpen(!isTagMenuOpen)} className={'flex items-center space-x-1 border border-sky-600 text-sm p-1.5 pl-2.5 rounded-md text-sky-600 hover:bg-sky-50 ' + (isTagMenuOpen ? 'bg-sky-50' : '')}>
                            <span>ADD TAG</span>
                            <CrossIcon className='h-3 w-3 rotate-45' />
                        </button>
                    </div>
                    {isTagMenuOpen && (
                        <div className='absolute mt-2 max-w-32 bg-white rounded-md p-2 pt-1 shadow-md max-h-52 overflow-y-auto dark:bg-gray-800'>
                            <div className='relative'>
                                <div className='absolute top-0 left-2.5 flex h-full'>
                                    <GlassIcon className='h-3.5 w-3.5 my-auto text-slate-400' />
                                </div>
                                <input type='text' value={tagKeyword} onChange={e => setTagKeyword(e.target.value)} className='!pl-8 !ring-0 text-sm w-full' placeholder='Search' />
                            </div>
                            {tagKeyword && (
                                <button className='w-full text-left py-1.5 px-2.5 text-sm text-sky-600 hover:bg-slate-100' onClick={() => {
                                    if (!quiz.tags.includes(tagKeyword)) {
                                        setTags([...quiz.tags, tagKeyword])
                                        setTagKeyword('')
                                    }
                                }} >Add "{tagKeyword}"</button>
                            )}
                            {allTags ? (
                                (allTags.length > 0 ? (
                                    filteredTags!.length > 0 ? (filteredTags!.map(tag => (
                                        <button className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100 dark:hover:bg-gray-700/60' onClick={() => {
                                            if (quiz.tags.includes(tag)) setTags(quiz.tags.filter(t => t !== tag))
                                            else setTags([...quiz.tags, tag])
                                        }}>
                                            <span className={quiz.tags.includes(tag) ? 'font-semibold' : ''}>{tag}</span>
                                            {quiz.tags.includes(tag) && <CheckIcon className='h-4 w-4 text-sky-600' strokeWidth={2.5} />}
                                        </button>
                                    ))):(
                                        <div className='text-sm text-slate-400 py-1.5 px-2.5'>No tags found</div>
                                    )
                                ):(
                                    <div className='text-sm text-slate-400 py-1.5 px-2.5'>No tags found</div>
                                ))
                            ):(
                                tagRetrievalError ? (
                                    <div className='text-sm text-slate-400 py-1.5 px-2.5'>{tagRetrievalError}</div>
                                ):(
                                    <div className='w-full flex items-center justify-center py-2'>
                                        <Spinner className='h-5 w-5 border-[2px] text-slate-300' />
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className='!mt-10'>
                    <div className='mt-2 border-l pl-8 max-sm:pl-6'>
                        <h3 className='font-bold text-lg mb-6'>{addOrdinalIndicator(questions.length + 1)} question</h3>
                        <div>
                            <label htmlFor='questionBody' className='text-sm block'>Content <span className='text-red-600'>*</span></label>
                            <textarea name='questionBody' id='questionBody' className='mt-2 w-full h-18' value={questionBody} onChange={e => {
                                handleTextareaResize(e)
                                setQuestionBody(e.target.value)
                            }} />
                        </div>
                        <div className='mt-8 border-l pl-8 max-sm:pl-6'>
                            <h3 className='font-bold text-lg mb-6'>{addOrdinalIndicator(choices.length + 1)} choice</h3>
                            <div>
                                <label htmlFor='answerBody' className='text-sm block'>Content <span className='text-red-600'>*</span></label>
                                <textarea
                                    name='answerBody'
                                    id='answerBody'
                                    className='mt-2 w-full h-18'
                                    value={choiceObject.body}
                                    onChange={e => {
                                        handleTextareaResize(e)
                                        setChoiceObject({...choiceObject, body: e.target.value})
                                    }}
                                />
                            </div>
                            <div onClick={() => setChoiceObject({...choiceObject, is_correct: !choiceObject.is_correct})} className='mt-6 flex items-center space-x-2 cursor-pointer'>
                                <div className={'h-4 w-4 ring-1 ring-slate-300 rounded-sm flex items-center justify-center' + (choiceObject.is_correct ? ' bg-sky-600 !ring-sky-600 text-white' : '')}>
                                    <CheckIcon className={'w-3 h-3 text-white dark:text-gray-900 ' + (choiceObject.is_correct ? 'dark:!text-white' : '')} />
                                </div>
                                <div>Correct answer</div>
                            </div>
                            <button onClick={addChoice} className='mt-8 secondary'>Add choice</button>
                            {choiceBodyError && (
                                <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{choiceBodyError}</div>
                            )}
                        </div>
                        <div>
                            <label className='mt-8 text-sm block'>Current choices</label>
                            {choices.length > 0 ? (
                                <div className='mt-2.5 space-y-1.5'>
                                    {choices.map(c => (
                                        <div className='flex space-x-2'>
                                            {c.is_correct ? (
                                                <div className='pt-1.5'><CheckIcon className='h-4 w-4 text-green-600 shrink-0' strokeWidth={2} /></div>
                                            ):(
                                                <div className='pt-1.5'><CrossIcon className='h-4 w-4 text-red-600 shrink-0' /></div>
                                            )}
                                            <div className='pr-1'>{c.body}</div>
                                            <button onClick={() => removeChoice(c.body)} className='secondary h-fit !py-0 !px-2.5 !rounded'>-</button>
                                        </div>
                                    ))}
                                </div>
                            ):(
                                <div className='mt-2 text-slate-400'>No choices yet</div>
                            )}
                        </div>
                        <button onClick={addQuestion} className='mt-8 secondary'>Add question</button>
                        {questionBodyError && (
                            <div className="mt-2 text-red-600 text-sm first-letter:capitalize">{questionBodyError}</div>
                        )}
                    </div>
                </div>

                <div className='!mt-10'>
                    <label className='text-sm block'>Current questions</label>
                    {questions.length > 0 ? (
                        <div className='mt-6 space-y-6'>
                            {questions.map(q => (
                                <div className='flex space-x-3'>
                                    <button onClick={() => removeQuestion(q.title)} className='secondary h-fit !py-0 !px-2.5 !rounded'>-</button>
                                    <div>
                                        <div className='italic'>{q.title}</div>
                                        <div className='mt-2.5 space-y-1.5'>
                                            {q.options.map(o => (
                                                <div className='flex space-x-2'>
                                                    {o.is_correct ? (
                                                        <div className='pt-1.5'><CheckIcon className='h-4 w-4 text-green-600 shrink-0' strokeWidth={2} /></div>
                                                    ):(
                                                        <div className='pt-1.5'><CrossIcon className='h-4 w-4 text-red-600 shrink-0' /></div>
                                                    )}
                                                    <div>{o.body}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className='mt-2 text-slate-400'>No questions yet</div>
                    )}
                </div>

                <div className='!mt-10 pt-12 border-t'>
                    <button onClick={submitQuiz} disabled={isLoading} className='relative primary disabled:text-transparent'>
                        <span>Submit</span>
                        {isLoading && (
                            <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                <Spinner className='h-5 w-5 border-[3px] text-white' />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}