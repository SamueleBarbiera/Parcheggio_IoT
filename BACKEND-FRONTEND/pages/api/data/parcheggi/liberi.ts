import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Queue } from 'bullmq'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const piano1 = await prisma.parcheggi.count({ where: { parcheggio_stato: false, piano: 1 } })
        const piano2 = await prisma.parcheggi.count({ where: { parcheggio_stato: false, piano: 2 } })
        res.json({ piano1, piano2 })
        
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

//const arrRes: any = []
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