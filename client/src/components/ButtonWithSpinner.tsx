import Spinner from "./Spinner"

export default function ButtonWithSpinner({type, label, className}: {type: 'primary' | 'secondary' | 'danger', label?: string, className?: string}) {
    return (
        <button disabled={true} className={'relative py-2 px-3 ' + (type === 'primary' ? 'bg-slate-900 ' : '') + (type === 'secondary' ? 'bg-slate-100 ' : '') + (type === 'danger' ? 'bg-red-600 ' : '') + className}>
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                <Spinner className={'h-5 w-5 ' + (type === 'primary' ? 'text-white' : '') + (type === 'secondary' ? 'text-slate-900' : '') + (type === 'danger' ? 'text-white' : '')} />
            </div>
            <div className='opacity-0'>{label || 'A'}</div>
        </button>
    )
}