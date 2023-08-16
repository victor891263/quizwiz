import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import ErrorPage from './errorPage'
import Home from './routes/home'
import Auth from './routes/auth'
import reportWebVitals from './reportWebVitals'
import Profile from "./routes/profile"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/login',
        element: <Auth type='login' />
    },
    {
        path: '/register',
        element: <Auth type='register' />
    },
    {
        path: '/users/:id',
        element: <Profile />
    }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <RouterProvider router={router} />
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
