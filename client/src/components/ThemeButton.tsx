import React from 'react'
import SunIcon from "../icons/SunIcon"
import MoonIcon from "../icons/MoonIcon"

export default function ThemeButton({ className }: { className?: string }) {
    function toggleTheme() {
        if (localStorage.getItem('theme') === 'dark') localStorage.setItem('theme', 'light')
        else localStorage.setItem('theme', 'dark')
        window.dispatchEvent(new Event('storage'))
    }

    return (
        <button onClick={toggleTheme}>
            <SunIcon className={'dark:hidden h-5 w-5 ' + className} />
            <MoonIcon className={'hidden dark:block h-[19px] w-[19px] ' + className} />
        </button>
    )
}