"use client";

import React, { FunctionComponent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import Alert from "@/components/Alert";

const ResetPasswordComponent: FunctionComponent<{}> = () => {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.BASE_URL}/profile/updatepassword`,
        });
        if (error === null) {
            setResetSent(true);
        } else {
            setAlert(error.message);
        }
    };

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">
                    {resetSent
                        ? "Password reset link sent"
                        : "Reset your Kestrel password"}
                </h1>
            </div>

            {resetSent ? null : (
                <form
                    className="mx-auto mt-8 mb-0 max-w-md space-y-4"
                    onSubmit={onSubmitHandler}
                >
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>

                        <div className="relative">
                            <input
                                type="email"
                                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {alert === "" ? <></> : <Alert alert={alert} />}

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            No account?{" "}
                            <a className="underline" href="signup">
                                Sign up
                            </a>
                        </p>

                        <button
                            type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordComponent;
