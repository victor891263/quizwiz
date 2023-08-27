import QuizForm from "../components/QuizForm"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {QuizWithQuestions} from "../types"
import axios from "axios"
import handleAxiosError from "../utilities/handleAxiosError"
import GenericError from "../components/GenericError";
import GenericLoadingScreen from "../components/GenericLoadingScreen";

export default function EditQuiz() {
    const [quizWithQuestions, setQuizWithQuestions] = useState<QuizWithQuestions>()
    const [retrievalError, setRetrievalError] = useState('')

    const {id: quizId} = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tests/${quizId}/questions`)
            .then(response => {
                setQuizWithQuestions(response.data[0])
            })
            .catch(error => {
                handleAxiosError(error, (msg: string) => setRetrievalError(msg))
            })
    }, [])

    return (
        <>
            {quizWithQuestions && (
                <div className='m-auto container max-w-screen-sm px-6 py-20'>
                    <h1 className='mb-10 text-2xl tracking-tight'>Add quiz</h1>
                    <QuizForm quizInput={quizWithQuestions} />
                </div>
            )}
            {retrievalError && <GenericError msg={retrievalError} />}
            {!(quizWithQuestions || retrievalError) && <GenericLoadingScreen />}
        </>
    )
}