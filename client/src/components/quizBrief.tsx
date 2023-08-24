import {QuizBrief} from "../types"
import getTimeLabel from "../utilities/getTimeLabel"
import {Link} from "react-router-dom"
import AvatarIcon from "../icons/AvatarIcon";

export default function QuizBriefComponent({quiz}: {quiz: QuizBrief}) {
    return (
        <Link to={`/quizzes/${quiz._id.$oid}`} className='text-left flex flex-col justify-between space-y-5 py-12'>
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    {quiz.user ? (
                        <div className='flex items-center space-x-2'>
                            {quiz.user.img ? (
                                <img src={quiz.user.img} className='h-10 w-10 rounded-full' />
                            ):(
                                <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                            )}
                            <div className='text-sm'>{quiz.user.username}</div>
                        </div>
                    ):(
                        <div className='flex items-center space-x-2'>
                            <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                            <div className='text-sm'>[anonymous]</div>
                        </div>
                    )}
                    <div className='text-slate-400 text-sm'>{getTimeLabel(quiz.created_on)}</div>
                </div>

                <div className='text-lg font-bold'>{quiz.title}</div>
                <div className='flex gap-x-4 text-sm italic'>
                    <div><span className='font-semibold'>{quiz.questions}</span> questions</div>
                    <div><span className='font-semibold'>{quiz.responses}</span> responses</div>
                </div>
                <p className='line-clamp-2'>{quiz.description}</p>
                <div className='py-1 flex flex-wrap gap-2 text-sm'>
                    {quiz.tags.map((tag, index) => (
                        <div className='bg-slate-100 rounded-md py-1.5 px-2.5 text-slate-500 uppercase' key={index}>{tag}</div>
                    ))}
                </div>
            </div>
            <div className='flex gap-x-4 text-sm italic'>
                <div><span className='font-semibold'>{quiz.liked_users}</span> likes</div>
                <div><span className='font-semibold'>{quiz.disliked_users}</span> dislikes</div>
                <div><span className='font-semibold'>{quiz.comments}</span> comments</div>
            </div>
        </Link>
    )
}