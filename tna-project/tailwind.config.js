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
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                // ── Brand Primitives (SPATIAL) ──
                brand: {
                    navy:       'var(--primitive-navy)',
                    'navy-dark': 'var(--primitive-navy-dark)',
                    cyan:       'var(--primitive-cyan-mid)',
                    'cyan-light':'var(--primitive-cyan-light)',
                    orange:     'var(--color-brand-primary)',
                },
                // ── Semantic Status (SPATIAL) ──
                success: {
                    DEFAULT: '#28A745',
                    bg:      '#E8F7EC',
                    border:  '#A3D9B1',
                },
                error: {
                    DEFAULT: '#DC3545',
                    bg:      '#FDECEA',
                    border:  '#F5B3BA',
                },
                warning: {
                    DEFAULT: '#F5A623',
                    bg:      '#FEF6E7',
                    border:  '#FAD98D',
                },
                info: {
                    DEFAULT: '#00B4C9',
                    bg:      '#E6F7FA',
                    border:  '#99DDE8',
                },
                pending: {
                    DEFAULT: '#1A6FC4',
                    bg:      '#EAF2FB',
                },
                // ── Neutral Scale (9-step) ──
                neutral: {
                    50:  '#FAFAFA',
                    100: '#F4F5F6',
                    200: '#EAECEE',
                    300: '#D8DBDF',
                    400: '#B7B7B7',
                    500: '#8C9098',
                    600: '#5C6370',
                    700: '#3A3F47',
                    800: '#1E2228',
                    900: '#0A0D10',
                },
            },
            borderRadius: {
                xs:   '6px',
                sm:   '10px',
                md:   '14px',
                lg:   '20px',
                pill: '9999px',
            },
            spacing: {
                '1':  '4px',
                '2':  '8px',
                '3':  '12px',
                '4':  '16px',
                '5':  '20px',
                '6':  '24px',
                '7':  '28px',
                '8':  '32px',
                '10': '40px',
                '12': '48px',
                '16': '64px',
            },
            fontFamily: {
                sans:  ['Rubik', 'sans-serif'],
                arabic:['Rubik', 'sans-serif'],
                mono:  ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
                'heading': ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
                'subheading':['17px', { lineHeight: '1.4', fontWeight: '600' }],
                'body':    ['15px', { lineHeight: '1.6' }],
                'label':   ['13px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                'caption': ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
                'code':    ['14px', { lineHeight: '1.5', letterSpacing: '0.04em' }],
            },
            boxShadow: {
                'card':  'var(--shadow-card)',
                'modal': 'var(--shadow-modal)',
                'btn':   'var(--shadow-btn)',
            },
            height: {
                'btn-lg':    '56px',
                'btn-md':    '52px',
                'input':     '52px',
                'navbar':    '72px',
            },
            backgroundImage: {
                'btn-primary': 'var(--btn-primary-bg)',
                'splash-bg':   'linear-gradient(150deg, #F4F5F6 60%, var(--color-info-bg) 100%)',
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
            },
            animation: {
                'in': 'fade-in 0.5s ease-out',
                'slide-in-from-bottom': 'slide-in-from-bottom 0.5s ease-out',
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
                    '[dir=\"rtl\"] &': { '--tw-translate-x': '-100%' },
                    'transform': 'translateX(var(--tw-translate-x))',
                },
                '.-translate-x-s-full': {
                    '--tw-translate-x': '-100%',
                    '[dir=\"rtl\"] &': { '--tw-translate-x': '100%' },
                    'transform': 'translateX(var(--tw-translate-x))',
                },
            });
            addVariant('rtl', '[dir=\"rtl\"] &');
            addVariant('ltr', '[dir=\"ltr\"] &');
        }
    ],
}
