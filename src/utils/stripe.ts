import Stripe from 'stripe'
console.log(`Stripe secret key: ${process.env.STRIPE_SECRET_KEY}`)
const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || "",
    {
        apiVersion: "2022-11-15",
        typescript: true,
    }
)

export default stripe
