import { ExclamationCircleIcon, RefreshIcon } from '@heroicons/react/solid'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../../content/utils/api-helpers'

function Checkout() {
    const { cartDetails, totalPrice, redirectToCheckout } = useShoppingCart()
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleCheckout: any = async () => {
        setLoading(true)
        setErrorMessage('')

        const response = await fetchPostJSON(`/api/payments/checkout_sessions/cart`, { cartDetails }, { totalPrice })

        if (response.statusCode > 399) {
            console.error(response.message)
            setErrorMessage(response.message.code)
            setLoading(false)
            return
        }

        console.log('🚀 - file: Checkout.tsx - line 18 - consthandleCheckout:any= - response', response)

        redirectToCheckout({ sessionId: response.id })
        // const res = await axios.get('/api/payments/checkout_sessions/cart')
        window.location = response.url
    }

    useEffect(() => {
        handleCheckout()
    }, [])

    return (
        <>
            {loading ? (
                <div className="mx-auto h-min max-w-full rounded-lg bg-beige-200  py-4  px-4 shadow-xl">
                    <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                        <RefreshIcon className="m-2 h-12 w-12 flex-shrink-0 animate-spin rounded-full bg-beige-100 py-2 text-gray-800 " />
                        <p className="mt-3 animate-pulse text-lg">Caricamento . . .</p>
                    </div>
                </div>
            ) : errorMessage ? (
                <div className="mx-auto h-min max-w-full rounded-lg bg-red-100 py-4 px-4 shadow-xl">
                    <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                        <ExclamationCircleIcon className="mt-3 h-12 w-12 flex-shrink-0  text-red-600" />
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
