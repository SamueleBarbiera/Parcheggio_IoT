import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import prisma from '../lib/prisma'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

function Parcheggi(parcheggi: any) {
    return (
        <>
            <Head>
                <title>Parcheggi</title>
                <link rel="icon" href="/question-solid.svg" />
                <meta charSet="utf-8" className="next-head" />
            </Head>

            <Header />
            <main className="flex h-screen items-center justify-center">
                {parcheggi.map((p: any) => (
                    <div key={p.parcheggi_id}>
                        <div>{p.stato}</div>
                    </div>
                ))}
            </main>
            <Footer />
        </>
    )
}

export default Parcheggi

export const getServerSideProps: GetServerSideProps = async () => {
    const parcheggi = prisma.parcheggi.findMany({})
    console.log('🚀 - file: Parcheggi.tsx - line 36 - GetServerSideProps', parcheggi)

    return {
        props: { parcheggi: parcheggi },
    }
}
