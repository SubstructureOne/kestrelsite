import { SQSEvent } from "aws-lambda"
import {AccountInfo, NewExternalTransactionInfo, NewUserInfo} from "../utils/dbtypes";
import {createExternalTransaction, createUser, getuser, pgconnect} from "../utils/database"
import {Client} from "pg"
import words from "friendly-words"

import PasswordGenerator from "generate-password";
import {encryptDataWithKey} from "../utils/encrypt_server";
import {KResult, Ok, Err} from "../utils/errors";
import logger from "../utils/logger";


export async function handler(event: SQSEvent) {
    const client = await pgconnect()
    if (client.isErr) {
        logger.error("Couldn't connect to postgres")
        return
    }
    for (const record of event.Records) {
        const transaction: NewExternalTransactionInfo = JSON.parse(record.body)
        logger.info(`Processing new external transaction: ${JSON.stringify(transaction)}`)
        await saveTransaction(client.value, transaction)
    }
    await client.value.end()
}


export async function billingEventHandler(txn: NewExternalTransactionInfo) {
    const client = await pgconnect();
    if (client.isErr) {
        logger.error("Couldn't connect to postgres");
        return;
    }
    await saveTransaction(client.value, txn);
    await client.value.end();
}

async function saveTransaction(client: Client, transaction: NewExternalTransactionInfo) {
    const userInfo = await getuser(client, transaction.user_id);
    if (userInfo === null) {
        // user has not yet been provisioned
        await provisionUser(client, transaction.user_id);
    }
    await createExternalTransaction(client, transaction);
}


async function provisionUser(client: Client, userId: string): Promise<KResult<AccountInfo>> {
    const pgName = generateUsername();
    const pgPasswordEnc = generateEncryptedPassword();
    logger.info(`Provisioning user ${userId} with postgres username ${pgName}`);
    if (pgPasswordEnc.isErr) {
        logger.error("Couldn't provision user", {userId});
        return Err({friendly: "Couldn't provision user", cause: pgPasswordEnc});
    }
    const newUser: NewUserInfo = {user_id: userId, pg_name: pgName, pg_password_enc: pgPasswordEnc.value};
    return Ok(await createUser(client, newUser));
}


function generateUsername() {
    const { predicates, objects } = words;
    const predicate = predicates[Math.floor(Math.random() * predicates.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    return `${predicate}${object}`;
}

function generateEncryptedPassword(): KResult<Uint8Array> {
    const password = PasswordGenerator.generate({
        length: 16,
        numbers: true,
        symbols: false,
        lowercase: true,
        uppercase: true,
        exclude: " ",
    });
    const pgpassKeyB64 = process.env.PGPASS_KEY_B64;
    if (pgpassKeyB64 === undefined) {
        return Err({friendly: "Postgres encryption key not defined"})
    }
    const binaryKey = Buffer.from(pgpassKeyB64, "base64");
    return Ok(encryptDataWithKey(password, binaryKey));
}
