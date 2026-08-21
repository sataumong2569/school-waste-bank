/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                fredoka: ['Fredoka One', 'cursive'],
                nunito: ['Nunito', 'sans-serif'],
                prompt: ['Prompt', 'sans-serif'],
            },
        },
    },
    plugins: [],
}