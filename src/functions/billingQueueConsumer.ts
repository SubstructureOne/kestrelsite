import { SQSEvent } from "aws-lambda"
import {AccountInfo, NewExternalTransactionInfo, NewUserInfo} from "../utils/dbtypes";
import {createExternalTransaction, createUser, getuser, pgconnect} from "../utils/database"
import {Client} from "pg"
import words from "friendly-words"
import logger from "../utils/logger"


export async function handler(event: SQSEvent) {
    const client = await pgconnect()
    for (const record of event.Records) {
        const transaction: NewExternalTransactionInfo = JSON.parse(record.body)
        logger.info(`Processing new external transaction: ${JSON.stringify(transaction)}`)
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


async function provisionUser(client: Client, userId: string): Promise<AccountInfo> {
    const pgName = generateUsername()
    logger.info(`Provisioning user ${userId} with postgres username ${pgName}`)
    const newUser: NewUserInfo = {user_id: userId, pg_name: pgName}
    return await createUser(client, newUser)
}


function generateUsername() {
    const { predicates, objects } = words
    const predicate = predicates[Math.floor(Math.random() * predicates.length)]
    const object = objects[Math.floor(Math.random() * objects.length)]
    return `${predicate}${object}`
}
