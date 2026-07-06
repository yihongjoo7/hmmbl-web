import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:           'var(--color-primary)',
        'primary-hover':   'var(--color-primary-hover)',
        'primary-light':   'var(--color-primary-light)',
        secondary:         'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        success:           'var(--color-success)',
        'success-hover':   'var(--color-success-hover)',
        'success-light':   'var(--color-success-light)',
        'success-text':    'var(--color-success-text)',
        warning:           'var(--color-warning)',
        'warning-hover':   'var(--color-warning-hover)',
        'warning-light':   'var(--color-warning-light)',
        'warning-text':    'var(--color-warning-text)',
        error:             'var(--color-error)',
        'error-hover':     'var(--color-error-hover)',
        'error-light':     'var(--color-error-light)',
        'error-text':      'var(--color-error-text)',
        info:              'var(--color-info)',
        'info-light':      'var(--color-info-light)',
        'info-text':       'var(--color-info-text)',
        'ring-focus':      'var(--color-ring-focus)',
        'ring-error':      'var(--color-ring-error)',
        bg: {
          primary:   'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary:  'var(--color-bg-tertiary)',
          hover:     'var(--color-bg-hover)',
        },
        text: {
          primary:     'var(--color-text-primary)',
          secondary:   'var(--color-text-secondary)',
          disabled:    'var(--color-text-disabled)',
          inverse:     'var(--color-text-inverse)',
          placeholder: 'var(--color-text-placeholder)',
        },
        border: {
          default: 'var(--color-border-default)',
          focus:   'var(--color-border-focus)',
          error:   'var(--color-border-error)',
          muted:   'var(--color-border-muted)',
          hover:   'var(--color-border-hover)',
          subtle:  'var(--color-border-subtle)',
        },
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};

export default config;
