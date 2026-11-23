import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF4C27',
        // Orange du logo, tons chauds et surfaces blanches.
        ink: {
          DEFAULT: '#102E3A',
          50: '#F2F6F8',
          100: '#E0E9EE',
          200: '#CCDAE2',
          300: '#A6BBC7',
          400: '#718D9B',
          500: '#526C7A',
          600: '#3D5967',
          700: '#294754',
          800: '#1E3A47',
          900: '#102E3A',
          950: '#09232E',
        },
        canal: {
          DEFAULT: '#AD3008',
          50: '#FFF2EB',
          100: '#FFE3D5',
          200: '#FFC8AF',
          300: '#FFA582',
          400: '#FF7648',
          500: '#FF430B',
          600: '#AD3008',
          700: '#942A08',
          800: '#792208',
          900: '#5A1907',
        },
        brick: {
          DEFAULT: '#A52D24',
          50: '#FFF0EE',
          100: '#FBDDD9',
          200: '#F5B5AE',
          300: '#E98A80',
          400: '#CC5348',
          500: '#A52D24',
          600: '#8D241C',
          700: '#741C14',
          800: '#58120C',
        },
        sand: {
          DEFAULT: '#F4F7F9',
          50: '#FFFFFF',
          100: '#F4F7F9',
          200: '#E9F0F4',
          300: '#D8E5EB',
          400: '#B9CCD6',
        },
        status: {
          available: '#3C7660',
          reserved: '#B8862E',
          rented: '#6B7280',
          draft: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '600' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16,46,58,0.08), 0 1px 2px -1px rgba(16,46,58,0.06)',
        card: '0 4px 16px -4px rgba(16,46,58,0.10), 0 2px 6px -2px rgba(16,46,58,0.06)',
        lifted: '0 20px 40px -12px rgba(16,46,58,0.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        marquee: 'marquee 34s linear infinite',
        'marquee-reverse': 'marquee-reverse 34s linear infinite',
      },
      backgroundImage: {
        'canal-line':
          'linear-gradient(90deg, transparent, rgba(173,48,8,0.18) 20%, rgba(173,48,8,0.18) 80%, transparent)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
