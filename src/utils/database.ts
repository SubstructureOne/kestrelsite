import { Client } from "pg"
import {ChargeInfo, AccountInfo, TransactionInfo} from "./dbtypes"

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

export async function getuser(client: Client, user_id: string) : Promise<AccountInfo | null> {
    const result = await client.query(
        "SELECT user_id, pg_name, user_status, balance, status_synced, created_at, updated_at" +
        " FROM users WHERE user_id = $1",
        [user_id]
    )
    if (result.rows.length > 0) {
        return result.rows[0]
    } else {
        return null
    }
}

export async function getCharges(client: Client, userId: string): Promise<ChargeInfo[]> {
    const result = await client.query(
        "SELECT charge_id, charge_time, user_id, charge_type, quantity, rate, amount, report_ids, transacted" +
        " FROM charges WHERE user_id = $1",
        [userId]
    )
    return result.rows
}

export async function getTransactions(client: Client, userId: string): Promise<TransactionInfo[]> {
    const result = await client.query(
        `
            SELECT txn_id, txn_time, from_user, to_user, charge_ids, amount
            FROM transactions
            WHERE from_user = $1
        `,
        [userId]
    )
    return result.rows
}

export async function createExternalTransaction(client: Client, userId: string, amount: number): Promise<number> {
    const result = await client.query({
        text: "SELECT new_balance FROM add_external_deposit($1, $2)",
        values: [userId, amount],
        rowMode: "array",
    })
    return result[0][0]
}
