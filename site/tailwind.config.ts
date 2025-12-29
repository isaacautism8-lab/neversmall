import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NeverSmall Brand Colors
        'ns-black': '#050505',
        'ns-off-black': '#0a0a0a',
        'ns-charcoal': '#141414',
        'ns-white': '#fafafa',
        'ns-cream': '#f5f0e6',
        'ns-cream-light': '#faf8f4',
        'ns-warm': '#e8d5b5',
        'ns-gold': '#c9a96e',
        // Vibrant Accents
        'ns-coral': '#e07860',
        'ns-lavender': '#9b8ec4',
        'ns-sage': '#8fa88a',
        'ns-sky': '#7ba3c9',
        'ns-peach': '#e8b89d',
        'ns-mint': '#6ecf9a',
        'ns-violet': '#8b6ec9',
        // Gray Scale
        'ns-gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#d4d4d4',
          300: '#b3b3b3',
          400: '#8a8a8a',
          500: '#6b6b6b',
          600: '#525252',
          700: '#3a3a3a',
          800: '#262626',
          850: '#1f1f1f',
          900: '#171717',
          950: '#0d0d0d',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'headline': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'prose-wide': '75ch',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float': 'gentleFloat 6s ease-in-out infinite',
        'glow': 'glowPulse 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
      },
      keyframes: {
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(139, 110, 201, 0.2)' },
          '50%': { boxShadow: '0 0 60px rgba(139, 110, 201, 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, var(--ns-violet) 0%, var(--ns-coral) 50%, var(--ns-gold) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
