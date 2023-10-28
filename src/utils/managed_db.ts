import {Client} from "pg";

import {NewUserInfo} from "./dbtypes"
import {KResult, Ok, Err} from "./errors";
import logger from "./logger"
import {getEnviron} from "./secrets";

export async function managed_pgconnect(): Promise<KResult<Client>> {
    const environ = await getEnviron();
    if (environ.isErr) {
        return Err({friendly: "Couldn't initialize environ to connect to managed db", cause: environ});
    }
    const host = environ.value.MANAGED_PG_HOST;
    const port = parseInt(environ.value.MANAGED_PG_PORT || "5432");
    const user = environ.value.MANAGED_PG_USER;
    const password = environ.value.MANAGED_PG_PASSWORD;
    if (host === undefined) {
        const message = "Managed PG password is not set";
        logger.error(message)
        return Err({friendly: message});
    } else if (user === undefined) {
        const message = "Managed PG user is not set";
        logger.error(message);
        return Err({friendly: message});
    } else if (password === undefined) {
        const message = "Managed PG password is not set";
        logger.error(message);
        return Err({friendly: message});
    }
    const client = new Client({
        host,
        port,
        user,
        password,
        database: user,
    });
    try {
        await client.connect();
    } catch (error) {
        const message = "Connection to managed PG failed";
        logger.error(message);
        return Err({friendly: message});
    }
    return Ok(client);
}

export async function provisionManagedUser(client: Client, newUser: NewUserInfo): Promise<KResult<null>> {
    if (validateIdentifier(newUser.pg_name).isErr) {
        return Err({friendly: "Postgres name failed safety validation", cause: newUser.pg_name});
    }
    if (validateIdentifier(newUser.pg_password).isErr) {
        // Safe to include the password in this message because we ended up
        // not actually using it.
        return Err({friendly: "Postgres password failed safety validation", cause: newUser.pg_password});
    }
    try {
        logger.info({newUser}, "Creating managed database role");
        await client.query(`CREATE ROLE "${newUser.pg_name}" WITH LOGIN CREATEDB NOSUPERUSER NOINHERIT NOCREATEROLE PASSWORD '${newUser.pg_password}'`);
        logger.info({newUser}, "Creating managed user database");
        await client.query(`CREATE DATABASE "${newUser.pg_name}" WITH OWNER="${newUser.pg_name}"`);
        logger.info({newUser}, "Revoking public access to user database");
        await client.query(`REVOKE ALL ON DATABASE "${newUser.pg_name}" FROM public`);
        logger.info({newUser}, "Granting access to user database to new user");
        await client.query(`GRANT ALL ON SCHEMA public TO "${newUser.pg_name}" WITH GRANT OPTION`);
    } catch (error) {
        const message = "Error attempting to provision user. User may be partially provisioned.";
        logger.error({error}, message);
        return Err({friendly: message, cause: error});
    }
    return Ok(null);
}

function validateIdentifier(identifier: String): KResult<boolean> {
    if (identifier.match(/^[a-zA-Z0-9_.-]+$/)) {
        return Ok(true);
    } else {
        return Err({friendly: "Invalid characters in string", cause: identifier});
    }
}