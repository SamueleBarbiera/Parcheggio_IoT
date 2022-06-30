/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { fetcher } from '../content/lib/fetcher'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import MapboxMap from '../components/map/mapbox-map'
import MapContext from '../components/map/pass-map-with-context'
import MapProps from '../components/map/pass-map-with-props'
import { AiOutlineLoading } from 'react-icons/ai'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

export default function Home(props) {
    const [loading, setLoading] = useState(true)
    const handleMapLoading = () => setLoading(false)
    const Router = useRouter()
    const { clearCart } = useShoppingCart()
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
                <main className="relative mx-auto flex h-screen  items-center justify-center">
                    <>
                        {loading && (
                            <div className="absolute flex h-2/3 w-2/3 flex-col items-center justify-center rounded-xl bg-indigo-50 p-12 shadow-lg">
                                <AiOutlineLoading className="mb-6 h-12 w-12 flex-shrink-0 animate-spin flex-row text-indigo-600" />
                                <h1 className=" animate-pulse flex-row font-normal">Inizializando la mappa</h1>
                            </div>
                        )}
                        <div className="abolute h-2/3 w-2/3 flex-col items-center justify-center rounded-xl  shadow-xl">
                            <MapboxMap initialOptions={{ center: [38.0983, 55.7038] }} onLoaded={handleMapLoading} />
                        </div>
                    </>
                </main>
                <Footer />
            </>
        )
    } else {
        const costo_fin: any = JSON.parse(JSON.stringify(data.avviaPagamento))
        Router.push({ pathname: url, query: { costo_finale: JSON.stringify(costo_fin) } }, url)
        return null
    }
}
