import CrossWithCircle from "../icons/CrossWithCircle"
import {useNavigate} from "react-router-dom"

export default function GenericError({msg}: {msg: string}) {
    const navigate = useNavigate()

    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div className='text-center max-w-md'>
                <CrossWithCircle className='h-10 w-10 text-slate-400/60 mx-auto dark:text-gray-600' />
                <div className='mt-5 subtitle'>Something failed</div>
                <p className='mt-3'>{msg}</p>
                <button onClick={() => navigate(0)} className='mt-7 primary' >Retry</button>
            </div>
        </div>
    )
}