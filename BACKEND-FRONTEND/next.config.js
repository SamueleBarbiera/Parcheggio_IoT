const withPWA = require('next-pwa')
const withPreact = require('next-plugin-preact')
const withCss = require('@zeit/next-css')

module.exports = withPWA(
    withPreact(
        withCss({
            pwa: {
                dest: 'public',
                register: true,
                disable: process.env.NODE_ENV === 'development',
            },
            reactStrictMode: true,
            swcMinify: true,
            typescript: {
                ignoreBuildErrors: true,
            },
            eslint: {
                ignoreDuringBuilds: true,
            },
            images: {
                domains: ['lh3.googleusercontent.com'],
                formats: ['image/avif', 'image/webp'],
            },
            env: {
                API_URL: process.env.NEXT_URL,
                //IMAGES_DOMAIN: process.env.IMAGES_DOMAIN,
            },
            publicRuntimeConfig: {
                API_URL: process.env.NEXT_URL,
                //IMAGES_DOMAIN: process.env.IMAGES_DOMAIN,
            },
        })
    )
)
