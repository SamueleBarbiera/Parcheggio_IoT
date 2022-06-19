import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Queue } from 'bullmq'
import { Prisma } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const piano1_TOT = await prisma.parcheggi.count({ where: { parcheggio_stato: false, piano: 1 } })
            const piano2_TOT = await prisma.parcheggi.count({ where: { parcheggio_stato: false, piano: 2 } })

            res.status(200).json({ piano1_TOT, piano2_TOT })
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo GET REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
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
