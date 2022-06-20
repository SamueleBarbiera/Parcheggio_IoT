import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'

const schema = yup.object().shape({
    tempoGet: yup.number().required(),
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
        piano: number
        posto: number
        tempoGet: number
    }
}

const handle = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { tempoGet, piano, posto } = req.body
    try {
        if (req.method === 'POST') {
            const parking = await prisma.parcheggi.findFirst({
                where: { parcheggio_stato: true, piano: piano, posto: posto },
            })
            const calcolo = tempoGet * 5
            const Data = await prisma.durata.create({
                data: {
                    costo_finale: calcolo,
                    pagamento_effettuato: false,
                    tempo: tempoGet,
                    parcheggi_id_fk: parking?.parcheggi_id.toString()!,
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

export default validate(handle)
