import { Client } from "pg";
import { Session } from "@supabase/gotrue-js";
import { Err, KResult, Ok } from "@/utils/errors";
import {
    AccountInfo,
    AllTransactions,
    ChargeInfo,
    UserInfo,
} from "@/utils/dbtypes";
import {
    getChargesByDay,
    getExternalTransactions,
    getuser,
} from "@/utils/database";
import logger from "@/utils/logger";

export async function getAccountInfo(
    client: Client,
    session: Session,
): Promise<KResult<AccountInfo | null>> {
    const user_id = session.user?.id;
    if (user_id === undefined) {
        return Err({ friendly: "Not logged in", cause: null });
    }
    const userInfo = await getuser(client, user_id);
    if (userInfo.isErr) {
        logger.error(
            { error: userInfo.error },
            "Error retrieving account info",
        );
        return Err({
            friendly: "Couldn't retrieve account info",
            cause: userInfo.error,
        });
    }
    return userInfo;
}

export async function getCharges(
    client: Client,
    session: Session,
): Promise<KResult<ChargeInfo[]>> {
    const user_id = session.user?.id;
    if (user_id === undefined) {
        return Err({ friendly: "Not logged in", cause: null });
    }
    const charges = await getChargesByDay(client, user_id, null, null);
    return Ok(charges);
}

export async function getTransactions(
    client: Client,
    session: Session,
): Promise<KResult<AllTransactions>> {
    const user_id = session.user?.id;
    if (user_id === undefined) {
        return Err({ friendly: "Not logged in", cause: null });
    }
    const exttxns = await getExternalTransactions(client, user_id);
    return Ok({ external_txns: exttxns, internal_txns: [] });
}

export async function getUserInfo(session: Session): Promise<UserInfo> {
    return {
        email: session.user.email ?? "",
        name: session.user.user_metadata.name,
        access_token: session.access_token,
    };
}
