/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./src/**/*.{tsx,ts}"],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Open Sans', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: []
}

