import CrossWithCircle from "./icons/CrossWithCircle"
import {Link} from "react-router-dom"

export default function ErrorPage() {
    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div className='text-center max-w-md'>
                <CrossWithCircle className='h-10 w-10 text-slate-400/60 mx-auto' />
                <div className='mt-5 subtitle'>Page not found</div>
                <p className='mt-3'>It looks like the page you're trying to access doesn't exist.</p>
                <Link to={'/'} className='mt-7 block w-fit mx-auto primary' >Go home</Link>
            </div>
        </div>
    )
}