import Spinner from "../icons/Spinner"

export default function GenericLoadingScreen() {
    return (
        <div className='flex items-center justify-center min-h-screen px-6'>
            <div className='flex flex-col items-center'>
                <Spinner className='h-9 w-9 border-4 text-indigo-600' />
                <div className='mt-5 subtitle'>Working...</div>
            </div>
        </div>
    )
}