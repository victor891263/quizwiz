/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./src/**/*.{tsx,ts}"],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Noto Serif', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: []
}

