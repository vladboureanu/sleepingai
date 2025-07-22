/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['var(--font-roboto)', 'sans-serif'],
      },
      fontSize: {
        'body': '16px',
        'heading-sm': '24pt',
        'heading-md': '28pt', 
        'heading-lg': '32pt',
      }
    },
  },
  plugins: [],
}