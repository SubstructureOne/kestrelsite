import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import React from "react";

import { Headers } from "@/components/Headers";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import { AccountInfoTab } from "./AccountInfoComponent";
import { pgconnect } from "@/utils/database";
import ProfileContainer from "@/app/profile/ProfileContainer";
import { getAccountInfo, getUserInfo } from "@/utils/accounts";

const Profile = async () => {
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
    const client = await pgconnect();
    if (client.isErr) {
        return <p>Error connecting to database; please try again later.</p>;
    }
    const [userInfo, accountInfo] = await Promise.all([
        getUserInfo(session),
        getAccountInfo(client.value, session),
    ]);
    return (
        <ProfileContainer
            selected={"account-info"}
            userInfo={userInfo}
            accountInfo={accountInfo}
        >
            <Headers title="Kestrel: Profile" />
            <AccountInfoTab userInfo={userInfo} accountInfo={accountInfo} />
        </ProfileContainer>
    );
};

export default Profile;
