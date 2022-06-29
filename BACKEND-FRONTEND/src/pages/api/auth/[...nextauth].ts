/* eslint-disable indent */
/* eslint-disable import/no-anonymous-default-export */
import NextAuth, { NextAuthOptions } from 'next-auth'
import { AppProviders } from 'next-auth/providers'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'

const GOOGLE_AUTHORIZATION_URL =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
    })

const refreshAccessToken: any = async (payload: any, clientId: string, clientSecret: string) => {
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

let ErrorGoogleEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.log('⚠️ Google auth credentials were not added ⚠️')
    ErrorGoogleEnv = true
}

const providers: AppProviders = []
if (ErrorGoogleEnv) {
    providers.push(
        CredentialsProvider({
            id: 'google',
            name: 'Mocked Google',
            async authorize(credentials: any) {
                const user = {
                    id: credentials?.name,
                    name: credentials?.name,
                    email: credentials?.name,
                }
                return user
            },
            credentials: {
                name: { type: 'test' },
            },
        })
    )
} else {
    providers.push(
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            accessTokenUrl: GOOGLE_AUTHORIZATION_URL,
            profile(profile: any) {
                return {
                    id: profile.id,
                    name: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                } as any
            },
        })
    )
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as any),
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: '/auth/Login',
    },
    debug: true,
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions)
