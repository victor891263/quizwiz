import CrossIcon from "../icons/CrossIcon"
import CrossWithCircle from "../icons/CrossWithCircle"

export default function PopUp({ isVisible, msg, color }: { isVisible: boolean, msg: string, color: 'red' | 'green' }) {
    return (
        <div className={'fixed bottom-0 left-0 w-screen z-50 flex justify-center transition-transform ' + (isVisible ? '' : 'translate-y-full')}>
            <div className={'p-3.5 text-white text-sm flex space-x-1.5 w-full' + ((color === 'red' ? ' bg-red-700' : '') || (color === 'green' ? ' bg-green-700' : ''))}>
                <div>
                    <CrossWithCircle className='h-5 w-5 shrink-0' />
                </div>
                <div>{msg}</div>
            </div>
        </div>
    )
}