import {Link} from "react-router-dom"
import GitHubIcon from "../icons/GitHubIcon"
import ThemeButton from "./ThemeButton"
import getCurrentUser from "../utilities/getCurrentUser"
import MenuIcon from "../icons/MenuIcon"
import {useState} from "react"
import ArrowIcon from "../icons/ArrowIcon";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const currentUser = getCurrentUser()

    function logout() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('rememberMe')
        window.location.href = window.location.origin
    }

    //max-sm:h-[55px] 179px

    return (
        <header className='fixed top-0 left-0 w-full pt-6 z-10'>
            <div className='px-6 max-w-screen-md container mx-auto'>
                <nav className={'sm:p-5 p-4 shadow-md bg-white rounded-lg text-[15px] overflow-hidden transition-all dark:bg-gray-800 ' + (isMenuOpen ? 'max-sm:h-[179px]' : 'max-sm:h-[55px]')}>
                    <div className='flex items-center justify-between'>
                        <Link to={'/'} >🎲 Quizwiz</Link>
                        <div className='flex items-center space-x-5'>
                            <div className='flex items-center space-x-5 max-sm:hidden'>
                                <Link to={'/about'}>About</Link>
                                {currentUser ? (
                                    <>
                                        <Link to={`/users/${currentUser._id}`}>Profile</Link>
                                        <button onClick={logout}>Logout</button>
                                    </>
                                ):(
                                    <>
                                        <Link to={'/login'}>Login</Link>
                                        <Link to={'/register'}>Join</Link>
                                    </>
                                )}
                            </div>
                            <div className='flex items-center space-x-4 sm:space-x-5'>
                                <a href="https://github.com/victor891263/quizwiz" target="_blank" rel="noreferrer" ><GitHubIcon className={'h-5 w-5'} /></a>
                                <ThemeButton />
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='sm:hidden'><MenuIcon className='h-5 w-5' /></button>
                            </div>
                        </div>
                    </div>
                    {isMenuOpen && (
                        <div className='border-t mt-4 pt-4 flex flex-col space-y-3'>
                            <Link to={'/about'} className='flex items-center justify-between'>
                                <span>About</span>
                                <ArrowIcon className='h-5 w-5' />
                            </Link>

                            {currentUser ? (
                                <>
                                    <Link to={`/users/${currentUser._id}`} className='flex items-center justify-between'>
                                        <span>Profile</span>
                                        <ArrowIcon className='h-5 w-5' />
                                    </Link>

                                    <button onClick={logout} className='flex items-center justify-between text-left'>
                                        <span>Logout</span>
                                        <ArrowIcon className='h-5 w-5' />
                                    </button>

                                </>
                            ):(
                                <>
                                    <Link to={'/login'} className='flex items-center justify-between'>
                                        <span>Login</span>
                                        <ArrowIcon className='h-5 w-5' />
                                    </Link>

                                    <Link to={'/register'} className='flex items-center justify-between'>
                                        <span>Join</span>
                                        <ArrowIcon className='h-5 w-5' />
                                    </Link>

                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}