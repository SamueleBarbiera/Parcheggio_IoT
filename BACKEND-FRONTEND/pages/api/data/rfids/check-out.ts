import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { withValidation } from 'next-validations'
import * as yup from 'yup'
import Router, { useRouter } from 'next/router'
import { useShoppingCart } from 'use-shopping-cart'
    

const schema = yup.object().shape({
    rfid_codice: yup.string().required(),
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
            Router.push('/Checkout')
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
