import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const sig = <string>req.headers['stripe-signature']
    let event
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, <string>process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        res.status(400).json({error: `Webhook error: ${err}`})
        return
    }
    switch (event.type) {
        case 'payment_intent.succeeded':
            console.log("Payment succeeded")
            break
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }
    res.status(200)
}
