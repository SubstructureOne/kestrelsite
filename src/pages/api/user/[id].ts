import {NextApiRequest, NextApiResponse} from "next"
import {createClient} from "@supabase/supabase-js"
import {pgconnect, getuser} from "../../../utils/database"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query, method} = req
    const id = <string>query.id
    // const jwt = <string>query.jwt
    const jwt = req.headers.authorization?.replace("Bearer ", "") || ""
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabase_url, anon_key)
    const {user, error} = await supabase.auth.api.getUser(jwt)
    if (user === null || user.id !== id) {
        res.status(403).json({error: `User ID is ${user?.id}, but requested ${id}`})
        return
    }
    if (method == 'GET') {
        const client = await pgconnect();
        const user_info = await getuser(client, id);
        console.log(`Returning: ${JSON.stringify(user_info)}`)
        res.status(200).json(user_info)
    }
}
