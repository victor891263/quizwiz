import {Link, useLocation} from "react-router-dom"
import GitHubIcon from "../icons/GitHubIcon"
import ThemeButton from "./ThemeButton"
import getCurrentUser from "../utilities/getCurrentUser"
import MenuIcon from "../icons/MenuIcon"
import {useEffect, useState} from "react"
import ArrowIcon from "../icons/ArrowIcon"
import CrossIcon from "../icons/CrossIcon";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const currentUser = getCurrentUser()
    const location = useLocation()

    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    function logout() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('rememberMe')
        window.location.href = window.location.origin
    }

    //max-sm:h-[55px] 179px

    return (
        <header className='fixed top-0 left-0 w-full pt-6 z-10'>
            <div className='px-6 lg:max-w-screen-lg container mx-auto'>
                <nav className={'small-text p-5 shadow-md bg-white rounded-lg overflow-hidden transition-all dark:bg-gray-800 ' + (isMenuOpen ? 'max-sm:h-[183px]' : 'max-sm:h-[59px]')}>
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
                                        <Link to={'/join'}>Join</Link>
                                    </>
                                )}
                            </div>
                            <div className='flex items-center space-x-4 sm:space-x-5'>
                                <a href="https://github.com/victor891263/quizwiz" target="_blank" rel="noreferrer" ><GitHubIcon className={'h-5 w-5'} /></a>
                                <ThemeButton />
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='sm:hidden !ml-3.5'>
                                    {isMenuOpen ? <CrossIcon className='h-[1.375rem] w-[1.375rem]' /> : <MenuIcon className='h-[1.375rem] w-[1.375rem]' />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {isMenuOpen && (
                        <div className='sm:hidden border-t mt-5 pt-5 flex flex-col space-y-3'>
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

                                    <Link to={'/join'} className='flex items-center justify-between'>
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