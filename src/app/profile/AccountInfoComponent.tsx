"use client";

import React, { useState } from "react";

import { KResult } from "@/utils/errors";
import { AccountInfo, UserInfo } from "@/utils/dbtypes";
import { createCheckoutSession } from "@/app/profile/PaymentBanner";

export function AccountInfoTab({
    userInfo,
    accountInfo,
}: {
    userInfo: UserInfo | undefined;
    accountInfo: KResult<AccountInfo | null> | undefined;
}) {
    let balance, pgName, pgPassword;
    const [blurred, setBlurred] = useState(true);
    if (accountInfo === undefined) {
        balance = "Loading...";
        pgName = "Loading...";
        pgPassword = "Loading...";
    } else if (accountInfo.isOk) {
        if (
            accountInfo.value === null ||
            accountInfo.value.balance === undefined
        ) {
            balance = "$0.00";
            pgName = "Not Set";
            pgPassword = "Not Set";
        } else {
            balance = "$" + accountInfo.value.balance.toFixed(2);
            pgName = accountInfo.value.pg_name;
            pgPassword = accountInfo.value.pg_password;
        }
    } else {
        balance = "error";
        pgName = "error";
    }
    return (
        <>
            <a
                href="#"
                className="group m-4 flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
                onClick={async () => await createCheckoutSession(userInfo)}
            >
                <h2>Account Credit</h2>
                <div>
                    <h3 className="text-xl font-bold text-indigo-600">
                        {balance}
                    </h3>

                    <div className="mt-4 border-t-2 border-gray-100 pt-4">
                        <p className="text-sm font-medium uppercase text-gray-500">
                            Balance
                        </p>
                    </div>
                </div>

                <div className="mt-8 inline-flex items-center gap-2 text-indigo-600 sm:mt-6">
                    <p className="font-medium sm:text-lg">Purchase credits</p>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 transition group-hover:translate-x-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </div>
            </a>

            <a className="col-span-2 group m-4 flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8">
                <h2>Postgres Info</h2>
                <div>
                    <h3 className="text-lg border-b-2 border-gray-100">
                        {process.env.NEXT_PUBLIC_IMPULSE_HOSTNAME}
                    </h3>
                    <div className="">
                        <p className="text-sm font-medium uppercase text-gray-500">
                            Postgres Hostname
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg border-b-2 border-gray-100">
                        {process.env.NEXT_PUBLIC_IMPULSE_PORT}
                    </h3>
                    <div className="">
                        <p className="text-sm font-medium uppercase text-gray-500">
                            Postgres Port
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg border-b-2 border-gray-100">
                        {pgName}
                    </h3>
                    <div className="">
                        <p className="text-sm font-medium uppercase text-gray-500">
                            Postgres Username
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <h3
                        className="text-lg border-b-2 border-grey-100"
                        style={
                            blurred
                                ? {
                                      color: "transparent",
                                      textShadow: "0 0 12px rgba(0,0,0,0.5)",
                                  }
                                : {}
                        }
                    >
                        {blurred ? "Click icon to reveal" : pgPassword}
                    </h3>
                    <div
                        className="absolute inset-y-0 right-0 pr-3 pb-8 flex items-center text-sm leading-5"
                        onClick={() => setBlurred(!blurred)}
                    >
                        <svg
                            className={`${
                                blurred ? "hidden" : "block"
                            } h-6 text-gray-700`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                        >
                            <path
                                fill="currentColor"
                                d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                            ></path>
                        </svg>

                        <svg
                            className={`${
                                blurred ? "block" : "hidden"
                            } h-6 text-gray-700`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                        >
                            <path
                                fill="currentColor"
                                d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                            ></path>
                        </svg>
                    </div>
                    <div className="">
                        <p className="text-sm font-medium uppercase text-gray-500">
                            Postgres Password
                        </p>
                    </div>
                </div>
            </a>
        </>
    );
}
