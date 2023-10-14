import {NextApiRequest, NextApiResponse} from "next"
import {createUser, pgconnect} from "../../utils/database"
import logger from "../../utils/logger";
import {NewUserInfo} from "../../utils/dbtypes"
import {supabase} from "../../utils/supabaseClient"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query, method} = req;
    if (method === "POST") {
        // supabase
        const client = await pgconnect();
        if (client.isErr) {
            logger.error("Couldn't connect to Postgres");
            res.status(500);
            return;
        }
        if (query.userId === undefined) {
            logger.error("No userId provided");
            res.status(400).json({error: "No userId provided"});
            return;
        }
        if (Array.isArray(query.userId)) {
            logger.error("Multiple userIds provided");
            res.status(400).json({error: "Multiple userIds provided"});
            return;
        }
        const newUser: NewUserInfo = {user_id: query.userId, pg_name: pgName};
        await createUser(client, newUser);
        res.status(200).json(userInfo);
        await client.value.end();
    }
}