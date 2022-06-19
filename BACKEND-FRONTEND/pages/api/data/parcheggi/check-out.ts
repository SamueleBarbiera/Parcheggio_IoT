import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'GET') {
            const trovaUltimoRecord = await prisma.parcheggi.findFirst({
                take: -1,
            })
            const Occupazioneparcheggi = await prisma.parcheggi.update({
                where: { parcheggi_id: trovaUltimoRecord?.parcheggi_id },
                data: { parcheggio_stato: false, rfid_stato: false },
            })

            res.status(200).json({ Occupazioneparcheggi })
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo PATCH REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export default handle
