/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { fetcher } from '../content/lib/fetcher'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { AiOutlineLoading } from 'react-icons/ai'
import mapboxgl from 'mapbox-gl'

export default function Home(props) {
    const [loading, setLoading] = useState(true)
    const Router = useRouter()
    const { clearCart } = useShoppingCart()
    const url: any = '/cart/Checkout'
    const coords: any = [ 11.483793,45.7034062]
    const start: any = [11.4374603, 45.4723841]

    useEffect(() => {
        clearCart()
        const map = new mapboxgl.Map({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: start,
            zoom: 15,
        })
        async function getMapData() {
            // make a directions request using cycling profile
            // an arbitrary start will always be the same
            // only the end or destination will change
            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${coords[0]},${coords[1]}?steps=true&geometries=geojson&language=it&access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`
            )
            const json = await query.json()
            const data = json.routes[0]
            const route = data.geometry.coordinates
            const geojson: any = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route,
                },
            }
            // if the route already exists on the map, we'll reset it using setData
            if (map.getSource('route')) {
                map.getSource('route').setData(geojson)
            }
            // otherwise, we'll make a new request
            else {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson,
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75,
                    },
                })
            }
            // add turn instructions here at the end
            const instructions = document.getElementById('instructions')
            const steps = data.legs[0].steps

            let tripInstructions = ''
            for (const step of steps) {
                tripInstructions += `<li>${step.maneuver.instruction}</li>`
            }
            instructions!.innerHTML = `<p><strong>Arriverai a destinazione fra : ${Math.floor(
                data.duration / 60
            )} min 🚘 </strong></p><ol>${tripInstructions}</ol>`
        }

        map.on('load', () => {
            // Add starting point to the map
            map.addLayer({
                id: 'point',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: start,
                                },
                            },
                        ],
                    },
                },
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#3887be',
                },
            })
            // this is where the code from the next step will go

            const end = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: coords,
                        },
                    },
                ],
            }
            map.addLayer({
                id: 'end',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: coords,
                                },
                            },
                        ],
                    },
                },
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#f30',
                },
            })
        })
        getMapData()
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
                        <div className="absolute h-2/3 w-2/3 flex-col items-center justify-center rounded-lg shadow-xl">
                            <div id="mapbox" className="mx-auto h-full w-full z-0 rounded-xl"></div>

                            <div
                                id="instructions"
                                className="container absolute inset-x-0 -bottom-1/4 z-50 m-20 mx-auto h-12 w-full flex-row overflow-y-auto rounded-b-xl bg-white p-12 shadow-xl"
                            ></div>
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
