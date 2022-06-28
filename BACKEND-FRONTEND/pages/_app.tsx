import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from 'use-shopping-cart'
import '../styles/globals.css'
const CURRENCY = 'EUR'

export default function App({ Component, pageProps }:AppProps) {
    return (
        <Provider session={pageProps.session}>
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
        </Provider>
    )
}
