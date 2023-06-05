import { Client } from "pg"
import {ChargeInfo, AccountInfo, TransactionInfo, NewExternalTransactionInfo, NewUserInfo} from "./dbtypes"

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

export async function createExternalTransaction(client: Client, exttxn: NewExternalTransactionInfo): Promise<number> {
    const result = await client.query({
        text: "SELECT new_balance FROM add_external_deposit($1, $2, $3)",
        values: [exttxn.user_id, exttxn.amount, exttxn.exttxn_extid],
        rowMode: "array",
    })
    return result.rows[0][0]
}

export async function createUser(client: Client, newUser: NewUserInfo): Promise<AccountInfo> {
    const result = await client.query({
        text: "INSERT INTO users (user_id, pg_name, status_synced) VALUES ($1, $2, true) RETURNING user_status, balance, created_at, updated_at",
        values: [newUser.user_id, newUser.pg_name],
    })
    const returned = result.rows[0]
    return {
        user_id: newUser.user_id,
        pg_name: newUser.pg_name,
        user_status: returned.user_status,
        balance: returned.balance,
        status_synced: true,
        created_at: returned.created_at,
        updated_at: returned.updated_at,
    }
}
