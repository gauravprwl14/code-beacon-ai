/** @type {import('tailwindcss').Config} */

const { join } = require('path');

module.exports = {
    content: [join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')],
    presets: [require('../../tailwind-workspace-preset.js')],
    purge: [
        join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')
    ],
    mode: 'jit',
    theme: {
        extend: {},
    },
    plugins: [],
}