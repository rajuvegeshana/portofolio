/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
          text: 'rgb(var(--text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
          border: 'rgb(var(--border-rgb) / <alpha-value>)',
          accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
          card: 'rgb(var(--card-rgb) / <alpha-value>)',
        }
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif']
      }
    },
  },
  plugins: [],
}
