import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import axios from 'axios'
import Head from 'next/head'
import { AiTwotoneCar } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { fetcher } from 'content/lib/fetcher'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import useSWR from 'swr'
import { useShoppingCart } from 'use-shopping-cart'
import { DebugCart } from 'use-shopping-cart'
import { CartActions, CartEntry as ICartEntry } from 'use-shopping-cart/core'

import { formatCurrencyString, Product } from 'use-shopping-cart/core'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}


function Cart() {
    const cart = useShoppingCart()
    const { removeItem, cartDetails, clearCart, formattedTotalPrice } = cart

    const cartEntries = Object.values(cartDetails ?? {}).map((entry) => (
        <div>
            <h3>{entry.name}</h3>
            {entry.image ? <img width={100} src={entry.image} alt={entry.description} /> : null}
            <p>
                {entry.quantity} x {formatCurrencyString({ value: entry.price, currency: 'EUR' })} ={' '}
                {entry.formattedValue}
            </p>
            <button onClick={() => removeItem(entry.id)}>Remove</button>
        </div>
    ))

    return (
        <div>
            <h2>Cart</h2>
            <p>Total: {formattedTotalPrice}</p>
            {cartEntries.length === 0 ? <p>Cart is empty.</p> : null}
            {cartEntries.length > 0 ? (
                <>
                    <button onClick={() => clearCart()}>Clear cart</button>
                    {cartEntries}
                </>
            ) : null}
        </div>
    )
}

const products: Product[] = [
    {
        name: 'Sunglasses',
        id: 'price_1GwzfVCNNrtKkPVCh2MVxRkO',
        price: 15,
        image: 'https://files.stripe.com/links/fl_test_FR8EZTS7UDXE0uljMfT7hwmH',
        currency: 'EUR',
        description: 'A pair of average black sunglasses.',
    },
    {
        name: '3 Stripe Streak Scoop Neck Flowy T-Shirt',
        id: 'price_OkRxVM2hCVPkKtrNNCVfzwG1',
        price: 30,
        image: 'https://static.musictoday.com/store/bands/4806/product_600/5QCTBL052.jpg',
        description:
            'A black scoop neck flowy t-shirt with 3 bright yellow strips behind the words Black Lives Matter.',
        currency: 'EUR',
    },
]

function ProductList() {
    const { addItem } = useShoppingCart()

    return (
        <div>
            <h2>Products</h2>
            {products.map((product: Product) => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    {product.image ? <img width={300} src={product.image} alt={product.description} /> : null}
                    <p>{formatCurrencyString({ value: product.price, currency: 'EUR' })}</p>
                    <button onClick={() => addItem(product)} aria-label={`Add one ${product.name} to your cart.`}>
                        Add 1 to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

function Parcheggi() {
    const { clearCart, addItem, cartDetails, totalPrice, checkoutSingleItem } = useShoppingCart()
    const [piano, setPiano] = useState(false)
    function toFixedIfNecessary(value: any, dp: number | undefined) {
        return +parseFloat(value).toFixed(dp)
    }
    const cartdet: any = Object.entries(cartDetails).map((e) => e[1])
    const { data, error } = useSWR('/api/data/parcheggi', fetcher, {
        refreshInterval: 1000,
    })

    return (
        <>
            <Head>
                <title>Parcheggi</title>
                <link rel="icon" href="/question-solid.svg" />
                <meta charSet="utf-8" className="next-head" />
            </Head>

            <Header />
            <main className="grid h-full w-screen ">
                <Switch.Group as="div" className="m-4 flex flex-auto flex-row p-4">
                    <div className="flex flex-auto flex-col">
                        <Switch.Label as="p" className="text-md font-medium text-gray-900" passive>
                            Visualizzazione dei piani con i posti disponibili
                        </Switch.Label>
                        <Switch.Description className="text-sm text-gray-500">
                            Qui puoi visualizzare lo stato dei parcheggi
                        </Switch.Description>
                    </div>
                    <div className="m-2 flex flex-1 flex-row-reverse">
                        <Switch
                            checked={piano}
                            onChange={setPiano}
                            className={classNames(
                                piano ? 'bg-indigo-500' : 'bg-indigo-200',
                                'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    piano ? 'translate-x-5' : 'translate-x-0',
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </div>
                </Switch.Group>
                <div style={{ display: 'grid', placeItems: 'center' }}>
                    <h1>Grocery+ Store</h1>
                    <ProductList />
                    <br />
                    <hr
                        style={{
                            background: 'grey',
                            height: 1,
                            width: '100%',
                            maxWidth: '20rem',
                        }}
                    />
                    <Cart />
                </div>
                {data ? (
                    <>
                        {piano && (
                            <div className="my-4 mx-8 flex h-min flex-auto  flex-row rounded-lg bg-indigo-100 p-4  ">
                                <p className="text-2xl font-medium">Piano 1</p>
                            </div>
                        )}
                        <div className="space-4 m-12 mx-8 mt-0 grid grid-cols-3 items-center gap-0 rounded-lg bg-indigo-100 p-4 shadow-lg smd:grid-cols-4  md:grid-cols-6 xl:grid-cols-12 ">
                            {piano &&
                                data.parcheggi1.map((p: any) => (
                                    <div key={p.parcheggi_id}>
                                        <p className="relative left-4 top-9 text-indigo-50">{p.posto}</p>
                                        <AiTwotoneCar
                                            className={classNames(
                                                p.parcheggio_stato == false ? 'bg-red-900' : 'bg-green-900 ',
                                                'transiction dutation-200 m-2 h-24 w-24 rounded-md border p-6 shadow-xl ease-in-out hover:motion-safe:animate-pulse'
                                            )}
                                        />
                                    </div>
                                ))}
                        </div>
                        {!piano && (
                            <div className="m-4 mx-8 -my-20 flex h-min flex-auto flex-row  rounded-lg bg-indigo-100 p-4 ">
                                <p className="text-2xl font-medium">Piano 2</p>
                            </div>
                        )}
                        <div className="space-4 m-12 mx-8 mt-0 grid grid-cols-3 items-center gap-0 rounded-lg bg-indigo-100 p-4 shadow-lg smd:grid-cols-4  md:grid-cols-6 xl:grid-cols-12 ">
                            {!piano &&
                                data.parcheggi2.map((p: any) => (
                                    <div key={p.parcheggi_id}>
                                        <p className="relative left-4 top-9 text-indigo-50">{p.posto}</p>
                                        <AiTwotoneCar
                                            className={classNames(
                                                p.parcheggio_stato == false ? 'bg-red-900' : 'bg-green-900 ',
                                                'transiction dutation-200 m-2 h-24 w-24 rounded-md border p-6 shadow-xl ease-in-out hover:motion-safe:animate-pulse'
                                            )}
                                        />
                                    </div>
                                ))}
                        </div>
                    </>
                ) : error ? (
                    <div className="mx-auto w-fit rounded-lg bg-red-200 py-4 px-4 shadow-xl">
                        <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                            <ExclamationCircleIcon className="m-2 h-12 w-12 flex-shrink-0 rounded-full bg-red-100 py-2 text-red-600 " />
                            <p className="m-2 text-lg text-red-500">Qualcosa è andato storto</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </main>
            <Footer />
        </>
    )
}

export default Parcheggi

// export async function getServerSideProps() {
//     const prisma = new PrismaClient()

//     const findPagamento = await prisma.durata.findFirst({
//         where: { pagamento_effettuato: true },
//     })
//     if (findPagamento) {
//         return {
//             redirect: {
//                 destination: '/cart/Checkout',
//             },
//         }
//     }
// }
