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
                role: {
                    owner: '#0d9488',
                    carrier: '#2563eb',
                    gov: '#d97706',
                    visitor: '#64748b'
                },
                success: 'hsl(142, 69%, 41%)',
                danger: 'hsl(0, 84%, 60%)',
                warning: 'hsl(39, 100%, 50%)',
                'tna-gray': {
                    50: 'hsl(210, 20%, 98%)',
                    200: '#e2e8f0', // Enforced border color
                    400: 'hsl(210, 10%, 70%)',
                    600: 'hsl(210, 8%, 45%)',
                    900: 'hsl(210, 10%, 15%)',
                },
                'primitive-cyan-mid': 'var(--primitive-cyan-mid)',
                'primitive-navy': 'var(--primitive-navy)',
                'primitive-amber': 'var(--primitive-amber)',
            },
            borderRadius: {
                sm: "calc(var(--radius) - 4px)",
                md: "calc(var(--radius) - 2px)",
                lg: "var(--radius)",
            },
            spacing: {
                '3': '12px',
                '4': '16px',
                '6': '24px',
            },
            fontFamily: {
                sans: ['Rubik', 'sans-serif'],
                en: ['Rubik', 'sans-serif'],
                ar: ['Rubik', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
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
            boxShadow: {
                // Enforce flat design by resetting default shadows used for cards (if any)
                'sm': 'none',
                'md': 'none',
                'lg': 'none',
                'xl': 'none',
                '2xl': 'none',
            }
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
