//@ts-nocheck

import {useState, useEffect, useRef} from "react"
import {QuizBrief} from "../types"
import QuizBriefComponent from "../components/QuizBrief"
import GlassIcon from "../icons/GlassIcon"
import FullScreenPopUp from "../components/FullScreenPopUp"
import EmptyBox from "../icons/EmptyBox"
import ArrowUpDown from "../icons/ArrowUpDown"
import CrossIcon from "../icons/CrossIcon"
import CheckIcon from "../icons/CheckIcon"
import CrossWithCircle from "../icons/CrossWithCircle"
import Spinner from "../icons/Spinner"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import {Link, useNavigate} from "react-router-dom"
import FiltersIcon from "../icons/FiltersIcon";
import PencilIcon from "../icons/PencilIcon";
import Header from "../components/Header";
import getCurrentUser from "../utilities/getCurrentUser";

export default function Home() {
    type Filters = 'Date' | 'Impression' | 'Questions' | 'Responses' | 'Title'

    const [quizzes, setQuizzes] = useState<QuizBrief[]>()
    const [retrievalError, setRetrievalError] = useState('')

    const [titleKeyword, setTitleKeyword] = useState('')

    const tagMenu = useRef(null)
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
    const [tagKeyword, setTagKeyword] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const sortMenu = useRef(null)
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [sortBy, setSortBy] = useState<Filters>('Date')

    const navigate = useNavigate()
    const currentUser = getCurrentUser()

    useEffect(() => {
        retrieveQuizzes()
    }, [])

    // close tag menu when click outside
    useEffect(() => {
        const handleClick = event => {
            if (tagMenu.current && !tagMenu.current.contains(event.target)) setIsTagMenuOpen(false)
        }
        if (isTagMenuOpen) document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [isTagMenuOpen])

    // close sort menu when click outside
    useEffect(() => {
        const handleClick = event => {
            if (sortMenu.current && !sortMenu.current.contains(event.target)) setIsSortMenuOpen(false)
        }
        if (isSortMenuOpen) document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [isSortMenuOpen])

    function retrieveQuizzes() {
        setQuizzes(undefined)
        setRetrievalError('')
        axios.get(`${process.env.REACT_APP_API_URL}/tests${(titleKeyword || (tags.length > 0)) ? '?' : ''}${titleKeyword ? `keyword=${titleKeyword}` : ''}${(titleKeyword && (tags.length > 0)) ? '&' : ''}${tags.length > 0 ? `tags=${JSON.stringify(tags)}` : ''}`)
            .then(response => {
                setQuizzes(response.data)
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }

    function resetFilters() {
        setTitleKeyword('')
        setTagKeyword('')
        setTags([])
    }

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

    // extract tags from the list of quizzes
    let allTags: string[] = []
    if (quizzes) {
        quizzes.forEach(q => {
            q.tags.forEach(t => {
                if (!allTags.includes(t)) allTags.push(t)
            })
        })
    }

    // filter tags
    const filteredTags = allTags.filter(t => t.toLowerCase().includes(tagKeyword.toLowerCase()))

    // sort quizzes
    const sortedQuizzes = quizzes ? sortQuizzes([...quizzes], sortBy) : []

    return (
        <>
            <Header />
            <div className='m-auto container lg:max-w-screen-lg pt-40 pb-20 px-6 grid lg:grid-cols-[20rem_auto]'>
                <div className='space-y-7 max-lg:border-b max-lg:pb-[3.25rem] max-lg:mb-[3.25rem] lg:border-r lg:pr-10 lg:mr-10'>
                    <h2 className='text-lg font-bold'>Filters</h2>
                    <div>
                        <label htmlFor='email' className='text-sm block mb-2'>Title</label>
                        <div className='relative w-full'>
                            <div className='absolute top-0 left-2.5 flex h-full'>
                                <GlassIcon className='h-4 w-4 my-auto' />
                            </div>
                            <input onChange={e => setTitleKeyword(e.target.value)} value={titleKeyword} type='text' className='!pl-9 w-full' placeholder='Search' />
                        </div>
                    </div>
                    <div ref={tagMenu} className='relative'>
                        <label htmlFor='email' className='text-sm block mb-2'>Tags</label>
                        <div className='flex flex-wrap gap-1.5'>
                            {tags.length > 0 && tags.map(tag => (
                                <button onClick={() => setTags(tags.filter(item => item !== tag))} className='flex items-center space-x-1 border border-sky-600 text-sm p-1.5 pl-2.5 rounded-md uppercase text-sky-600 hover:bg-sky-50'>
                                    <span>{tag}</span>
                                    <CrossIcon className='h-3.5 w-3.5' />
                                </button>
                            ))}
                            <button onClick={() => setIsTagMenuOpen(!isTagMenuOpen)} className={'flex items-center space-x-1 text-sm p-1.5 pl-2.5 rounded-md text-sky-600 border border-sky-600 hover:bg-sky-50 ' + (isTagMenuOpen ? 'bg-sky-50' : '')}>
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
                                {filteredTags.length > 0 ? (filteredTags.map(tag => (
                                    <button className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100 dark:hover:bg-gray-700/60' onClick={() => {
                                        if (tags.includes(tag)) setTags(tags.filter(t => t !== tag))
                                        else setTags([...tags, tag])
                                    }}>
                                        <span className={tags.includes(tag) ? 'font-semibold' : ''}>{tag}</span>
                                        {tags.includes(tag) && <CheckIcon className='h-4 w-4 text-sky-600' strokeWidth={2.5} />}
                                    </button>
                                ))):(
                                    <div className='text-sm text-slate-400 py-1.5 px-2.5'>No tags found</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='space-x-2'>
                        <button onClick={retrieveQuizzes} className='primary'>Apply</button>
                        <button onClick={resetFilters} className='secondary'>Reset</button>
                    </div>
                </div>
                <div>
                    <div className='flex sm:items-end justify-between max-sm:flex-col-reverse'>
                        {quizzes ? (
                            <div className='max-sm:pt-4 text-sm text-slate-400'>{quizzes.length} quizzes found</div>
                        ):(
                            <div></div>
                        )}
                        <div className='flex space-x-2'>
                            <div ref={sortMenu} className='relative max-[480px]:w-full'>
                                <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} disabled={!quizzes} className={'secondary flex items-center justify-between max-[480px]:w-full min-[480px]:w-48 !pr-2 ' + (isSortMenuOpen ? 'bg-slate-100' : '')}>
                                    <div>Sort by: <span className='font-bold'>{sortBy}</span></div>
                                    <ArrowUpDown className='h-5 w-5' />
                                </button>
                                {isSortMenuOpen && (
                                    <div className='absolute mt-2 w-full bg-white rounded-md p-2 shadow-md dark:bg-gray-800'>
                                        {['Answers', 'Date', 'Questions', 'Responses', 'Title'].map(item => (
                                            <button onClick={() => setSortBy(item as Filters)} className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100 dark:hover:bg-gray-700/60'>
                                                <span className={sortBy === item ? 'font-semibold' : ''}>{item}</span>
                                                {sortBy === item && <CheckIcon className='h-4 w-4 text-sky-600' strokeWidth={2.5} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {currentUser && <Link to={'/quizzes/new'} className='h-fit primary shrink-0 max-sm:!px-2.5'>Add quiz</Link>}
                        </div>
                    </div>
                    {quizzes && (
                        quizzes.length > 0 ? (
                            <div className='divide-y'>
                                {sortedQuizzes.map((quiz, index) => (
                                    <QuizBriefComponent quiz={quiz} key={index} />
                                ))}
                            </div>
                        ):(
                            <div className='mt-20 text-center max-w-md mx-auto'>
                                <EmptyBox className='h-10 w-10 text-slate-400/60 mx-auto dark:text-gray-600' />
                                <div className='mt-5 subtitle'>Nothing found</div>
                                <p className='mt-3'>No quizzes found with the chosen criteria. Try modifying your filters to get different results.</p>
                            </div>
                        )
                    )}
                    {retrievalError && (
                        <div className='mt-20 text-center max-w-md mx-auto'>
                            <CrossWithCircle className='h-10 w-10 text-slate-400/60 mx-auto dark:text-gray-600' />
                            <div className='mt-5 subtitle'>Something failed</div>
                            <p className='mt-3'>{retrievalError}</p>
                            <button onClick={() => navigate(0)} className='mt-7 primary' >Retry</button>
                        </div>
                    )}
                    {!(quizzes || retrievalError) && (
                        <div className='mt-20 text-center max-w-md mx-auto flex flex-col items-center'>
                            <Spinner className='h-9 w-9 border-4 text-sky-600' />
                            <div className='mt-5 subtitle'>Working...</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


/*

<button onClick={() => setIsFiltersOpen(true)} className='h-fit secondary shrink-0 max-sm:!px-2.5'>
    <span className='max-[400px]:hidden'>Filters</span>
    <FiltersIcon className='min-[400px]:hidden h-5 w-5' />
</button>

<PencilIcon className='min-[400px]:hidden h-5 w-5' />

<FullScreenPopUp isVisible={isFiltersOpen} close={() => setIsFiltersOpen(false)} className='max-w-sm w-full p-10' ></FullScreenPopUp>

*/
