/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'var(--bg-primary)',       
          dark: 'var(--bg-secondary)',        
          navbar: 'var(--bg-navbar)',
          primary: 'var(--brand-primary)',     
          muted: 'var(--brand-muted)',       
        },
        theme: {
          text: 'var(--text-primary)',
          textSec: 'var(--text-secondary)',
          border: 'var(--border-color)',
          input: 'var(--bg-input)',
          card: 'var(--bg-secondary)',
        }
      }
    },
  },
  plugins: [],
}