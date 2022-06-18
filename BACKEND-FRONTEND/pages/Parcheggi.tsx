import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import prisma from '../lib/prisma'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AiTwotoneCar } from 'react-icons/ai'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { fetcher } from 'content/lib/fetcher'
import useSWR from 'swr'
import { ExclamationCircleIcon, RefreshIcon } from '@heroicons/react/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

function Parcheggi() {
    const [piano, setPiano] = useState(false)

    const { data, error } = useSWR('/api/data/parcheggi', fetcher, {
        refreshInterval: 1000,
    })
    console.log('🚀 - file: Parcheggi.tsx - line 24 - Parcheggi - data', data)

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
                    <div className="flex flex-1 flex-row-reverse m-2">
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
