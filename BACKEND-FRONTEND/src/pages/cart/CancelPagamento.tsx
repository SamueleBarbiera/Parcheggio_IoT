import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { CheckIcon } from '@heroicons/react/solid'
import AccessDenied from '../AccessDenied'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, PreviewData } from 'next'
import React from 'react'
import { unstable_getServerSession } from 'next-auth/next'
import { ParsedUrlQuery } from 'querystring'
import { authOptions } from '../api/auth/[...nextauth]'

export default function CancelPagamento() {
    return (
        <>
            <Head>
                <title>Pagamento Annullato</title>
                <link rel="icon" href="/icon-512x512.png" />
                <meta charSet="utf-8" className="next-head" />
            </Head>
            <Header />
            <main className="h-screen">
                <div className="mx-auto w-fit rounded-lg bg-green-200 py-4 px-4 shadow-xl">
                    <h2 className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                        <CheckIcon className="m-2 h-12 w-12 flex-shrink-0 rounded-full bg-green-100 py-2 text-green-600 " />
                        <span>Ordine annulato!</span>
                    </h2>
                </div>
            </main>
            <Footer />
        </>
    )
}

export const getServerSideProps = async (ctx: any) => {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

    if (!session!.user && session!.user == {} && (session as any).user.email === '') {
        return {
            redirect: { destination: '/AccessDenied' },
        }
    }

    return {
        props: { products: null },
    }
}
