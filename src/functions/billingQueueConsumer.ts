import { SQSEvent } from "aws-lambda"
import {ExternalTransactionInfo} from "../utils/dbtypes";
import {createExternalTransaction, pgconnect} from "../utils/database";
import {Client} from "pg";

export async function handler(event: SQSEvent) {
    const client = await pgconnect()
    for (const record of event.Records) {
        const transaction: ExternalTransactionInfo = JSON.parse(record.body)
        await saveTransaction(client, transaction)
    }
}

async function saveTransaction(client: Client, transaction: ExternalTransactionInfo) {
    await createExternalTransaction(client, transaction)
}