import {NextApiRequest, NextApiResponse} from "next"
import {userFromAuthHeader} from "../../../utils/auth"
import {getTransactions, pgconnect} from "../../../utils/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const {query, method} = req
    const fromUserId = <string>query.fromUserId
    const user = await userFromAuthHeader(req)
    if (user?.id !== fromUserId) {
        res
            .status(403)
            .json({error: "Permission denied"})
    }
    if (method == 'GET') {
        const client = await pgconnect()
        const txns = await getTransactions(client, fromUserId)
        res.status(200).json(txns)
    } else {
        res
            .status(405)
            .json({error: `Method not allowed: ${method}`})
    }
}