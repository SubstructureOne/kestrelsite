// import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"
import {KResult, Ok, Err} from "./errors";
import Dict = NodeJS.Dict;


export async function getEnv(key: string): Promise<KResult<string>> {
    const secrets = await getEnviron();
    if (secrets.isErr) {
        return Err(secrets.error);
    }
    const value = secrets.value[key];
    if (value === undefined) {
        return Err({friendly: "Specified secret not found", cause: key});
    }
    return Ok(value);
}

export async function getEnviron(): Promise<KResult<Dict<string>>> {
    return new Promise((resolve, _reject) => resolve(Ok(process.env)));
    // const client = new SecretsManagerClient({ region: "us-east-1" })
    // const command = new GetSecretValueCommand({
    //     SecretId: `${process.env.STAGE}/kestrelsite/env`
    // })
    // const result = await client.send(command)
    // if (result.SecretString === undefined) {
    //     return Err({friendly: "Secret not found", cause: null})
    // }
    // return Ok(JSON.parse(result.SecretString))
}
