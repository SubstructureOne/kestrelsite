import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const session = await stripe.checkout.sessions.create(
        {
            line_items: [
                {
                    price: 'price_1MaOSHI00QV1hOn8LBQjd5sG',
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/profile',
            cancel_url: 'http://localhost:3000/profile',
            automatic_tax: {enabled: true},
        },
    )
    if (session.url === null) {
        res.status(500).json({error: "Session URL is null"})
    } else {
        res.redirect(303, session.url)
    }
}