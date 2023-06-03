import { SQSEvent } from "aws-lambda"
import {NewExternalTransactionInfo} from "../utils/dbtypes";
import {createExternalTransaction, getuser, pgconnect} from "../utils/database"
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
        await provisionUser(client, )
    }
    await createExternalTransaction(client, transaction)
}