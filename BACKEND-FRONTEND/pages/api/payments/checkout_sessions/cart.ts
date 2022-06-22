import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const amount: number = Number((req.body.amount.totalPrice * 100).toString().slice(0, 6))

    if (req.method === 'POST') {
        try {
            // Create Checkout Sessions from body params.
            let session: Stripe.Checkout.SessionCreateParams = {
                submit_type: 'pay',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_address_collection: {
                    allowed_countries: ['IT'],
                },
                line_items: [
                    {
                        amount: amount,
                        currency: 'EUR',
                        name: 'Costo totale',
                        quantity: 1,
                    },
                ],
                discounts: [
                    {
                        coupon: 'DTXLlBYe',
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin}/cart/RisultatoPagamento?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cart/CancelPagamento`,
            }
            const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(session)
            res.status(200).json(checkoutSession)
        } catch (err) {
            console.log('❌ Payment failed: ', err.message)
            res.status(500).json({ statusCode: 500, message: err.message })
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}
