import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
      },
      colors: {
        bg:  '#06060f',
        s1:  '#0d0d20',
        s2:  '#121230',
        s3:  '#191940',
        lime: {
          DEFAULT: '#d4f000',
          hi:      '#e8ff00',
          dim:     'rgba(212,240,0,0.10)',
          glow:    'rgba(212,240,0,0.28)',
          border:  'rgba(212,240,0,0.22)',
          border2: 'rgba(212,240,0,0.40)',
        },
        purple: {
          DEFAULT: '#7c3aed',
          soft:    '#a78bfa',
        },
        t1: '#f0eeff',
        t2: '#9896b8',
        t3: '#56546e',
      },
      boxShadow: {
        lime:    '0 10px 42px rgba(212,240,0,0.28)',
        'lime-sm': '0 4px 20px rgba(212,240,0,0.18)',
        card:    '0 4px 32px rgba(0,0,0,0.55)',
        glow:    '0 0 48px rgba(212,240,0,0.14)',
      },
      backgroundImage: {
        'scene': "linear-gradient(180deg,rgba(6,6,15,.70) 0%,rgba(6,6,15,.45) 40%,rgba(6,6,15,.92) 100%), url('https://i.nuuls.com/yX50N.png')",
        'scene-cta': "linear-gradient(180deg,rgba(6,6,15,.82) 0%,rgba(6,6,15,.68) 50%,rgba(6,6,15,.92) 100%), url('https://i.nuuls.com/yX50N.png')",
        'lime-grad': 'linear-gradient(135deg, #d4f000 0%, #a8c800 100%)',
        'card-grad': 'linear-gradient(135deg, #121230 0%, #0d0d20 100%)',
        'feat-grad': 'linear-gradient(130deg, #191940 0%, #121230 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        pulse_lime: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,240,0,.3)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(212,240,0,0)' },
        },
      },
      animation: {
        'fade-up':   'fade-up .5s ease both',
        float:       'float 4s ease-in-out infinite',
        pulse_lime:  'pulse_lime 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
