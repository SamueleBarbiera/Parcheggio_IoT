import { ExclamationCircleIcon, RefreshIcon } from '@heroicons/react/solid'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { Product } from 'use-shopping-cart/core'
import { fetchPostJSON } from '../../content/utils/api-helpers'

function Checkout(props: any) {
    const { cartDetails, totalPrice, addItem, clearCart, redirectToCheckout } = useShoppingCart()
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const biglietto: Product[] = [
        {
            name: 'Biglietto',
            id: 'price_1GwzfVCNNrtKkPVCh2MVxRkO',
            price: props.findFirst.costo_finale,
            currency: 'EUR',
            description: 'Biglietto di sosta nel parcheggio',
        },
    ]

    console.log(props.findFirst)
    const handleCheckout: any = async () => {
        setLoading(true)
        setErrorMessage('')
        addItem(biglietto)

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

    useEffect(() => {
        handleCheckout()
    }, [])

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
                <></>
            )}
        </>
    )
}

export default Checkout

export async function getServerSideProps() {
    const prisma = new PrismaClient()

    const findPagamento = await prisma.durata.findFirst({
        take: -1,
        where: {
            pagamento_effettuato: true,
            NOT: [
                {
                    costo_finale: undefined,
                    parcheggi_id_fk: '',
                },
            ],
        },
    })
    return {
        props: findPagamento,
    }
}
