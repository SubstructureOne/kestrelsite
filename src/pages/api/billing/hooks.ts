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

    if (event.type == "checkout.session.completed" || event.type == "checkout.session.async_payment_succeeded") {
        const checkoutSession = event.data.object
        const amount = checkoutSession.amount_subtotal
        const client = await pgconnect()

        const userId = checkoutSession.client_reference_id
        if (userId === null) {
            const error = "Cannot process external transaction because userId is missing from metadata"
            logger.error(error)
            res.status(400).json({error})
            return
        }
        if (amount == null) {
            const error = "Cannot process external transaction: subtotal not specified"
            logger.error(error)
            res.status(400).json({error})
            return
        }
        if (checkoutSession.payment_status == "paid") {
            const newBalance = await createExternalTransaction(client, userId, amount)
            logger.info(`Successful payment of ${amount} from user ${userId}; new balance is ${newBalance}`)
        } else {
            logger.info(`Checkout session ${checkoutSession.id} completed but payment not completed; awaiting`)
        }
    } else if (event.type == "checkout.session.async_payment_failed") {
        const checkoutSession = event.data.object
        logger.warn(`Payment failed for checkout session ${checkoutSession.id} (${checkoutSession.amount_subtotal} from ${checkoutSession.client_reference_id}`)
    }
    res.status(200).json({message: "Success"})
}
