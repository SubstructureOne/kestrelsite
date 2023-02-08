import { Client } from "pg"
import {UserInfo} from "./dbtypes"

export async function pgconnect() {
    const client = new Client({
        "host": process.env.POSTGRES_HOST,
        "port": parseInt(process.env.POSTGRES_PORT || '5432'),
        "user": process.env.POSTGRES_USER,
        "password": process.env.POSTGRES_PASSWORD,
        "database": process.env.POSTGRES_DATABASE,
    })
    await client.connect()
    return client
}

export async function getuser(client: Client, user_id: string) : Promise<UserInfo> {
    const result = await client.query(
        "SELECT user_id, pg_name, user_status, balance, status_synced, created_at, updated_at" +
        " FROM users WHERE user_id = $1",
        [user_id]
    )
    return result.rows[0]
}