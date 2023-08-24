export default function PopUp({ isVisible, msg, color }: { isVisible: boolean, msg: string, color: 'red' | 'green' }) {
    return (
        <div className={'fixed bottom-0 left-0 w-screen z-50 p-6 pt-0 flex justify-center ' + (isVisible ? 'transition' : 'scale-90 opacity-0')}>
            <div className={'py-2.5 px-3.5 rounded-md text-white text-sm w-fit mx-auto' + ((color === 'red' ? ' bg-red-700' : '') || (color === 'green' ? ' bg-green-700' : ''))}>{msg}</div>
        </div>
    )
}