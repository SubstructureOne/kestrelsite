import {NextApiRequest, NextApiResponse} from "next"
import {pgconnect, getuser} from "../../../utils/database"
import {userFromAuthHeader} from "../../../utils/auth"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query, method} = req
    const id = <string>query.id
    const user = await userFromAuthHeader(req)
    if (user === null || user.id !== id) {
        res.status(403).json({error: `User ID is ${user?.id}, but requested ${id}`})
        return
    }
    if (method == 'GET') {
        const client = await pgconnect();
        const userInfo = await getuser(client, id);
        console.log(`Returning: ${JSON.stringify(userInfo)}`)
        res.status(200).json(userInfo)
        await client.end()
    } else {
        res
            .status(405)
            .json({error: `Method not allowed: ${method}`})
    }
}
