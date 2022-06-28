/* eslint-disable react-hooks/exhaustive-deps */
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import LoginForm from '../../components/auth/LoginForm'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/client'
import PrismaClient from '@prisma/client'
import prisma from '../../lib/prisma'
import { useShoppingCart } from 'use-shopping-cart'
import React, { useEffect } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const Login: React.FC<any> = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

export default Login
export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
    const session = await getSession({ req })

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

            await prisma.rfids.update({
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
