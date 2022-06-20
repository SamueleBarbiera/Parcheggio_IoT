import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'

const schema = yup.object().shape({
    rfid_codice: yup.string(),
    piano: yup.number().required(),
    posto: yup.number().required(),
})

const validate = withValidation({
    schema,
    type: 'Yup',
    mode: 'body',
})

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        rfid_codice: string
        piano: number
        posto: number
    }
}

const handle = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { rfid_codice, piano, posto } = req.body

    try {
        if (req.method === 'POST') {
            if (rfid_codice !== '') {
                const findParcheggio = await prisma.parcheggi.findFirst({
                    where: {
                        piano: piano,
                        posto: posto,
                        parcheggio_stato: true,
                    },
                })
                const trovaPagamento = await prisma.durata.findFirst({
                    where: {
                        parcheggi_id_fk: findParcheggio?.parcheggi_id,
                    },
                })
                const avviPagamento = await prisma.durata.update({
                    where: {
                        durata_id: trovaPagamento?.durata_id,
                        
                    },
                    data: { pagamento_effettuato: true },
                })
                res.status(200).json({ 'Pagamento online avviato': avviPagamento })
            } else {
                res.status(200).json('Check-out effettuato senza rfid')
            }
        } else {
            res.status(400).json({
                ERRORE: 'si accettano solo POST REQ',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export default validate(handle)
