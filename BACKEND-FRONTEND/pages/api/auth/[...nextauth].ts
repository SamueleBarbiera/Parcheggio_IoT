import NextAuth, { NextAuthOptions } from 'next-auth'
import prisma from '../../../lib/prisma'
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextApiRequest, NextApiResponse } from 'next'

const GOOGLE_AUTHORIZATION_URL =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
    })

const refreshAccessToken = async (payload: any, clientId: string, clientSecret: string) => {
    try {
        const url = new URL('https://accounts.google.com/o/oauth2/token')
        url.searchParams.set('client_id', clientId)
        url.searchParams.set('client_secret', clientSecret)
        url.searchParams.set('grant_type', 'refresh_token')
        url.searchParams.set('refresh_token', payload.refreshToken)

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
        })

        const refreshToken = await response.json()

        if (!response.ok) {
            throw refreshToken
        }

        // Give a 10 sec buffer
        const now = new Date()
        const accessTokenExpires = now.setSeconds(now.getSeconds() + parseInt(refreshToken.expires_in) - 10)
        return {
            ...payload,
            accessToken: refreshToken.access_token,
            accessTokenExpires,
            refreshToken: payload.refreshToken,
        }
    } catch (error) {
        console.error('ERR', error)

        return {
            ...payload,
            error: 'RefreshAccessTokenError',
        }
    }
}

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorizationUrl: GOOGLE_AUTHORIZATION_URL,
        }),
    ],
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async session(session, user) {
            session.jwt = user.jwt
            session.id = user.id
            return session
        },
        async jwt(token, user, account) {
            const isSignIn = user ? true : false
            if (isSignIn) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${account!.provider}/callback?access_token=${account!?.access_token}`)
                const data = await response.json()
                ;(token.accessToken = account!.accessToken), (token.accessTokenExpires = account!.expires_in!), (token.refreshToken = account!.refresh_token), (token.jwt = data.jwt)
                token.id = data.user.id
                console.log(data, token)
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token as any).accessTokenExpires) {
                return token
            }

            // Access token has expired, try to update it
            return await refreshAccessToken(token, String(process.env.GOOGLE_CLIENT_ID), String(process.env.GOOGLE_CLIENT_SECRET))
        },
    },
    pages: {
        signIn: '/auth/Login',
        error: '/auth/Login',
    },
    debug: true,
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
