import { ExclamationCircleIcon, RefreshIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { fetchPostJSON } from '../../content/utils/api-helpers'
import { useShoppingCart } from 'use-shopping-cart'
import { Product } from 'use-shopping-cart/core'
import { useRouter } from 'next/router'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import { LockClosedIcon } from '@heroicons/react/solid'
import { getSession } from 'next-auth/react'
import Head from 'next/head'

import React from 'react'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'

const Checkout: React.FC<any> = () => {
    const router = useRouter()
    const { cartDetails, totalPrice, clearCart, redirectToCheckout } = useShoppingCart()
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    let costo_finale: any = Number((router.query!.costo_finale! as any).replace(/\D/g, ''))
    console.log('🚀 - file: Checkout.tsx - line 14 - Checkout - costo_finale', costo_finale)
    useEffect(() => {
        clearCart()
    }, [])
    const [disable, setDisable] = useState(false)

    const biglietto: Product[] = [
        {
            name: 'Biglietto',
            id: 'prsdccdice_1GwzfVCNNrtKkPVCh2MVxRkO',
            price: costo_finale,
            currency: 'EUR',
            description: 'Biglietto di sosta nel parcheggio',
            sku: 'assaasd',
        },
    ]

    const products = [
        {
            name: 'Biglietto',
            price: costo_finale,
            currency: 'EUR',
            imageAlt: 'Biglietto di sosta nel parcheggio',
            sku: 'assaasd',
            id: 1,
            href: '#',
            imageSrc:
                'https://img.freepik.com/free-vector/parking-ticket-money-penalty-receipt-vector-illustration-isolated_53562-7764.jpg',
        },
    ]

    function ProductList() {
        const cart = useShoppingCart()
        const { addItem } = cart

        return (
            <div>
                {biglietto.map((product) => (
                    <div key={product.id}>
                        <button
                            className="transiction mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-xl duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                                addItem(product)
                                setDisable(true)
                            }}
                            disabled={disable}
                        >
                            Accetta le condizioni di privacy
                        </button>
                    </div>
                ))}
            </div>
        )
    }

    const handleCheckout: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')

        // eslint-disable-next-line quotes
        const response = await fetchPostJSON(`/api/payments/checkout_sessions/cart`, { cartDetails }, { totalPrice })

        if (response.statusCode > 399) {
            console.error(response.message)
            setErrorMessage(response.message.code)
            setLoading(false)
            return
        }

        redirectToCheckout({ sessionId: response.id })
        window.location = response.url
        clearCart()
    }

    return (
        <>
            {loading ? (
                <div className="mx-auto flex h-screen max-w-full items-center justify-center bg-indigo-200  py-4  px-4 shadow-xl">
                    <div className="mx-auto flex flex-auto flex-col items-center justify-center space-x-1 text-4xl font-semibold">
                        <RefreshIcon className="m-2 mx-auto h-12 w-12 flex-shrink-0 animate-spin items-center justify-center rounded-full bg-indigo-100 py-2 text-gray-800 " />
                        <p className="mt-3 animate-pulse text-lg">Caricamento . . .</p>
                    </div>
                </div>
            ) : errorMessage ? (
                <div className="mx-auto flex h-screen max-w-full items-center justify-center bg-red-100  py-4  px-4 shadow-xl">
                    <div className="mx-auto flex flex-auto flex-col items-center justify-center space-x-1 text-4xl font-semibold">
                        <ExclamationCircleIcon className="mx-auto mt-3 h-12 w-12 flex-shrink-0 items-center justify-center  text-red-600" />
                        <p className="mt-3 text-lg text-red-500">
                            Qualcosa è andato storto, non preccuparti il pagamento non è andato a buon fine . . .
                        </p>
                        {errorMessage ? <p style={{ color: 'red' }}>Error: {errorMessage}</p> : null}
                    </div>
                </div>
            ) : (
                <>
                    <Head>
                        <title>Checkout</title>
                        <link rel="icon" href="/question-solid.svg" />
                        <meta charSet="utf-8" className="next-head" />
                    </Head>

                    <Header />
                    {/* Order summary */}
                    <main className="mx-auto flex max-h-full items-center justify-between bg-indigo-50 px-4 py-6 ">
                        <div className="mx-auto max-h-max max-w-lg  items-center justify-between">
                            <div className="flex items-center justify-between">
                                <h2 id="order-heading" className="text-lg font-medium text-indigo-900">
                                    Il tuo ordine
                                </h2>
                            </div>

                            <div>
                                <ul role="list" className="mx-auto block ">
                                    {products.map((product) => (
                                        <li key={product.id} className="flex space-x-6 p-8">
                                            <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                className="mt-12 h-52 w-64 flex-none rounded-md bg-indigo-200 object-cover object-center sm:mt-0 sm:h-64 sm:w-120"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <ProductList />
                            <form onSubmit={handleCheckout} className="mx-auto max-w-lg">
                                {errorMessage ? <p style={{ color: 'red' }}>Error: {errorMessage}</p> : null}
                                <div className="mt-6 w-full">
                                    <button
                                        type="submit"
                                        disabled={disable == false || loading}
                                        className="transiction mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-xl duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Mandami al Checkout
                                    </button>
                                </div>
                                <p className="mt-6 flex justify-center text-sm font-medium text-indigo-900">
                                    <LockClosedIcon className="mr-1.5 h-5 w-5 text-indigo-900" aria-hidden="true" />I
                                    dettagli delle carte non vengono salvati
                                </p>
                            </form>
                        </div>
                    </main>
                    <Footer />
                </>
            )}
        </>
    )
}
export default Checkout
// export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
//     const session = await getSession(ctx)

//     if (!session!.user && session!.user == {} && (session as any).user.email === '') {
//         return {
//             redirect: { destination: '/AccessDenied' },
//         }
//     }

//     return {
//         props: { products: session },
//     }
// }
