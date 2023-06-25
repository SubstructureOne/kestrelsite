import {NextApiRequest, NextApiResponse} from "next"
import {pgconnect, getuser} from "../../../utils/database"
import {userFromAuthHeader} from "../../../utils/auth"
import logger from "../../../utils/logger"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query, method} = req
    const id = <string>query.id
    const user = await userFromAuthHeader(req)
    if (user === null || user.id !== id) {
        res.status(403).json({error: `User ID is ${user?.id}, but requested ${id}`})
        return
    }
    if (method == 'GET') {
        const client = await pgconnect()
        if (client.isErr) {
            logger.error("Couldn't connect to Postgres")
            res.status(500)
            return
        }
        const userInfo = await getuser(client.value, id)
        await client.value.end()
        if (userInfo === null) {
            res.status(404).json({error: "No user account info found"})
        } else {
            console.log(`Returning: ${JSON.stringify(userInfo)}`)
            res.status(200).json(userInfo)
        }
        await client.value.end()
    } else {
        res
            .status(405)
            .json({error: `Method not allowed: ${method}`})
    }
}
