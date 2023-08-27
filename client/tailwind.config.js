/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./src/**/*.{tsx,ts}", "./public/index.html"],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: []
}

