import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { AppType } from 'next/dist/shared/lib/utils'
import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from 'use-shopping-cart'
import '../styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
const CURRENCY = 'EUR'

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={pageProps.session}>
            <CartProvider
                cartMode="checkout-session"
                stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
                currency={CURRENCY}
            >
                <NextNProgress
                    nonce="my-nonce"
                    color="#3b0067"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                />
                <Component {...pageProps} />
            </CartProvider>
        </SessionProvider>
    )
}

export default MyApp
