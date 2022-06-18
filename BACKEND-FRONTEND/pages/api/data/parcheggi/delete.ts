import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await prisma.parcheggi.deleteMany({})
        
        res.json({result})
    } catch (err) {
        res.status(500).send({ message: err })
    }
}
