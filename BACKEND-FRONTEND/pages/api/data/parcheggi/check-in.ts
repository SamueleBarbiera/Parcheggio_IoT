import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'

const schema = yup.object().shape({
    rfid_stato: yup.boolean().required(),
    minuti_sosta: yup.number().required(),
})

const validate = withValidation({
    schema,
    type: 'Yup',
    mode: 'body',
})

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        rfid_stato: boolean
        minuti_sosta: number
    }
}

// una volta confermata l'associazione con rfid
// ti invio una post con campo rfid settato e la durata in minuti di occupazione
// del posto parcheggio generata Random

const handle = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { rfid_stato, minuti_sosta } = req.body

    try {
        if (req.method === 'POST') {
            const findParcheggio: any = await prisma.parcheggi.findFirst({
                where: {
                    parcheggio_stato: false,
                },
            })
            const Occupazioneparcheggi: any = await prisma.parcheggi.update({
                where: {
                    parcheggi_id: findParcheggio.parcheggi_id,
                },
                data: { parcheggio_stato: true, rfid_stato: rfid_stato },
            })

            const AggiornamentoDurata = await prisma.durata.create({
                data: {
                    tempo_calcolato: minuti_sosta,
                    parcheggi_id_fk: Occupazioneparcheggi.parcheggi_id,
                },
            })
            res.status(200).json({ Occupazioneparcheggi, AggiornamentoDurata })
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo PATCH REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export default validate(handle)
