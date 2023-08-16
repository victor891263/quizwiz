import CrossIcon from "../icons/CrossIcon"

export default function FullScreenPopUp({children, isVisible, close, className}: {children: JSX.Element, isVisible: boolean, close: () => void, className?: string}) {
    return (
        <>
            <div className={'fixed top-0 left-0 w-screen h-screen z-10 transition-colors ' + (isVisible ? 'bg-gray-900/25' : 'pointer-events-none')}></div>
            <div className={'fixed top-0 right-0 h-screen z-20 bg-white overflow-y-auto transition-transform ' + (isVisible ? '' : 'translate-x-full ') + (className || '')}>
                <div className='relative'>
                    <button onClick={close} className='absolute top-0 right-0 h-8 w-8 flex items-center justify-center secondary !p-0'><CrossIcon className={'shrink-0 w-5 h-5'} /></button>
                    {children}
                </div>
            </div>
        </>
    )
}