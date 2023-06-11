/// <reference types="stripe-event-types" />

import AWS from "aws-sdk"
import {Queue} from "sst/node/queue"
import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"
import Stripe from "stripe"
import getRawBody from "raw-body"
import {createExternalTransaction, pgconnect} from "../../../utils/database"
import logger from "../../../utils/logger"
import {NewExternalTransactionInfo} from "../../../utils/dbtypes";

const sqs = new AWS.SQS()

export const config = {
    api: {
        bodyParser: false,
    },
}


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const requestBuffer = await getRawBody(req, {limit: '1mb'});
    const sig_header = req.headers["stripe-signature"]
    if (sig_header === undefined) {
        const error = "Missing stripe-signature header"
        logger.error(error)
        res.status(401).json({error})
        return
    } else if (Array.isArray(sig_header)) {
        const error = "Multiple stripe-signature headers specified"
        logger.error(error)
        res.status(401).json({error})
        return
    }
    if (process.env.STRIPE_WEBHOOK_SECRET === undefined) {
        logger.error("STRIPE_WEBHOOK_SECRET not specified")
        res.status(500).json({error: "Internal server error"})
        return
    }
    const event = stripe.webhooks.constructEvent(
        requestBuffer, sig_header, process.env.STRIPE_WEBHOOK_SECRET
    ) as Stripe.DiscriminatedEvent
    logger.debug(`Retrieved request of type: ${event.type}`)

    if (event.type == "checkout.session.completed" || event.type == "checkout.session.async_payment_succeeded") {
        const checkoutSession = event.data.object
        const amount_cents = checkoutSession.amount_subtotal
        const userId = checkoutSession.client_reference_id
        if (userId === null) {
            const error = "Cannot process external transaction because userId is missing from metadata"
            logger.error(error)
            res.status(400).json({error})
            return
        }
        if (amount_cents == null) {
            const error = "Cannot process external transaction: subtotal not specified"
            logger.error(error)
            res.status(400).json({error})
            return
        }
        if (checkoutSession.payment_status == "paid") {
            const newTxn: NewExternalTransactionInfo = {
                user_id: userId,
                amount: amount_cents / 100,
                exttxn_extid: checkoutSession.id,
                exttxn_time: new Date(1000 * checkoutSession.created)
            }
            logger.info(`Sending message with new txn info: ${newTxn}`)
            await sqs.sendMessage({
                QueueUrl: Queue.billingQueue.queueUrl,
                MessageBody: JSON.stringify(newTxn)
            }).promise()
        } else {
            logger.info(`Checkout session ${checkoutSession.id} completed but payment not completed; awaiting`)
        }
    } else if (event.type == "checkout.session.async_payment_failed") {
        const checkoutSession = event.data.object
        logger.warn(`Payment failed for checkout session ${checkoutSession.id} (${checkoutSession.amount_subtotal} from ${checkoutSession.client_reference_id}`)
    }
    res.status(200).json({message: "Success"})
}
