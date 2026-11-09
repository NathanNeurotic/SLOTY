/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Sizes referenced across the UI (w-8.5, h-9.5, sm:w-88, ...) that Tailwind's default
      // scale does not generate. Without them those buttons fall back to content width and
      // their labels overflow the frame.
      spacing: {
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        88: '22rem',
      },
      colors: {
        casino: {
          950: '#07090e',
          900: '#0c0f18',
          850: '#121724',
          800: '#1a2233',
          700: '#26334d',
          600: '#384869',
        },
        gold: {
          light: '#fff1a8',
          DEFAULT: '#f59e0b',
          bright: '#fbbf24',
          metallic: '#d97706',
          dark: '#78350f',
          bronze: '#451a03',
        },
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff007f',
          purple: '#a855f7',
          amber: '#ffb703',
          green: '#10b981',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)',
        'glow-magenta': '0 0 20px rgba(255, 0, 127, 0.6), 0 0 40px rgba(255, 0, 127, 0.25)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.2)',
        'inner-gold': 'inset 0 0 15px rgba(251, 191, 36, 0.4)',
        'casino-card': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 2s linear infinite',
        'bounce-soft': 'bounceSoft 0.35s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'reel-spin': 'reelSpin 0.35s linear infinite',
      },
      keyframes: {
        reelSpin: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        bounceSoft: {
          '0%': { opacity: '0.8', filter: 'brightness(1.2)' },
          '100%': { opacity: '1', filter: 'brightness(1)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
