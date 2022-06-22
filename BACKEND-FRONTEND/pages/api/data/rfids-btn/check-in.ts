import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'

const schema = yup.object().shape({
    rfid_codice: yup.string(),
})

const validate = withValidation({
    schema,
    type: 'Yup',
    mode: 'body',
})

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { rfid_codice } = req.body

    try {
        if (req.method === 'POST') {
            if (rfid_codice !== '') {
                const checkRfidUserStatus = await prisma.rfids.findFirst({
                    where: {
                        codice: { equals: rfid_codice },
                        NOT: [
                            {
                                user_id_fk: null,
                            },
                        ],
                    },
                })
                res.status(200).json({ 'Rfid trovati': checkRfidUserStatus })
            } else {
                res.status(204).json('Check-in effettuato senza rfid')
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
