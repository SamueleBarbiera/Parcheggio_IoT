import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'

const schema = yup.object().shape({
    tempoGet: yup.number().required(),
    minuti_sosta: yup.number().required(),
})

const validate = withValidation({
    schema,
    type: 'Yup',
    mode: 'body',
})

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        n_parcheggio: number
        tempoGet: number
    }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { tempoGet, n_parcheggio } = req.body
    try {
        if (req.method === 'POST') {
            const emptyDurata = await prisma.durata.findFirst({
                where: { parcheggi_id_fk: '' },
            })
            const parking = await prisma.parcheggi.findFirst({
                take: -1,
                where: { parcheggio_stato: true },
            })
            const Data = await prisma.durata.create({
                where: { rfid_id: emptyDurata!.durata_id },
                data: {
                    tempo_calcolato: tempoGet,
                    parcheggi_id_fk: parking?.parcheggi_id,
                    
                },
            })
            res.status(200).json({ Data })
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo POST REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
