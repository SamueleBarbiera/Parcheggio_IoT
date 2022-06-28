/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { fetcher } from '../content/lib/fetcher'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart'

export default function Home(props) {
    const Router = useRouter()
    const { clearCart, totalPrice } = useShoppingCart()
    const url: any = '/cart/Checkout'

    useEffect(() => {
        clearCart()
    }, [])

    const { data, error } = useSWR('/api/data/durata/checkLastRecord', fetcher, {
        refreshInterval: 1000,
    })

    if (data == null || data == 'undefined' || error || !data) {
        return (
            <>
                <Head>
                    <title>Home</title>
                    <link rel="icon" href="/icon-512x512.png" />
                    <meta charSet="utf-8" className="next-head" />
                </Head>

                <Header />
                <main className="flex h-screen items-center justify-center">{totalPrice}</main>
                <Footer />
            </>
        )
    } else {
        const costo_fin: any = JSON.parse(JSON.stringify(data.avviaPagamento))
        Router.push({ pathname: url, query: { costo_finale: JSON.stringify(costo_fin) } }, url)
        return null
    }
}
