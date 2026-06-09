/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Spice Color Palette
        spice: {
          brown:  '#3D2B1F', // Primary: Deep Spice Brown
          dark:   '#1A0F0A',
          medium: '#4A2C1A',
        },
        turmeric: {
          DEFAULT: '#F4C430', // Accent 1: Turmeric Gold
          light:   '#F4C430',
          pale:    '#FDFBF7',
        },
        saffron: {
          DEFAULT: '#F4A900', // Accent 2: Saffron Gold
          dark:    '#F4A900',
        },
        cream: {
          DEFAULT: '#FDFBF7', // Background: Warm Cream
          dark:    '#F5EDD8',
          warm:    '#FDFBF7',
        },
        charcoal: {
          DEFAULT: '#1A1A1A', // Text: Charcoal Black
          soft:    '#1A1A1A',
          muted:   '#6C6C70',
        },
      },

      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        accent:  ['Cormorant Garamond', 'Georgia', 'serif'],
      },

      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Overriding to enforce sharp/minimal border radius (max 2px-4px)
      borderRadius: {
        'none': '0px',
        'xs':   '2px',
        'sm':   '2px',
        'DEFAULT': '2px',
        'md':   '4px',
        'lg':   '4px',
        'xl':   '4px',
        '2xl':  '4px',
        '3xl':  '4px',
        '4xl':  '4px',
        '5xl':  '4px',
      },

      boxShadow: {
        'luxury': '0 4px 40px rgba(61, 43, 31, 0.12)',
        'gold':   '0 0 0 2px rgba(244, 196, 48, 0.4)',
        'card':   '0 2px 20px rgba(61, 43, 31, 0.08)',
        'hover':  '0 8px 40px rgba(61, 43, 31, 0.16)',
      },
    },
  },
  plugins: [],
}

