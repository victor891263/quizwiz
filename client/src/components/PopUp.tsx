import CrossIcon from "../icons/CrossIcon"
import CheckIcon from "../icons/CheckIcon"

export default function PopUp({ isVisible, msg, color }: { isVisible: boolean, msg: string, color: 'red' | 'green' }) {
    return (
        <div className={'fixed bottom-0 left-0 w-screen z-50 p-6 pt-0 flex justify-center ' + (isVisible ? 'transition' : 'scale-90 opacity-0')}>
            <div className={'py-2.5 px-3.5 rounded-md text-white text-sm w-fit mx-auto flex space-x-3 ' + ((color === 'red' ? ' bg-red-700' : '') || (color === 'green' ? ' bg-green-700' : ''))}>
                <div className='relative'>
                    <div className='absolute top-0 left-0 h-full flex items-center'>
                        {color === 'red' && <CrossIcon className={'small-height small-width'} strokeWidth={2} />}
                        {color === 'green' && <CheckIcon className={'small-height small-width'} strokeWidth={2} />}
                    </div>
                    <div className='leading-[1.6] semismall-text text-transparent'>W</div>
                </div>
                <div className='leading-[1.6] small-text'>{msg}</div>
            </div>
        </div>
    )
}