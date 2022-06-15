import React from 'react'
import { GetServerSideProps } from 'next'
import Post, { PostProps } from '../components/Post'
import { useSession, getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req })
    if (!session) {
        res.statusCode = 403
        return { props: { drafts: [] } }
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: session!.user!.email },
            published: false,
        },
        include: {
            author: {
                select: { name: true },
            },
        },
    })
    return {
        props: { drafts },
    }
}

type Props = {
    drafts: PostProps[]
}

const Drafts: React.FC<Props> = (props) => {
    const { data: session } = useSession()

    if (!session) {
        return (
            <>
                <h1>My Drafts</h1>
                <div>You need to be authenticated to view this page.</div>
            </>
        )
    }

    return (
        <div className="page">
            <h1>My Drafts</h1>
            <main>
                {props.drafts.map((post) => (
                    <div key={post.id} className="post">
                        <Post post={post} />
                    </div>
                ))}
            </main>
        </div>
    )
}

export default Drafts
