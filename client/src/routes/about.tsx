import Header from "../components/Header"
import CheckIcon from "../icons/CheckIcon";
import Footer from "../components/Footer";
import {Link} from "react-router-dom";
import FAQBox from "../components/FAQBox";
import getFAQ from "../utilities/getFAQ";

export default function About() {
    const faqs = getFAQ()

    return (
        <>
            <Header />
            <div className='max-sm:pb-32 py-48 max-sm:space-y-28 space-y-36 px-6 lg:px-8 container xl:max-w-screen-xl mx-auto'>
                <section className='text-center mx-auto max-w-xl'>
                    <h2 className=" text-3xl font-bold tracking-tight sm:text-5xl dark:text-white">Explore, create, and conquer quizzes!</h2>
                    <p className="mt-5 leading-normal text-xl text-gray-700 dark:text-gray-300">Dive into a captivating world of knowledge exploration where you can challenge your intellect by taking quizzes on diverse subjects. Embark on a journey of fun, learning, and endless curiosity today.</p>
                </section>
                <section className="space-y-24">
                    <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="uppercase text-sky-600 tracking-[0.02em]">Empower Your Creativity</div>
                            <h3 className="mt-3 max-w-sm text-2xl font-bold tracking-tight sm:text-3xl dark:text-white">Create and share your quizzes</h3>
                            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Unleash your creativity and knowledge by crafting engaging quizzes. Add questions, provide correct answers, and offer a range of intriguing options to keep participants on their toes. Bring your ideas to life and contribute to the ever-growing world of user-generated quizzes.</p>
                        </div>
                        <div aria-hidden="true" className="mt-10 lg:mt-0">
                            <img src="https://images.unsplash.com/photo-1603195827187-459ab02554a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=360&h=420" alt="" className="max-lg:w-full mx-auto rounded-lg shadow-lg bg-gray-500"/>
                        </div>
                    </div>
                    <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="lg:col-start-2">
                            <div className="uppercase text-sky-600 tracking-[0.02em]">Discover, Learn, and Compete</div>
                            <h3 className="mt-3 max-w-sm text-2xl font-bold tracking-tight sm:text-3xl dark:text-white">Test your knowledge and compare Your skills</h3>
                            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Take quizzes from fellow users, put your knowledge to the test, and see instant results to gauge your understanding. Dive deeper into the experience by exploring how well others fared on the same quiz, allowing you to benchmark your skills and knowledge against a community of quiz enthusiasts.</p>
                        </div>
                        <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
                            <img src="https://images.unsplash.com/photo-1499914567823-c240485cb7d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=360&h=420" alt="" className="max-lg:w-full mx-auto rounded-lg shadow-lg bg-gray-500"/>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="max-w-lg mx-auto text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl dark:text-white">Your ultimate quiz experience.</h2>
                        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Empowering users to both take and create quizzes on a wide range of topics, offering a rich experience.</p>
                    </div>
                    <dl className="mx-auto mt-14 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">Tags and timers.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Craft your own quizzes with ease and add relevant tags to help users find them. You can also add timers to make your quizzes more challenging.</dd>
                            </div>
                        </div>
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">Detailed results.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Get instant feedback with detailed results after taking a quiz. See your score, the number of correct and incorrect answers, and a breakdown of your choices.</dd>
                            </div>
                        </div>
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">Interactive comments and ratings.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Engage with other users by adding comments to quizzes and liking or disliking them. Share your thoughts and foster discussion.</dd>
                            </div>
                        </div>
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">Compare with others.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Measure your performance against other users by viewing their scores for each quiz you take. Compete and improve!</dd>
                            </div>
                        </div>
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">Review quiz responses.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Revisit your submitted quizzes to see how other users have responded. Gain insights and feedback from the community.</dd>
                            </div>
                        </div>
                        <div className="flex">
                            <CheckIcon className={"flex-shrink-0 w-6 h-6 text-sky-600"} />
                            <div className="ml-3">
                                <dt className="text-lg font-bold dark:text-white">In-depth analytics.</dt>
                                <dd className="mt-2 text-gray-700 dark:text-gray-300">Analyze your quiz performance by reviewing which questions you got right or wrong and which choices you picked, all while comparing them to the correct answers.</dd>
                            </div>
                        </div>
                    </dl>
                </section>
                <section>
                    <div className="max-w-lg mx-auto text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl dark:text-white">Your questions answered.</h2>
                        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">We've compiled answers to your most common questions. If you have more questions, feel free to reach out.</p>
                    </div>
                    <div className='mt-14 grid xl:grid-cols-2 gap-5'>
                        {faqs.map(faq => (
                            <FAQBox title={faq.title} body={faq.body} />
                        ))}
                    </div>
                </section>
                <section className='max-lg:flex-col flex items-center justify-between bg-sky-600 text-white rounded-2xl w-full pt-10 pb-6 px-6 sm:px-12 sm:py-12'>
                    <div className="max-w-xl space-y-6 max-lg:text-center max-lg:mx-auto">
                        <h1 className="text-3xl font-bold tracking-tight leading-none !text-gray-100 sm:text-4xl">Join today and start quizzing!</h1>
                        <p className="text-lg">Embark on an exciting journey of knowledge, challenge, and community? Join now. You'll only need an email account.</p>
                    </div>
                    <div className='max-sm:w-full max-lg:mt-8 space-y-3 text-center'>
                        <Link to={'/join'} className='block h-fit !bg-white !text-sky-600 py-3 px-4 rounded-lg max-lg:mx-auto' >Create account</Link>
                        <Link to={'/login'} className='block h-fit border !border-white py-3 px-4 rounded-lg max-lg:mx-auto' >Sign in</Link>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}