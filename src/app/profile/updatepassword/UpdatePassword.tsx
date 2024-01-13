"use client";

import React, { useState } from "react";
import Alert from "@/components/Alert";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import logger from "@/utils/logger";
import { PasswordSymbol } from "@/components/symbols";
import { UserInfo } from "@/utils/dbtypes";

export const UpdatePassword: React.FC<{
    userInfo: UserInfo;
}> = ({ userInfo }) => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState("");
    const router = useRouter();

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error === null) {
            if (newPassword !== confirmPassword) {
                setAlert("Passwords do not match");
            } else {
                logger.info(`Updating password for user ${userInfo.email}`);
                const { error } = await supabase.auth.updateUser({
                    password: newPassword,
                });
                if (error === null) {
                    router.push("/profile");
                } else {
                    setAlert(`Error updating password: ${error.message}`);
                }
            }
        } else {
            setAlert(error.message);
        }
    };

    return (
        <form
            className="mx-auto mt-8 mb-0 max-w-md space-y-4"
            onSubmit={onSubmitHandler}
            target="/profile"
        >
            <div>
                <label htmlFor="newPassword" className="sr-only">
                    New Password
                </label>

                <div className="relative">
                    <input
                        type="password"
                        id="newPassword"
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <PasswordSymbol />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="sr-only">
                    Password
                </label>

                <div className="relative">
                    <input
                        type="password"
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                        placeholder="Enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <PasswordSymbol />
                </div>
            </div>

            {alert === "" ? <></> : <Alert alert={alert} />}

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                >
                    Update Password
                </button>
            </div>
        </form>
    );
};
