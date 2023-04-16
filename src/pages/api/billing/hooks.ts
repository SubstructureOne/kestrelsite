/// <reference types="stripe-event-types" />

import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"
import Stripe from "stripe"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const payload = req.body
    const sig_header = req.headers["STRIPE_SIGNATURE"]
    if (sig_header === undefined) {
        res.status(401).json({error: "Missing STRIPE_SIGNATURE header"})
        return
    } else if (Array.isArray(sig_header)) {
        res.status(401).json({error: "Multiple STRIPE_SIGNATURE headers specified"})
        return
    }
    if (process.env.STRIPE_WEBHOOK_SECRET === undefined) {
        res.status(500).json({error: "STRIPE_WEBHOOK_SECRET not specified"})
        return
    }
    const event = stripe.webhooks.constructEvent(
        payload, sig_header, process.env.STRIPE_WEBHOOK_SECRET
    ) as Stripe.DiscriminatedEvent

    if (event.type == "invoice.payment_succeeded") {
        const invoice = event.data
        console.log(`Found an invoice; amount paid is ${invoice.object.amount_paid}`)
    }
}
