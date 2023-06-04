import { SQSEvent } from "aws-lambda"
import {AccountInfo, NewExternalTransactionInfo} from "../utils/dbtypes";
import {createExternalTransaction, createUser, getuser, pgconnect} from "../utils/database"
import {Client} from "pg";

export async function handler(event: SQSEvent) {
    const client = await pgconnect()
    for (const record of event.Records) {
        const transaction: NewExternalTransactionInfo = JSON.parse(record.body)
        await saveTransaction(client, transaction)
    }
}

async function saveTransaction(client: Client, transaction: NewExternalTransactionInfo) {
    const userInfo = await getuser(client, transaction.user_id)
    if (userInfo === null) {
        // user has not yet been provisioned
        await provisionUser(client, transaction.user_id)
    }
    await createExternalTransaction(client, transaction)
}


async function provisionUser(client: Client, user_id: string): Promise<AccountInfo> {
    const pgName = "hello"
    const newUser = {user_id, pg_name: pgName}
    return await createUser(client, newUser)
}
