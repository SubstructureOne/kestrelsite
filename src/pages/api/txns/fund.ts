import {NextApiRequest, NextApiResponse} from "next"
import stripe from "../../../utils/stripe"
import {userFromAuthHeader} from "../../../utils/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const user = await userFromAuthHeader(req)
    if (user === null) {
        res.status(400).json({error: "Not logged in"})
        return
    }
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
            client_reference_id: user.id,
            customer_email: user.email,
        },
    )
    if (session.url === null) {
        res.status(500).json({error: "Session URL is null"})
    } else {
        res.status(200).json({redirect: session.url})
    }
}
