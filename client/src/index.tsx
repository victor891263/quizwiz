import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import sysend from "sysend"
import './index.css'
import ErrorPage from './errorPage'
import Home from './routes/home'
import reportWebVitals from './reportWebVitals'
import Profile from "./routes/profile"
import QuizComponent from "./routes/quiz"
import Responses from "./routes/responses"
import Questions from "./routes/questions"
import Results from "./routes/results"
import getCurrentUser from "./utilities/getCurrentUser"
import Unverified from "./routes/unverified"
import VerifyAccount from "./routes/verifyAccount"
import Recover from "./routes/recover"
import Reset from "./routes/reset"
import AddQuiz from "./routes/addQuiz"
import EditQuiz from "./routes/editQuiz"
import initTheme from "./utilities/initTheme"
import Login from "./routes/login"
import Join from "./routes/join"
import About from "./routes/about"
import VerifyEmail from "./routes/verifyEmail";

const currentUser = getCurrentUser()

const routes = [
    {
        path: '/',
        element: <Home/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/users/:id',
        element: <Profile />
    },
    {
        path: '/quizzes/:id',
        element: <QuizComponent />
    }
]

// if nobody is logged in
const guestRouter = createBrowserRouter([
    ...routes,
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/join",
        element: <Join />
    },
    {
        path: '/recover',
        element: <Recover />
    },
    {
        path: '/reset/:id',
        element: <Reset />
    }
])

// if there is a logged-in user but that user hasn't verified their account
const unverifiedRouter = createBrowserRouter([
    {
        path: '/',
        element: <Unverified />,
        errorElement: <ErrorPage />
    },
    {
        path: '/verify/:id',
        element: <VerifyAccount />
    }
])

// if there is a logged-in user and the user is verified
const userRouter = createBrowserRouter([
    ...routes,
    {
        path: '/verifymail/:id',
        element: <VerifyEmail />
    },
    {
        path: '/quizzes/new',
        element: <AddQuiz />
    },
    {
        path: '/quizzes/:id/edit',
        element: <EditQuiz />
    },
    {
        path: '/quizzes/:id/responses',
        element: <Responses />
    },
    {
        path: '/quizzes/:id/questions',
        element: <Questions />
    },
    {
        path: '/quizzes/:id/results',
        element: <Results />
    }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <RouterProvider router={currentUser ? (currentUser.isVerified ? userRouter : unverifiedRouter) : guestRouter} />
)

// if the user has closed all tabs and if they didnt select "remember me" when they logged in, log them out
sysend.track('close', data => {
    if ((data.count === 0) && (!localStorage.getItem('rememberMe'))) {
        localStorage.removeItem('jwt')
        localStorage.removeItem('rememberMe')
    }
})

// initialize dark mode
initTheme()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
