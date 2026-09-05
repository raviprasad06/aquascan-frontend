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
        mono: {
          black: '#000000',
          darkest: '#080808',
          dark: '#111111',
          surface: '#161616',
          panel: '#1a1a1a',
          border: '#262626',
          borderLight: '#383838',
          muted: '#666666',
          secondary: '#999999',
          light: '#cccccc',
          bright: '#e5e5e5',
          white: '#ffffff',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'radar-sweep': 'sweep 4s linear infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-scan': 'scan 3s ease-in-out infinite',
        'subtle-glitch': 'glitch 2s infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.25)',
        'glow-md': '0 0 20px rgba(255, 255, 255, 0.35)',
        'glow-lg': '0 0 35px rgba(255, 255, 255, 0.45)',
        'glow-inset': 'inset 0 0 15px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
