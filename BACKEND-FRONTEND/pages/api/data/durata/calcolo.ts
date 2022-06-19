import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const parcheggi1 = await prisma.parcheggi.findMany({
                where: { piano: 1 },
                select: { piano: true, posto: true, parcheggio_stato: true },
                orderBy: {
                    posto: 'asc',
                },
            })
            const parcheggi2 = await prisma.parcheggi.findMany({
                where: { piano: 2 },
                select: { piano: true, posto: true, parcheggio_stato: true },
                orderBy: {
                    posto: 'asc',
                },
            })
            res.status(200).json({ parcheggi1, parcheggi2 })
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo POST REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
