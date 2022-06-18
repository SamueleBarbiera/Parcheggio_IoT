import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Queue } from 'bullmq'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        //const arrRes: any = []
        const result = await prisma.parcheggi.findMany({ where: { stato: false }, include: { Durata: true } })
        // const myQueue = new Queue('myqueue', {
        //     connection: {
        //         host: 'containers-us-west-54.railway.app',
        //         port: 7014,
        //         password: 'iIErHDldOVe4EgvqpC3y',
        //         username: 'default',
        //     },
        // })
        // for (var x = 0; x < 50; x++) {
        //     arrRes[x] = { name: x, data: result[x] }
        // }
        // const jobs = await myQueue.addBulk(arrRes)
        //console.log('🚀 - file: disp.ts - line 17 - handler - jobs', jobs)
        //console.log('🚀 - file: disp.ts - line 11 - handler - myQueue', myQueue)
        res.json(result)
    } catch (err) {
        res.status(500).send({ message: err })
    }
}
