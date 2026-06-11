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
          brown:  '#2C1810', // Primary: Deep Brown
          dark:   '#1A0C08',
          medium: '#4A2B1D',
        },
        turmeric: {
          DEFAULT: '#D69A2D', // Saffron Gold
          light:   '#E5B250',
          pale:    '#F7F2EA',
        },
        saffron: {
          DEFAULT: '#D69A2D', // Saffron Gold
          dark:    '#B87F1E',
        },
        cream: {
          DEFAULT: '#F7F2EA', // Background: Ivory
          dark:    '#DCCDB7', // Sand Beige
          warm:    '#F7F2EA',
        },
        charcoal: {
          DEFAULT: '#2C1810', // Text: Deep Brown
          soft:    '#3D2A21',
          muted:   '#7A675C',
        },
        botanical: {
          DEFAULT: '#73805A', // Cardamom Green
        }
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

