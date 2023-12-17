import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import React from "react";
import { Session } from "@supabase/gotrue-js";
import { Client } from "pg";

import { Headers } from "@/components/Headers";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabaseUrl, supabaseAnonKey } from "@/utils/supabaseClient";
import { Err, KResult, Ok } from "@/utils/errors";
import {
    AccountInfo,
    AllTransactions,
    ChargeInfo,
    UserInfo,
} from "@/utils/dbtypes";
import AccountInfoHtml from "./AccountInfoComponent";
import {
    getChargesByDay,
    getExternalTransactions,
    getuser,
    pgconnect,
} from "@/utils/database";
import logger from "@/utils/logger";

const PreviewOnly = () => {
    return (
        <>
            <h2>Preview-Only Mode</h2>
            <p>
                Kestrel is currently deployed in preview-only mode, so account
                creation and login is currently disabled.
            </p>
            <p>
                Follow{" "}
                <a href="https://twitter.com/SubstructureOne" target="_blank">
                    @SubstructureOne
                </a>{" "}
                on Twitter to get the latest project updates and get notified
                when the Kestrel substructure goes live for public beta.
            </p>
        </>
    );
};

async function getAccountInfo(
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

async function getCharges(
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

async function getTransactions(
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

async function getUserInfo(session: Session): Promise<UserInfo> {
    return {
        email: session.user.email ?? "",
        name: session.user.user_metadata.name,
        access_token: session.access_token,
    };
}

const AccountInfoComponent = async (session: Session) => {
    const client = await pgconnect();
    if (client.isErr) {
        return <p>Error connecting to database; please try again later.</p>;
    }
    const [userInfo, accountInfo, chargesInfo, txnsInfo] = await Promise.all([
        getUserInfo(session),
        getAccountInfo(client.value, session),
        getCharges(client.value, session),
        getTransactions(client.value, session),
    ]);
    return (
        <AccountInfoHtml
            userInfo={userInfo}
            accountInfo={accountInfo}
            chargesInfo={chargesInfo}
            txnsInfo={txnsInfo}
        />
    );
};

const Profile = async () => {
    // const {data} = await supabase.auth.getSession();
    // const session = data.session;
    const cookiesStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookiesStore.get(name)?.value;
            },
        },
    });
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session === null) {
        redirect("/signin");
    }
    const title = "Kestrel: Profile";
    return (
        <>
            <Headers title={title} />
            <Navigation />
            {process.env.NEXT_PUBLIC_PREVIEW_MODE_DISABLED ? (
                await AccountInfoComponent(session)
            ) : (
                <PreviewOnly />
            )}
            <Footer />
        </>
    );
};

export default Profile;
