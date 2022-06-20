import React, { useEffect } from 'react'
import Post, { PostProps } from '../components/Post'
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useShoppingCart } from 'use-shopping-cart'
import { Router, useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client'
import { InferGetServerSidePropsType } from 'next'

const Home = () => {
    const { clearCart } = useShoppingCart()
    useEffect(() => {
        clearCart()
    }, [])

    return (
        <>
            <Head>
                <title>Home</title>
                <link rel="icon" href="/question-solid.svg" />
                <meta charSet="utf-8" className="next-head" />
            </Head>

            <Header />
            <main className="flex h-screen items-center justify-center"></main>
            <Footer />
        </>
    )
}

export default Home


