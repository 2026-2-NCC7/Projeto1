/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        primary: {
          DEFAULT: '#FACC15',
          foreground: '#0A0C10',
          dark: '#EAB308',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: '#facc15',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        // Stitch / Cyber Dark Tokens
        canvas: '#0c0e12',
        surface: {
          DEFAULT: '#111318',
          low: '#1a1c20',
          container: '#1e2024',
          high: '#282a2e',
          highest: '#333539',
        },
        brandYellow: '#FACC15',
        brandYellowHover: '#EAB308',
        brandYellowDark: '#CA8A04',
        brandDark: '#0A0C10',
        brandDarkSurface: '#12161E',
        brandDarkCard: '#161B26',
        brandDarkBorder: '#262F40',
        brandOrange: '#FACC15',
        brandNavy: '#0A0C10',
        brandNavyText: '#F8FAFC',
        brandNavySub: '#94A3B8',
        stitch: {
          bg: '#0c0e12',
          surface: '#111318',
          card: '#161B26',
          cardLow: '#1a1c20',
          cardHigh: '#1e2024',
          cardHighest: '#282a2e',
          border: '#262F40',
          borderLight: '#333539',
          yellow: '#FACC15',
          yellowHover: '#EAB308',
          green: '#4edea3',
          textMuted: '#9a9078',
          textLight: '#e2e2e8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        base: '0.35rem',
        card: '0.75rem',
      },
    },
  },
  plugins: [],
}
