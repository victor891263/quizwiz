import {useState, useEffect} from "react"
import {quizzes as dummyQuizzes} from "../dummy/quizzes"
import {QuizBrief} from "../types"
import QuizBriefComponent from "../components/quizBrief"
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
import {useNavigate} from "react-router-dom";

export default function Home() {
    type Filters = 'Date' | 'Impression' | 'Questions' | 'Responses' | 'Title'

    const [quizzes, setQuizzes] = useState<QuizBrief[]>()
    const [retrievalError, setRetrievalError] = useState('')

    const [titleKeyword, setTitleKeyword] = useState('')

    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
    const [tagKeyword, setTagKeyword] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [sortBy, setSortBy] = useState<Filters>('Date')

    const navigate = useNavigate()

    useEffect(() => {
        retrieveQuizzes()
    }, [])

    function retrieveQuizzes() {
        setQuizzes(undefined)
        setRetrievalError('')
        axios.get(`${process.env.REACT_APP_API_URL}/tests?keyword=${titleKeyword}&tags=${JSON.stringify(tags)}`)
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
            <FullScreenPopUp isVisible={isFiltersOpen} close={() => setIsFiltersOpen(false)} className='max-w-sm w-full p-10' >
                <div className='space-y-7'>
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
                    <div className='relative'>
                        <label htmlFor='email' className='text-sm block mb-2'>Tags</label>
                        <div className='flex flex-wrap gap-1'>
                            {tags.length > 0 && tags.map(tag => (
                                <button onClick={() => setTags(tags.filter(item => item !== tag))} className='flex items-center space-x-1 bg-indigo-50 text-sm p-1 pl-2 rounded uppercase text-indigo-500 hover:bg-indigo-100'>
                                    <span>{tag}</span>
                                    <CrossIcon className='h-3.5 w-3.5' />
                                </button>
                            ))}
                            <button onClick={() => setIsTagMenuOpen(!isTagMenuOpen)} className={'flex items-center space-x-1 text-sm p-1 pl-2 rounded text-indigo-500 hover:bg-indigo-100 ' + (isTagMenuOpen ? '!bg-indigo-100' : 'bg-indigo-50')}>
                                <span>ADD TAG</span>
                                <CrossIcon className='h-3 w-3 rotate-45' />
                            </button>
                        </div>
                        {isTagMenuOpen && (
                            <div className='absolute mt-2 w-full bg-white border rounded-md p-2 shadow max-h-52 overflow-y-auto'>
                                <div className='relative mb-0.5'>
                                    <div className='absolute top-0 left-2.5 flex h-full'>
                                        <GlassIcon className='h-3.5 w-3.5 my-auto' />
                                    </div>
                                    <input type='text' value={tagKeyword} onChange={e => setTagKeyword(e.target.value)} className='!pl-8 no-style py-1.5 rounded text-sm w-full' placeholder='Search' />
                                </div>
                                {filteredTags.length > 0 ? (filteredTags.map(tag => (
                                    <button className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100' onClick={() => {
                                        if (tags.includes(tag)) setTags(tags.filter(t => t !== tag))
                                        else setTags([...tags, tag])
                                    }}>
                                        <span className={tags.includes(tag) ? 'font-semibold' : ''}>{tag}</span>
                                        {tags.includes(tag) && <CheckIcon className='h-4 w-4 text-indigo-600' strokeWidth={2.5} />}
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
            </FullScreenPopUp>
            <div className='m-auto container max-w-screen-md py-20 px-6'>
                <div className='flex items-end justify-between'>
                    {quizzes ? (
                        <div className='text-sm text-slate-400'>{quizzes.length} quizzes found</div>
                    ):(
                        <div></div>
                    )}
                    <div className='flex space-x-2'>
                        <div className='relative'>
                            <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} disabled={!quizzes} className={'secondary flex items-center justify-between w-48 !pr-2 ' + (isSortMenuOpen ? 'bg-slate-100' : '')}>
                                <div>Sort by: <span className='font-bold'>{sortBy}</span></div>
                                <ArrowUpDown className='h-5 w-5' />
                            </button>
                            {isSortMenuOpen && (
                                <div className='absolute mt-2 w-full bg-white border rounded-md p-2 shadow'>
                                    {['Answers', 'Date', 'Questions', 'Responses', 'Title'].map(item => (
                                        <button onClick={() => setSortBy(item as Filters)} className='flex items-center justify-between w-full text-left py-1.5 px-2.5 text-sm capitalize rounded hover:bg-slate-100'>
                                            <span className={sortBy === item ? 'font-semibold' : ''}>{item}</span>
                                            {sortBy === item && <CheckIcon className='h-4 w-4 text-indigo-600' strokeWidth={2.5} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setIsFiltersOpen(true)} className='secondary'>Filters</button>
                        <button className='primary'>Add quiz</button>
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
                            <EmptyBox className='h-10 w-10 text-slate-300 mx-auto' />
                            <div className='mt-5 subtitle'>Nothing found</div>
                            <p className='mt-3'>No quizzes found with the chosen criteria. Try modifying your filters to get different results.</p>
                        </div>
                    )
                )}
                {retrievalError && (
                    <div className='mt-20 text-center max-w-md mx-auto'>
                        <CrossWithCircle className='h-10 w-10 text-slate-400/60 mx-auto' />
                        <div className='mt-5 subtitle'>Something failed</div>
                        <p className='mt-3'>{retrievalError}</p>
                        <button onClick={() => navigate(0)} className='mt-7 primary' >Retry</button>
                    </div>
                )}
                {!(quizzes || retrievalError) && (
                    <div className='mt-20 text-center max-w-md mx-auto flex flex-col items-center'>
                        <Spinner className='h-9 w-9 border-4 text-indigo-600' />
                        <div className='mt-5 subtitle'>Working...</div>
                    </div>
                )}
            </div>
        </>
    )
}