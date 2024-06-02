import { SQSEvent } from "aws-lambda";
import { Client } from "pg";
import words from "friendly-words";

import PasswordGenerator from "generate-password";
import { KResult, Err } from "@/utils/errors";
import logger from "@/utils/logger";
import {
    createExternalTransaction,
    createUser,
    getuser,
    pgconnect,
} from "@/utils/database";
import {
    AccountInfo,
    NewExternalTransactionInfo,
    NewUserInfo,
} from "@/utils/dbtypes";
import { managed_pgconnect, provisionManagedUser } from "@/utils/managed_db";

export async function handler(event: SQSEvent) {
    const client = await pgconnect();
    if (client.isErr) {
        logger.error("Couldn't connect to postgres");
        return;
    }
    for (const record of event.Records) {
        const transaction: NewExternalTransactionInfo = JSON.parse(record.body);
        logger.info(
            `Processing new external transaction: ${JSON.stringify(
                transaction,
            )}`,
        );
        await saveTransaction(client.value, transaction);
    }
    await client.value.end();
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

async function saveTransaction(
    client: Client,
    transaction: NewExternalTransactionInfo,
) {
    const userInfo = await getuser(client, transaction.user_id);
    if (userInfo.isErr) {
        logger.error("Couldn't retrieve user info");
        return;
    }
    if (userInfo.value === null) {
        // user has not yet been provisioned
        await provisionUser(client, transaction.user_id);
    }
    await createExternalTransaction(client, transaction);
}

async function provisionUser(
    client: Client,
    userId: string,
): Promise<KResult<AccountInfo>> {
    const pgName = generateUsername();
    const pgPassword = generatePassword();
    const newUser: NewUserInfo = {
        user_id: userId,
        pg_name: pgName,
        pg_password: pgPassword,
    };
    logger.info({ newUser }, `Provisioning user`);
    const createUserResult = await createUser(client, newUser);
    if (createUserResult.isErr) {
        const message = "Couldn't create user row in impulse database";
        logger.error(message);
        return Err({ friendly: message, cause: createUserResult });
    }
    const managedClient = await managed_pgconnect();
    if (managedClient.isErr) {
        const message = "Couldn't connect to managed postgres";
        logger.error(message);
        return Err({ friendly: message, cause: managedClient });
    }
    const provisionManagedResult = await provisionManagedUser(
        managedClient.value,
        newUser,
    );
    if (provisionManagedResult.isErr) {
        const message = "Couldn't provision managed user";
        logger.error(message);
        return Err({ friendly: message, cause: provisionManagedResult });
    }
    return createUserResult;
}

function generateUsername() {
    const { predicates, objects } = words;
    const predicate = predicates[Math.floor(Math.random() * predicates.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    return `${predicate}${object}`;
}

function generatePassword(): string {
    return PasswordGenerator.generate({
        length: 16,
        numbers: true,
        symbols: false,
        lowercase: true,
        uppercase: true,
        exclude: " ",
    });
}
