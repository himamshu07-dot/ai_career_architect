/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Aether palette ──────────────────────────────────────
        void:    '#00070A',
        stratum: '#0C1014',
        surface: '#111820',
        hairline: '#1E2A38',
        ink:     '#F2F1EE',
        muted:   '#6B7280',
        // Prism accent triad
        prism: {
          cyan:    '#00D4FF',
          magenta: '#FF3CAC',
          amber:   '#F5A623',
        },
        // Legacy brand (kept for existing classes)
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'fade-up':       'fadeUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 7s ease-in-out infinite',
        'card-in':       'cardIn 0.5s ease-out forwards',
        'orb-float':     'orbFloat 8s ease-in-out infinite',
        'ring-pulse':    'ringPulse 4s ease-in-out infinite',
        'hairline-in':   'hairlineIn 1.2s ease-out forwards',
        'text-reveal':   'textReveal 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-8px) rotate(1deg)' },
          '66%':      { transform: 'translateY(4px) rotate(-0.5deg)' },
        },
        ringPulse: {
          '0%, 100%': { opacity: '0.9' },
          '50%':      { opacity: '0.5' },
        },
        cardIn: {
          '0%':   { opacity: '0', transform: 'translateY(32px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        hairlineIn: {
          '0%':   { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        textReveal: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient':    'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0,212,255,0.06), transparent)',
        'void-gradient':    'linear-gradient(180deg, #00070A 0%, #080e18 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
