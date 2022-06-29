/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { fetcher } from '../content/lib/fetcher'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import dynamic from 'next/dynamic'
import 'mapbox-gl/dist/mapbox-gl.css'
import ReactMapGL, { Marker } from 'react-map-gl'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const Map = dynamic(() => import('../components/map/Map'), {
    loading: () => 'Loading...',
    ssr: false,
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [viewport, setViewport] = useState<any>({
        width: '100%',
        height: '100%',
        // The latitude and longitude of the center of London
        latitude: 51.5074,
        longitude: -0.1278,
        zoom: 10,
    })
    const Router = useRouter()
    const [locations, setLocations] = useState<any>([])
    const { clearCart } = useShoppingCart()
    const url: any = '/cart/Checkout'

    useEffect(() => {
        clearCart()
        setLocations(props.locations.features)
    }, [])

    const { data, error } = useSWR('/api/data/durata/checkLastRecord', fetcher, {
        refreshInterval: 1000,
    })

    if (data == null || data == 'undefined' || error || !data) {
        console.log(locations)
        return (
            <>
                <Head>
                    <title>Home</title>
                    <link rel="icon" href="/icon-512x512.png" />
                    <meta charSet="utf-8" className="next-head" />
                </Head>

                <Header />
                <main className="flex h-screen items-center justify-center">
                    <ReactMapGL
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxApiAccessToken="pk.eyJ1Ijoic2FtdWVsZWJhciIsImEiOiJjbDR5aXUweXcxc2c4M2RwaG42ejA5dWhyIn0.7W4XYH511gTPfwSt2cZkHQ"
                        {...viewport}
                        onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
                    >
                        {locations.map((location: any) => (
                            <div key={location.id}>
                                <Marker
                                    latitude={location.center[1]}
                                    longitude={location.center[0]}
                                    offsetLeft={-20}
                                    offsetTop={-10}
                                >
                                    <span role="img" aria-label="push-pin">
                                        📌
                                    </span>
                                </Marker>
                            </div>
                        ))}
                    </ReactMapGL>
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

export const getServerSideProps: GetServerSideProps = async () => {
    const urlMap = `https://api.mapbox.com/geocoding/v5/mapbox.places/thiene.json?access_token=pk.eyJ1Ijoic2FtdWVsZWJhciIsImEiOiJjbDR5aXUweXcxc2c4M2RwaG42ejA5dWhyIn0.7W4XYH511gTPfwSt2cZkHQ&limit=1`

    const res = await fetch(urlMap)
    const data = await res.text()
    const finalRes = await JSON.parse(data)
    return {
        props: {
            locations: finalRes,
        },
    }
}
