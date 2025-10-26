import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        subtle: 'var(--text-subtle)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        info: 'var(--info)',
      },
      borderRadius: {
        '2xl': 'var(--radius)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
    },
  },
  plugins: [],
};

export default config;

