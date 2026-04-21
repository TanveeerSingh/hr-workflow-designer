/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Indigo for trust and collaboration
        primary: '#6366F1',
        'primary-light': '#818CF8',
        'primary-dark': '#4F46E5',
        'on-primary': '#FFFFFF',
        
        // Secondary: Deeper indigo
        secondary: '#4F46E5',
        'on-secondary': '#FFFFFF',
        
        // Accent: Emerald for success and action
        accent: '#059669',
        'accent-light': '#10B981',
        'on-accent': '#FFFFFF',
        
        // Background
        background: '#F8FAFC',
        'background-elevated': '#FFFFFF',
        foreground: '#0F172A',
        
        // Semantic colors with gradients
        success: '#10B981',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#0891B2',
        
        // Surface colors for better hierarchy
        surface: '#FFFFFF',
        'surface-dim': '#F5F3FF',
        'surface-variant': '#E0E7FF',
        
        // Text colors
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-tertiary': '#94A3B8',
        
        // Others
        muted: '#E0E7FF',
        'muted-foreground': '#64748B',
        border: '#E0E7FF',
        ring: '#6366F1',
        destructive: '#DC2626',
        'on-destructive': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'elevation-1': '0 2px 8px rgba(99, 102, 241, 0.1)',
        'elevation-2': '0 4px 16px rgba(99, 102, 241, 0.12)',
        'elevation-3': '0 8px 24px rgba(99, 102, 241, 0.15)',
      },
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-out-right': 'slideOutRight 300ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
}
