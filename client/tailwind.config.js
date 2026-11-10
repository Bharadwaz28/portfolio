import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#030606',
        panel: '#070C0E',
        card: '#0A1113',
        accent: { DEFAULT: '#35DCA2', dim: '#1DBB88' },
        ink: '#E8F0ED',
        sub: '#98A7A1',
        muted: '#64736D',
        line: '#20312D',
        warn: '#E0B45C',
        danger: '#F0786E',
      },
      fontFamily: {
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(53,220,162,0.35), 0 0 24px -6px rgba(53,220,162,0.35)',
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        pulseDot: {
          '0%': { boxShadow: '0 0 0 0 rgba(53,220,162,0.55)' },
          '70%': { boxShadow: '0 0 0 6px rgba(53,220,162,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(53,220,162,0)' },
        },
        trace: { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        dash: { to: { strokeDashoffset: '-16' } },
        scan: { '0%': { transform: 'translateY(-10%)' }, '100%': { transform: 'translateY(1100%)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
        bob: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(3px)' } },
        sweep: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        blink: 'blink 1.1s steps(1) infinite',
        'pulse-dot': 'pulseDot 2s ease-out infinite',
        trace: 'trace 3.2s linear infinite',
        dash: 'dash 1s linear infinite',
        scan: 'scan 5s linear infinite',
        marquee: 'marquee 36s linear infinite',
        bob: 'bob 1.6s ease-in-out infinite',
        sweep: 'sweep 6s linear infinite',
      },
    },
  },
  plugins: [containerQueries],
};
