import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useShoppingCart } from 'use-shopping-cart'
import { shootFireworks } from '../../content/lib/Utils'
import { fetchGetJSON } from '../../content/utils/api-helpers'
import { CheckIcon, RefreshIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import { InferGetServerSidePropsType } from "next";

export default function RisultatoPagamento (props: any) {
    const router = useRouter()
    const { clearCart } = useShoppingCart()
    const { data, error } = useSWR(
        () => (router.query.session_id ? `/api/checkout_sessions/${router.query.session_id}` : null),
        fetchGetJSON
    )

    useEffect(() => {
        if (data) {
            shootFireworks()
            clearCart()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <>
            <Head>
                <title>Risultato Pagamento</title>
                <link rel="icon" href="/icon-512x512.png" />
                <meta charSet="utf-8" className="next-head" />
            </Head>
            <Header />
            <div className="container h-screen py-12 px-6 text-center xl:max-w-screen-xl">
                {error ? (
                    <div className="mx-auto w-fit rounded-lg bg-red-200 py-4 px-4 shadow-xl">
                        <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                            <ExclamationCircleIcon className="m-2 h-12 w-12 flex-shrink-0 rounded-full bg-red-100 py-2 text-red-600 " />
                            <p className="m-2 text-lg text-red-500">
                                Qualcosa è andato storto, non preccuparti il pagamento non è andato a buon fine!
                            </p>
                        </div>
                    </div>
                ) : !data ? (
                    <div className="mx-auto w-fit rounded-lg bg-gray-200  py-4  px-4 shadow-xl">
                        <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                            <RefreshIcon className="m-2 h-12 w-12 flex-shrink-0 animate-spin rounded-full bg-gray-100 py-2 text-gray-800 " />
                            <p className="mt-3 animate-pulse text-lg">Caricamento . . .</p>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto w-fit rounded-lg bg-green-200 py-4 px-4 shadow-xl">
                        <h2 className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                            <CheckIcon className="m-2 h-12 w-12 flex-shrink-0 rounded-full bg-green-100 py-2 text-green-600 " />
                            <span>Grazie per il tuo ordine!</span>
                            <p className="mt-3 text-base">Controlla la tua email per vedere la ricevuta!</p>
                        </h2>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx)

    if (!session!.user && session!.user == {} && (session as any).user.email === '') {
        return {
            redirect: { destination: '/AccessDenied' },
        }
    }

    return {
        props: { products: null },
    }
}
