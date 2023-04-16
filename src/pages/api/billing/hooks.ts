/// <reference types="stripe-event-types" />

import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"
import Stripe from "stripe"
import getRawBody from "raw-body"
import {createExternalTransaction, pgconnect} from "../../../utils/database"
import logger from "../../../utils/logger"

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
        const amount = invoice.object.amount_paid
        const client = await pgconnect()
        const userId = "userId" in invoice.object.metadata ? invoice.object.metadata["userId"] : null
        if (userId === null) {
            const error = "Cannot process external transaction because userId is missing from metadata"
            logger.error(error)
            res.status(400).json({error})
            return
        }
        const newBalance = await createExternalTransaction(client, userId, amount)
        logger.info(`Successful payment of ${amount} from user ${userId}; new balance is ${newBalance}`)
        res.status(200).json({message: "Success"})
        return
    }
    res.status(200).json({message: "Success"})
}
