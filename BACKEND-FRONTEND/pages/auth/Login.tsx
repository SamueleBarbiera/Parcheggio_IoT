import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import LoginForm from '../../components/auth/LoginForm'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'
import { useShoppingCart } from 'use-shopping-cart'
import { useEffect } from 'react'

export default function Login({ providers }: any) {
    const { clearCart } = useShoppingCart()

    useEffect(() => {
        clearCart()
    }, [])
    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/icon-512x512.png" />
            </Head>
            <Header />
            <LoginForm providers={providers} />
            <Footer />
        </>
    )
}

export const getServerSideProps = async ({ req }: any) => {
    const session = await getSession({ req })
    const prisma = new PrismaClient()

    if (session) {
        try {
            const emptyRfid = await prisma.rfids.findFirst({
                where: { user_id_fk: null },
            })
            const userId = await prisma.user.findFirst({
                where: { email: session!.user!.email },
                select: {
                    id: true,
                },
            })

            const data = await prisma.rfids.update({
                where: { rfid_id: emptyRfid!.rfid_id },
                data: { user_id_fk: userId?.id, stato: true },
            })
        } catch (err) {
            console.log('🚀 - file: Login.tsx - line 31 - err', err)
        }
    }

    return {
        props: {
            providers: await getProviders(),
        },
    }
}
