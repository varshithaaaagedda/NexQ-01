/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nex: {
          bg: '#080C14',
          surface: '#0E1422',
          card: '#141C2E',
          cardHover: '#1A253D',
          border: '#1E2B42',
          borderLight: '#283854',
          accent: '#0284C7',
          accentHover: '#0369A1',
          sky: '#38BDF8',
          textMain: '#F8FAFC',
          textMuted: '#94A3B8',
          textDim: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
