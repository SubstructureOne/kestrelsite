import {NextApiRequest, NextApiResponse} from "next";
import {userFromAuthHeader} from "../../../utils/auth";
import {getChargesByDay, pgconnect} from "../../../utils/database";
import {createClient} from "../../../utils/supabase/server";
import logger from "../../../utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query, method} = req;
    const userId = <string>query.user_id;
    const startTime = <string|undefined>query.start_time;
    const endTime = <string|undefined>query.end_time;
    const user = await userFromAuthHeader(req);
    if (user?.id !== userId) {
        res
            .status(403)
            .json({
                error: `Requested user (${userId}) does not match logged in user (${user?.id}`
            });
        return
    }
    if (method == 'GET') {
        const client = await pgconnect();
        if (client.isErr) {
            logger.error("Couldn't connect to Postgres");
            res.status(500);
            return;
        }
        const charges = await getChargesByDay(client.value, userId, startTime ?? null, endTime ?? null);
        await client.value.end();
        res.status(200).json(charges);
    } else {
        res
            .status(405)
            .json({error: `Method not allowed: ${method}`});
    }
}
