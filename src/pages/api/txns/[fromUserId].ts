import {NextApiRequest, NextApiResponse} from "next"
import {userFromAuthHeader} from "../../../utils/auth"
import {getExternalTransactions, getTransactions, pgconnect} from "../../../utils/database"
import logger from "../../../utils/logger"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const {query, method} = req
    console.log("Received request /txns/[fromUserId]")
    const fromUserId = <string>query.fromUserId
    const user = await userFromAuthHeader(req)
    if (user?.id !== fromUserId) {
        res
            .status(403)
            .json({error: "Permission denied"})
        return
    }
    if (method == 'GET') {
        const client = await pgconnect()
        if (client.isErr) {
            logger.error("Couldn't connect to Postgres")
            res.status(500)
            return
        }
        const txns = await getTransactions(client.value, fromUserId)
        const exttxns = await getExternalTransactions(client.value, fromUserId)
        await client.value.end()
        res.status(200).json({
            external_txns: exttxns,
            internal_txns: txns,
        })
    } else {
        res
            .status(405)
            .json({error: `Method not allowed: ${method}`})
    }
}