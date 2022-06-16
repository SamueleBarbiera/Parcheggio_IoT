import React from 'react'
import type { GetServerSideProps } from 'next'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'
import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

type Props = {
    feed: PostProps[]
}

const Blog: React.FC<Props> = () => {
    return (
        <>
            <Head>
                <title>Home</title>
                <link rel="icon" href="/question-solid.svg" />
                <meta charSet="utf-8" className="next-head" />
            </Head>

            <Header />
            <main className="flex h-screen items-center justify-center">
                {/* {props.feed.map((post) => (
                    <div key={post.id} className="post">
                        <Post post={post} />
                    </div>
                ))} */}
            </main>
            <Footer />
        </>
    )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     const feed = await prisma.utente.findMany({
//         where: {
//             published: true,
//         },
//         include: {
//             author: {
//                 select: {
//                     name: true,
//                 },
//             },
//         },
//     })
//     return {
//         props: { feed },
//     }
// }

export default Blog
