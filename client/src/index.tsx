import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import sysend from "sysend"
import './index.css'
import ErrorPage from './errorPage'
import Home from './routes/home'
import Auth from './routes/auth'
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

function checkVerification(element: JSX.Element) {
    const currentUser = getCurrentUser()
    if (currentUser && (!currentUser.isVerified)) return <Navigate to={'/unverified'} />
    return element
}

const router = createBrowserRouter([
    {
        path: '/',
        element: checkVerification(<Home/>),
        errorElement: <ErrorPage/>
    },
    {
        path: '/unverified',
        element: <Unverified />
    },
    {
        path: '/recover',
        element: checkVerification(<Recover />)
    },
    {
        path: '/reset/:id',
        element: checkVerification(<Reset />)
    },
    {
        path: '/verify/:id',
        element: <VerifyAccount />
    },
    {
        path: '/login',
        element: checkVerification(<Auth type='login' />)
    },
    {
        path: '/register',
        element: checkVerification(<Auth type='register' />)
    },
    {
        path: '/users/:id',
        element: checkVerification(<Profile />)
    },
    {
        path: '/quizzes/:id',
        element: checkVerification(<QuizComponent />)
    },
    {
        path: '/quizzes/:id/responses',
        element: checkVerification(<Responses />)
    },
    {
        path: '/quizzes/:id/questions',
        element: checkVerification(<Questions />)
    },
    {
        path: '/quizzes/:id/results',
        element: checkVerification(<Results />)
    }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <RouterProvider router={router} />
)

// if the user has closed all tabs and if they didnt select "remember me" when they logged in, log them out
sysend.track('close', data => {
    if ((data.count === 0) && (!localStorage.getItem('rememberMe'))) {
        localStorage.removeItem('jwt')
    }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
