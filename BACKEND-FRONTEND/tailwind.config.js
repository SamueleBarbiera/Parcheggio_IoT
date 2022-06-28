/** @type {import('tailwindcss').Config} */
module.exports = {
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
    content: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./src/**/*.{js,ts,jsx,tsx}'],
        options: {
            safelist: [],
        },
    },
    theme: {
        container: {
            center: true,
        },
        screens: {
            xsm: '300px',
            sm: '400px',
            smd: '520px',
            md: '600px',
            xsmd: '650px',
            xmd: '715px',
            xlmd: '800px',
            lg: '954px',
            xl: '1200px',
            '2xl': '1536px',
        },
        extend: {
            spacing: {
                94: '22rem',
                120: '30rem',
                128: '32rem',
                127: '33.7rem',
                129: '36rem',
                130: '38.5rem',
                132: '40rem',
                144: '42rem',
                152: '56rem',
                165: '64rem',
                182: '71rem',
            },
        },
    },
    variants: {
        outline: ['focus'],
    },
}
