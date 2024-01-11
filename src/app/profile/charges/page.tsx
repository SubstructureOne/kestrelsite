import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import { redirect } from "next/navigation";
import { pgconnect } from "@/utils/database";
import { getAccountInfo, getCharges, getUserInfo } from "@/utils/accounts";
import ProfileContainer from "@/app/profile/ProfileContainer";
import { Headers } from "@/components/Headers";
import React from "react";
import { ChargesInfoTab } from "@/app/profile/charges/ChargesInfoTab";

const Charges = async () => {
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
    const [userInfo, accountInfo, charges] = await Promise.all([
        getUserInfo(session),
        getAccountInfo(client.value, session),
        getCharges(client.value, session),
    ]);
    return (
        <ProfileContainer
            userInfo={userInfo}
            accountInfo={accountInfo}
            selected={"charges"}
        >
            <Headers title="Kestrel: Profile" />
            <ChargesInfoTab chargesInfo={charges} />
        </ProfileContainer>
    );
};

export default Charges;
