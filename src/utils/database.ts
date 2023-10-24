import { Client } from "pg"
import {
    ChargeInfo,
    AccountInfo,
    TransactionInfo,
    NewExternalTransactionInfo,
    NewUserInfo,
    ExternalTransactionInfo
} from "./dbtypes"
import {getEnviron} from "./secrets"
import {KResult, Ok, Err} from "./errors"
import logger from "./logger"
import {decryptDataWithKey, encryptDataWithKey} from "./encrypt_server"

export async function pgconnect(): Promise<KResult<Client>> {
    const environ = await getEnviron()
    if (environ.isErr) {
        return Err(environ.error)
    }
    const client = new Client({
        "host": environ.value.POSTGRES_HOST,
        "port": parseInt(environ.value.POSTGRES_PORT || '5432'),
        "user": environ.value.POSTGRES_USER,
        "password": environ.value.POSTGRES_PASSWORD,
        "database": environ.value.POSTGRES_DATABASE,
    })
    await client.connect()
    return Ok(client)
}

export async function getuser(client: Client, user_id: string) : Promise<KResult<AccountInfo | null>> {
    let result;
    try {
        result = await client.query(
            "SELECT user_id, pg_name, user_status, balance, status_synced, created_at, updated_at, pg_password_enc" +
            " FROM users WHERE user_id = $1",
            [user_id]
        )
    } catch (err) {
        return Err({friendly: "User query failed"});
    }
    if (result.rows.length > 0) {
        const row = result.rows[0];
        const pgPassword = decryptPassword(row["pg_password_enc"]);
        if (pgPassword.isErr) {
            return Err({friendly: "Could not decrypt postgres password", reason: pgPassword});
        }
        return Ok({
            user_id: row["user_id"],
            balance: row["balance"],
            created_at: row["created_at"],
            updated_at: row["updated_at"],
            pg_name: row["pg_name"],
            pg_password: pgPassword.value,
            status_synced: row["status_synced"],
            user_status: row["user_status"],
        });
    } else {
        return Ok(null);
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

export async function getExternalTransactions(client: Client, userId: string): Promise<ExternalTransactionInfo[]> {

    const result = await client.query(
        `
            SELECT exttransaction_id, user_id, amount, exttransaction_time, exttransaction_extid
            FROM exttransactions
            WHERE user_id = $1
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

export async function createUser(client: Client, newUser: NewUserInfo): Promise<KResult<AccountInfo>> {
    const encryptedPassword = encryptPassword(newUser.pg_password);
    if (encryptedPassword.isErr) {
        logger.error("Couldn't encrypt Postgres password");
        return Err({friendly: "Couldn't encrypt Postgres password", cause: encryptedPassword});
    }
    const result = await client.query({
        text: "INSERT INTO users (user_id, pg_name, pg_password_enc, status_synced) VALUES ($1, $2, $3, true) RETURNING user_status, balance, created_at, updated_at",
        values: [newUser.user_id, newUser.pg_name, encryptedPassword.value],
    });
    const returned = result.rows[0];
    return Ok({
        user_id: newUser.user_id,
        pg_name: newUser.pg_name,
        user_status: returned.user_status,
        balance: returned.balance,
        status_synced: true,
        created_at: returned.created_at,
        updated_at: returned.updated_at,
        pg_password: newUser.pg_password,
    });
}

function encryptPassword(password: string): KResult<Uint8Array> {
    const pgpassKeyB64 = process.env.PGPASS_KEY_B64;
    if (pgpassKeyB64 === undefined) {
        logger.error("Postgres encryption key not defined");
        return Err({friendly: "Postgres encryption key not defined"})
    }
    const binaryKey = Buffer.from(pgpassKeyB64, "base64");
    return Ok(encryptDataWithKey(password, binaryKey));
}


export function decryptPassword(encrypted: Uint8Array): KResult<string> {
    const keyB64 = process.env.PGPASS_KEY_B64;
    if (keyB64 === undefined) {
        logger.error("Postgres encryption key not defined");
        return Err({friendly: "Postgres encryption key not defined"});
    }
    const binaryKey = Buffer.from(keyB64, "base64");
    return Ok(decryptDataWithKey(encrypted, binaryKey));
}
