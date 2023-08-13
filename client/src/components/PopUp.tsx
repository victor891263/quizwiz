import CrossWithCircle from "../icons/CrossWithCircle"

export default function PopUp({ msg, color }: { msg: string, color: 'red' | 'green' }) {
    return (
        <div className='fixed bottom-6 left-6 right-6 z-50 flex justify-center'>
            <div className={'p-3.5 pr-4 flex space-x-2 rounded-lg' + ((color === 'red' ? ' bg-red-50 dark:bg-red-900/50' : '') || (color === 'green' ? ' bg-green-50 dark:bg-green-900/50' : ''))}>
                <div className='pt-0.5'>
                    <CrossWithCircle className={'h-5 w-5 shrink-0' + ((color === 'red' ? ' text-red-400' : '') || (color === 'green' ? ' text-green-400' : ''))} />
                </div>
                <div className={(color === 'red' ? 'text-red-500 dark:text-red-400' : '') || (color === 'green' ? 'text-green-500 dark:text-green-400' : '')} >{msg}</div>
            </div>
        </div>
    )
}