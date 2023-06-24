import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"
import {KResult} from "./errors"
import {Result} from "true-myth"
import Dict = NodeJS.Dict

const client = new SecretsManagerClient({ region: "us-east-1" })
const command = new GetSecretValueCommand({
    SecretId: `${process.env.STAGE}/kestrelsite/env`
})

export async function getEnv(key: string): Promise<KResult<string>> {
    const secrets = await getEnviron()
    if (secrets.isErr) {
        return Result.err(secrets.error)
    }
    const value = secrets.value[key]
    if (value === undefined) {
        return Result.err({friendly: "Specified secret not found", cause: key})
    }
    return Result.ok(value)
}

export async function getEnviron(): Promise<KResult<Dict<string>>> {
    const result = await client.send(command)
    if (result.SecretString === undefined) {
        return Result.err({friendly: "Secret not found", cause: null})
    }
    return Result.ok(JSON.parse(result.SecretString))
}
