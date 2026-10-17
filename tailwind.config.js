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
          bg: 'var(--bg-color)',
          text: 'var(--text-color)',
          muted: 'var(--muted-color)',
          border: 'var(--border-color)',
          accent: 'var(--accent-color)',
          card: 'var(--card-bg)',
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
