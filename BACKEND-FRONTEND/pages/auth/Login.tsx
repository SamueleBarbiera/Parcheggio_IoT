import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import LoginForm from '../../components/auth/LoginForm'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PrismaClient } from '@prisma/client'

export default function Login({
        providers,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/question-solid.svg" />
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
            console.log(`Start seeding ...`)
            const emptyRfid = await prisma.rfids.findFirst({
                where: { user_id_fk: null },
            })
            console.log('🚀 - file: LoginForm.tsx - emptyRfid', emptyRfid)
            const userId = await prisma.user.findFirst({
                where: { email: session!.user!.email },
                select: {
                    id: true,
                },
            })
            console.log('🚀 - file: LoginForm.tsx - line 66 - userId', userId)

            const data = await prisma.rfids.update({
                where: { rfid_id: emptyRfid!.rfid_id },
                data: { user_id_fk: userId?.id, stato: true },
            })
            console.log('🚀 - line 30 - data', data)
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
