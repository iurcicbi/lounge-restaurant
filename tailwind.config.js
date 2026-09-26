module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          black: '#000000',
          deep: '#0A0A0A',
          card: '#111111',
          elevated: '#161616'
        },
        gold: {
          DEFAULT: '#CC9320',
          muted: '#8A6415',
          soft: '#E4B85A'
        },
        ink: '#FFFFFF',
        smoke: '#B8B8B8',
        line: 'rgba(204, 147, 32, 0.24)'
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Arial', 'sans-serif']
      },
      boxShadow: {
        gold: '0 0 40px rgba(204, 147, 32, 0.15)',
        'gold-strong': '0 0 50px rgba(204, 147, 32, 0.28)',
        panel: '0 24px 80px rgba(0, 0, 0, 0.48)'
      },
      letterSpacing: {
        editorial: '0.22em'
      },
      backgroundImage: {
        'gold-fade': 'linear-gradient(90deg, transparent, rgba(204, 147, 32, 0.28), transparent)'
      }
    }
  },
  plugins: []
};
