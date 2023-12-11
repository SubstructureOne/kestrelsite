import {NextApiRequest, NextApiResponse} from "next";
import getStripe from "../../../utils/stripe";
import {userFromAuthHeader} from "../../../utils/auth";
import logger from "../../../utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const user = await userFromAuthHeader(req);
    if (user === null) {
        res.status(400).json({error: "Not logged in"});
        return;
    }
    const stripe = await getStripe();
    if (stripe.isErr) {
        logger.error("Couldn't initialize stripe");
        res.status(500).json({error: "Couldn't initialize stripe"});
        return;
    }
    const session = await stripe.value.checkout.sessions.create(
        {
            line_items: [
                {
                    price: process.env.STRIPE_FUND_ACCOUNT_PRICE_ID,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: process.env.STRIPE_FUND_ACCOUNT_SUCCESS_URL || "",
            cancel_url: process.env.STRIPE_FUND_ACCOUNT_CANCEL_URL,
            automatic_tax: {enabled: true},
            client_reference_id: user.id,
            customer_email: user.email,
        },
    );
    if (session.url === null) {
        res.status(500).json({error: "Session URL is null"});
    } else {
        res.status(200).json({redirect: session.url});
    }
}
