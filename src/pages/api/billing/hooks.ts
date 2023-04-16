/// <reference types="stripe-event-types" />

import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"
import Stripe from "stripe"
import getRawBody from "raw-body"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const requestBuffer = await getRawBody(req, {limit: '1mb'});
    const sig_header = req.headers["stripe-signature"]
    if (sig_header === undefined) {
        res.status(401).json({error: "Missing stripe-signature header"})
        return
    } else if (Array.isArray(sig_header)) {
        res.status(401).json({error: "Multiple stripe-signature headers specified"})
        return
    }
    if (process.env.STRIPE_WEBHOOK_SECRET === undefined) {
        res.status(500).json({error: "STRIPE_WEBHOOK_SECRET not specified"})
        return
    }
    const event = stripe.webhooks.constructEvent(
        requestBuffer, sig_header, process.env.STRIPE_WEBHOOK_SECRET
    ) as Stripe.DiscriminatedEvent

    if (event.type == "invoice.payment_succeeded") {
        const invoice = event.data
        console.log(`Found an invoice; amount paid is ${invoice.object.amount_paid}`)
    }
    res.status(200).json({message: "Success"})
}
