import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await prisma.rfids.findMany({
            include: { user: true },
        })
        res.json(result)
    } catch (err) {
        res.status(500).send({ message: err })
    }
}
