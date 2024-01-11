import React from "react";
import { UserInfo } from "@/utils/dbtypes";

export const PaymentBanner: React.FC<{
    userInfo: UserInfo | undefined;
    newUser: boolean;
}> = ({ userInfo, newUser }) => {
    return (
        <div className="m-4 p-4 text-center rounded-3xl shadow-2xl col-span-full">
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                {newUser
                    ? "Initialize your account now"
                    : "Fund your account now"}
            </p>

            <h2 className="mt-6 text-3xl font-bold">
                In order to use your Kestrel account, you must purchase credits.
            </h2>

            <a
                href="#"
                className="mt-8 inline-block w-full rounded-full bg-pink-600 py-4 text-sm font-bold text-white shadow-xl"
                onClick={async () => createCheckoutSession(userInfo)}
            >
                Purchase Credits
            </a>
        </div>
    );
};

export async function createCheckoutSession(userInfo: UserInfo | undefined) {
    if (userInfo === undefined) {
        return;
    }
    const res = await fetch("/api/txns/fund", {
        headers: {
            Authorization: `Bearer ${userInfo.access_token}`,
        },
    });
    const json = await res.json();
    window.location = json.redirect;
}
