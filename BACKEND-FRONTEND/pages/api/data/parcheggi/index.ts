import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    try {
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
        res.json({ parcheggi1, parcheggi2 })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}
