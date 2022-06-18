import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import SWR, { mutate } from 'swr'

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const parcheggi1 = await prisma.parcheggi.updateMany({
            where: { piano: 1, parcheggio_stato: true },
            data: { parcheggio_stato: false },
        })
        const parcheggi2 = await prisma.parcheggi.updateMany({
            where: { piano: 2, parcheggio_stato: false },
            data: { parcheggio_stato: true },
        })
        res.json({ piano1: parcheggi1, piano2: parcheggi2 })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}
