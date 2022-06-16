import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Head from 'next/head'

function Parcheggi() {
  return (
    <>
            <Head>
                <title>Parcheggi</title>
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

export default Parcheggi