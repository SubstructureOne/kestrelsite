import Stripe from 'stripe'
import {getEnv} from "./secrets"
import {KResult, Ok, Err} from "./errors"

async function getStripe(): Promise<KResult<Stripe>> {
    const secretKey = await getEnv("STRIPE_SECRET_KEY")
    if (secretKey.isErr) {
        return Err({friendly: "Couldn't initialize stripe"})
    }
    return Ok(new Stripe(
        secretKey.value,
        {
            apiVersion: "2022-11-15",
            typescript: true,
        }
    ))
}

export default getStripe
