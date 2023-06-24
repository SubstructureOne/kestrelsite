import Stripe from 'stripe'
import {getEnv} from "./secrets"
import {Result} from "true-myth"
import {KResult} from "./errors"

async function getStripe(): Promise<KResult<Stripe>> {
    const secretKey = await getEnv("STRIPE_SECRET_KEY")
    if (secretKey.isErr) {
        return Result.err({friendly: "Couldn't initialize stripe"})
    }
    return Result.ok(new Stripe(
        secretKey.value,
        {
            apiVersion: "2022-11-15",
            typescript: true,
        }
    ))
}

export default getStripe
