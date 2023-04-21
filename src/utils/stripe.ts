import Stripe from 'stripe'
const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || "",
    {
        apiVersion: "2022-11-15",
        typescript: true,
    }
)

export const fundAccountUrl = "https://buy.stripe.com/test_8wMcPQclRdsd8xOdQQ"

export default stripe
