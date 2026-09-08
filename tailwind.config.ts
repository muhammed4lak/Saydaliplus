import type { Config } from 'tailwindcss';

/**
 * The palette lives in CSS variables (src/app/globals.css) and is only *referenced*
 * here, so there is one place to change a colour — the same discipline the
 * prototype kept with its :root block.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          faint: 'var(--ink-faint)',
        },
        indigo: {
          DEFAULT: 'var(--indigo)',
          dark: 'var(--indigo-dark)',
          tint: 'var(--indigo-tint)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          tint: 'var(--amber-tint)',
        },
        palm: {
          DEFAULT: 'var(--palm)',
          tint: 'var(--palm-tint)',
        },
        mist: 'var(--mist)',
        card: 'var(--card)',
        line: 'var(--border)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        arabic: ['var(--font-arabic)'],
      },
      borderRadius: {
        card: '16px',
        sheet: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
