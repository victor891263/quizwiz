import MailIcon from "../icons/MailIcon"
import {useNavigate} from "react-router-dom"

export default function Unverified() {
    const navigate = useNavigate()

    function logout() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('rememberMe')
        window.location.href = window.location.origin
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div className='text-center max-w-md'>
                <MailIcon className='h-10 w-10 text-slate-400/60 mx-auto' />
                <div className='mt-5 subtitle'>Verify your email</div>
                <p className='mt-3'>Follow the instructions sent to your email address to verify your email. You can't use Quizwiz without verifying.</p>
                <button onClick={logout} className='mt-7 secondary' >Logout</button>
            </div>
        </div>
    )
}