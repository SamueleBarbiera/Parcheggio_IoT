import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import '../build.css'

import NextNProgress from 'nextjs-progressbar'
import { CartProvider } from 'use-shopping-cart'
const CURRENCY = 'EUR'

export const myLoader = ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 50}`
}

export default function MyApp({ Component, pageProps }:AppProps) {
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
