import Spinner from "./Spinner"

export default function GenericLoadingScreen() {
    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div>
                <Spinner className='h-10 w-10 text-cyan-600 mx-auto' />
                <div className='mt-5 text-xl font-semibold'>Working...</div>
            </div>
        </div>
    )
}