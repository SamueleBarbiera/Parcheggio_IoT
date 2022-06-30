const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        register: true,
        disable: process.env.NODE_ENV === 'development',
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
        formats: ['image/avif', 'image/webp'],
    },
})
