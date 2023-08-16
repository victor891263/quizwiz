import CrossWithCircle from "../icons/CrossWithCircle"

export default function GenericError({msg}: {msg: string}) {
    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div className='text-center max-w-md'>
                <CrossWithCircle className='h-10 w-10 text-slate-400 mx-auto' />
                <div className='mt-5 text-xl font-semibold'>Something failed</div>
                <p className='mt-3'>{msg}</p>
            </div>
        </div>
    )
}