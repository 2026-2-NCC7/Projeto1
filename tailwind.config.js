/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F2F8F9',
        foreground: '#0C1D23',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#007585',
          foreground: '#FCFCFC',
          dark: '#003E48',
        },
        secondary: {
          DEFAULT: '#E0EEEF',
          foreground: '#0C1D23',
        },
        muted: {
          DEFAULT: '#E6ECEF',
          foreground: '#54676D',
        },
        accent: {
          DEFAULT: '#CEF0ED',
          foreground: '#003E48',
        },
        destructive: {
          DEFAULT: '#DF2321',
          foreground: '#FCFCFC',
        },
        border: '#CDDADE',
        input: '#CDDADE',
        brandOrange: '#F4763B',
        brandNavy: '#00222F',
        brandNavyText: '#F5F9FA',
        brandNavySub: '#B2C9CD',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        base: '0.35rem', // ~5.6px
      },
      letterSpacing: {
        normal: '0',
      }
    },
  },
  plugins: [],
}
