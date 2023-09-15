import {useState} from "react"
import ChevronIcon from "../icons/ChevronIcon"

export default function FAQBox({ title, body }: { title: string, body: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='border rounded-lg p-6 flex space-x-5 h-fit'>
            <button onClick={() => setIsOpen(!isOpen)} className='h-7 w-7 rounded-md bg-sky-100 flex items-center justify-center shrink-0 dark:bg-sky-900/60'>
                <ChevronIcon className='h-5 w-5 text-sky-600' />
            </button>
            <div>
                <div className='text-lg font-bold'>{title}</div>
                {isOpen && <p className='mt-4'>{body}</p>}
            </div>
        </div>
    )
}