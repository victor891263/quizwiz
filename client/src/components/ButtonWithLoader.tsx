import {useEffect, useState, Children, cloneElement} from "react"
import Spinner from "./Spinner"

type Props = {
    children: JSX.Element
    onClick: () => void
    isOver: boolean
    type: 'light' | 'dark'
}

export default function ButtonWithLoader({children, onClick, isOver, type}: Props) {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [isOver])

    function handleClick() {
        onClick()
        setIsLoading(true)
    }

    return (
        <div className='relative w-fit'>
            {isLoading && (
                <div className='absolute top-0 left-0 z-30 w-full h-full flex items-center justify-center'>
                    <Spinner className={'h-5 w-5 ' + (type === 'light' ? 'text-white' : '') + (type === 'dark' ? 'text-slate-900' : '')} />
                </div>
            )}
            {Children.map(children, child => (
                cloneElement(child, {onClick: handleClick, disabled: isLoading})
            ))}
        </div>
    )
}