import QuizForm from "../components/QuizForm"

export default function AddQuiz() {
    return (
        <div className='m-auto container max-w-screen-sm px-6 py-20'>
            <h1 className='mb-10 text-2xl tracking-tight'>Add quiz</h1>
            <QuizForm />
        </div>
    )
}