/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--color-divider)",
                input: "var(--color-border-light)",
                ring: "var(--color-primary)",
                background: "var(--color-background)",
                foreground: "var(--text-primary)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--text-on-primary)",
                    dark: "var(--color-primary-dark)",
                    light: "var(--color-primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--text-on-primary)",
                    light: "var(--color-secondary-light)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--text-on-primary)",
                    light: "var(--color-accent-light)",
                },
                brand: {
                    navy:       'var(--primitive-navy)',
                    'navy-dark': 'var(--primitive-navy-dark)',
                    'navy-mid':  'var(--primitive-navy-mid)',
                    'navy-light':'var(--primitive-navy-light)',
                    cyan:       'var(--primitive-cyan)',
                    'cyan-dark': 'var(--primitive-cyan-dark)',
                    'cyan-light':'var(--primitive-cyan-light)',
                    orange:     'var(--primitive-orange)',
                    teal:       'var(--primitive-teal)',
                },
                success: {
                    DEFAULT: 'var(--color-success)',
                    light:   'var(--color-success-light)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                    border:  'var(--color-error-border)',
                    light:   'var(--color-error-light)',
                },
                warning: {
                    DEFAULT: 'var(--color-warning)',
                },
                info: {
                    DEFAULT: 'var(--color-info)',
                },
                white:      'var(--color-white)',
                surface:    'var(--color-surface)',
                'surface-200': 'var(--color-surface-200)',
                divider:    'var(--color-divider)',
                'border-light': 'var(--color-border-light)',
                text: {
                    primary:    'var(--text-primary)',
                    secondary:  'var(--text-secondary)',
                    placeholder:'var(--text-placeholder)',
                    link:       'var(--text-link)',
                    disabled:   'var(--text-disabled)',
                    caption:    'var(--text-caption)',
                }
            },
            borderRadius: {
                sm:     'var(--radius-sm)',
                md:     'var(--radius-md)',
                lg:     'var(--radius-lg)',
                xl:     'var(--radius-xl)',
                '2xl':    'var(--radius-2xl)',
                full:   'var(--radius-full)',
            },
            spacing: {
                '0':   'var(--space-0)',
                '1':   'var(--space-1)',
                '2':   'var(--space-2)',
                '3':   'var(--space-3)',
                '4':   'var(--space-4)',
                '5':   'var(--space-5)',
                '6':   'var(--space-6)',
                '7':   'var(--space-7)',
                '8':   'var(--space-8)',
                '10':  'var(--space-10)',
                '12':  'var(--space-12)',
            },
            fontFamily: {
                sans:    ['Rubik', 'sans-serif'],
                arabic:  ['Rubik', 'sans-serif'],
                english: ['Rubik', 'sans-serif'],
                mono:    ['var(--font-mono)', 'monospace'],
            },
            fontSize: {
                xs:     ['var(--text-xs)', { lineHeight: 'var(--leading-relaxed)' }],
                sm:     ['var(--text-sm)', { lineHeight: 'var(--leading-relaxed)' }],
                base:   ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
                md:     ['var(--text-md)', { lineHeight: 'var(--leading-normal)' }],
                lg:     ['var(--text-lg)', { lineHeight: 'var(--leading-tight)' }],
                xl:     ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
                '2xl':  ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
                '3xl':  ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
            },
            boxShadow: {
                card:           'var(--shadow-card)',
                'card-hover':   'var(--shadow-card-hover)',
                button:         'var(--shadow-button)',
                'button-red':   'var(--shadow-button-red)',
                navbar:         'var(--shadow-navbar)',
                header:         'var(--shadow-header)',
                input:          'var(--shadow-input)',
            },
            transitionDuration: {
                instant:    'var(--duration-instant)',
                fast:       'var(--duration-fast)',
                normal:     'var(--duration-normal)',
                slow:       'var(--duration-slow)',
            },
            transitionTimingFunction: {
                default:    'var(--ease-default)',
                in:         'var(--ease-in)',
                out:        'var(--ease-out)',
                spring:     'var(--ease-spring)',
            },
            height: {
                navbar:     'var(--navbar-height)',
                header:     'var(--header-height)',
                input:      'var(--input-height)',
                button:     'var(--input-height)',
                'button-lg': '60px',
                'btn-primary': 'var(--btn-primary-height)',
            },
            maxWidth: {
                content:    'var(--layout-content-max-width)',
            },
            backgroundImage: {
                'primary-gradient': 'var(--color-primary-gradient)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in-from-bottom': {
                    '0%': { transform: 'translateY(1rem)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'zoom-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                'in': 'fade-in 0.5s ease-out',
                'slide-in-from-bottom': 'slide-in-from-bottom 0.5s ease-out',
                'zoom-in': 'zoom-in 0.3s ease-out',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        function({ addUtilities, addVariant }) {
            addUtilities({
                '.translate-x-s-0': {
                    transform: 'translateX(0)',
                },
                '.translate-x-s-full': {
                    '--tw-translate-x': '100%',
                    '[dir="rtl"] &': { '--tw-translate-x': '-100%' },
                    'transform': 'translateX(var(--tw-translate-x))',
                },
                '.-translate-x-s-full': {
                    '--tw-translate-x': '-100%',
                    '[dir="rtl"] &': { '--tw-translate-x': '100%' },
                    'transform': 'translateX(var(--tw-translate-x))',
                },
            });
            addVariant('rtl', '[dir="rtl"] &');
            addVariant('ltr', '[dir="ltr"] &');
        }
    ],
}
