import {Quiz} from "../types"
import {Link} from "react-router-dom"
import AvatarIcon from "../icons/AvatarIcon"
import getTimeLabel from "../utilities/getTimeLabel"
import LikeIcon from "../icons/LikeIcon"
import DislikeIcon from "../icons/DislikeIcon"
import {useEffect, useState} from "react"
import PencilIcon from "../icons/PencilIcon"
import TrashIcon from "../icons/TrashIcon"
import handleTextareaResize from "../utilities/handleTextareaResize"
import Spinner from "../icons/Spinner";

type Props = {
    comment: Quiz['comments'][0]
    currentUser: {
        _id: string,
        isVerified: boolean,
        username: string
    }
    reactToComment: any
    updateComment: any
    deleteComment: any
    isError: boolean
}

export default function Comment({comment, currentUser, reactToComment, updateComment, deleteComment, isError}: Props) {
    const [isEditBoxOpen, setIsEditBoxOpen] = useState(false)
    const [newCommentBody, setNewCommentBody] = useState(comment.body)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isError && isLoading) setIsLoading(false)
    }, [isError])

    return (
        <div className='space-y-5 py-11'>
            {comment.user ? (
                <Link to={`/users/${comment.user._id.$oid}`} className='flex items-center space-x-2 w-fit'>
                    {comment.user.img ? (
                        <img src={comment.user.img} className='h-10 w-10 rounded-full' />
                    ):(
                        <AvatarIcon className='h-10 w-10 text-slate-400/50' />
                    )}
                    <div className='pl-1 space-y-0.5'>
                        <div className='text-sm'>{comment.user.username}</div>
                        <div className='text-slate-400 text-xs'>{getTimeLabel(comment.created_on)}</div>
                    </div>
                </Link>
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
                    disabled={(!currentUser) || (!!comment.disliked_users.find(u => u.$oid === currentUser._id)) || (!!comment.liked_users.find(u => u.$oid === currentUser._id))}
                    className='secondary text-slate-800 !py-1 !px-2 flex items-center space-x-1 dark:text-gray-300'
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
                    disabled={(!currentUser) || (!!comment.disliked_users.find(u => u.$oid === currentUser._id)) || (!!comment.liked_users.find(u => u.$oid === currentUser._id))}
                    className='secondary text-slate-800 !py-1 !px-2 flex items-center space-x-1 dark:text-gray-300'
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
                {(currentUser && comment.user._id.$oid === currentUser._id) && (
                    <>
                        <button onClick={() => setIsEditBoxOpen(!isEditBoxOpen)} className={'secondary text-slate-800 !py-1 !px-2 dark:text-gray-300 ' + (isEditBoxOpen ? 'translate-y-[4px] !shadow-[0_0_0_0]' : '')}>
                            <span className='max-[330px]:hidden text-sm'>Edit</span>
                            <PencilIcon className='min-[330px]:hidden w-4 h-4' />
                        </button>
                        <button onClick={(e) => deleteComment(e, comment._id.$oid)} className='secondary text-red-600 !py-1 !px-2 disabled:!text-red-400'>
                            <span className='max-[330px]:hidden text-sm'>Delete</span>
                            <TrashIcon className='min-[330px]:hidden w-4 h-4' />
                        </button>
                    </>
                )}
            </div>
            {isEditBoxOpen && (
                <div className='relative'>
                    <textarea className='w-full h-32 !py-2.5 !px-3.5 !pb-16' placeholder='Make any changes here' value={newCommentBody} onChange={e => {
                        handleTextareaResize(e)
                        setNewCommentBody(e.target.value)
                    }} />
                    <div className='absolute bottom-4 right-3.5'>
                        <button onClick={e => {
                            setIsLoading(true)
                            updateComment(e, comment._id.$oid, newCommentBody)
                        }} disabled={isLoading} className='ml-auto relative block primary disabled:text-transparent'>
                            <span>Save</span>
                            {isLoading && (
                                <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                                    <Spinner className='h-5 w-5 border-[3px] text-white' />
                                </div>
                            )}
                        </button>
                    </div>
                    <div className='absolute bottom-2.5 left-3.5 text-sm text-slate-400'>{newCommentBody.length}/500</div>
                </div>
            )}
        </div>
    )
}