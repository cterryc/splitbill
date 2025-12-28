// tailwind.config.js

module.exports = {
  darkMode: 'class', // Habilitar el modo oscuro usando la clase .dark
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        background: 'var(--color-background-light)',
        text: 'var(--color-text-main)',
        'background-dark': 'var(--color-background-dark)',
        'text-muted': 'var(--color-text-muted)',
        'text-dark': 'var(--color-text-dark)'
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)'
      },
      borderRadius: {
        DEFAULT: 'var(--radius-default)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)'
      }
    }
  },
  plugins: []
}
