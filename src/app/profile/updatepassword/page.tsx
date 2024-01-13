import { Headers } from "@/components/Headers";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import React from "react";
import { UpdatePassword } from "@/app/profile/updatepassword/UpdatePassword";
import ProfileContainer from "@/app/profile/ProfileContainer";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import { pgconnect } from "@/utils/database";
import { getAccountInfo, getUserInfo } from "@/utils/accounts";
import { redirect } from "next/navigation";

const UpdatePasswordPage = async () => {
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
        <>
            <Headers title="Update Password" />
            <ProfileContainer
                userInfo={userInfo}
                accountInfo={accountInfo}
                selected={"update-password"}
            >
                <div className="col-span-3 p-4 m-4 min-w-full">
                    <h2>Set a New Password</h2>
                    <UpdatePassword />
                </div>
            </ProfileContainer>
        </>
    );
};

export default UpdatePasswordPage;
