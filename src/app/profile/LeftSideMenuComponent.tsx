import React, { FunctionComponent } from "react";
import { UserInfo } from "@/utils/dbtypes";
import Link from "next/link";

export type MenuItems =
    | "account-info"
    | "transactions"
    | "charges"
    | "update-password";
type MenuProps = {
    selected: MenuItems;
    userInfo: UserInfo | undefined;
};
export const LeftSideMenu: FunctionComponent<MenuProps> = ({
    selected,
    userInfo,
}) => {
    const userInfoSection =
        userInfo !== undefined ? (
            <p className="text-xs">
                <strong className="block font-medium">{userInfo.name}</strong>
                <span> {userInfo.email} </span>
            </p>
        ) : (
            <p></p>
        );
    const selectedClasses =
        "flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700";
    const unselectedClasses =
        "flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700";
    return (
        <div className="flex flex-col justify-between border-r bg-white row-span-4">
            <div className="px-4 py-6">
                <nav
                    aria-label="Main Nav"
                    className="mt-6 flex flex-col space-y-1"
                >
                    <Link
                        href="/profile"
                        className={
                            selected === "account-info"
                                ? selectedClasses
                                : unselectedClasses
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>

                        <span className="text-sm font-medium hidden md:inline">
                            {" "}
                            Account Info{" "}
                        </span>
                    </Link>

                    <Link
                        href="/profile/transactions"
                        className={
                            selected === "transactions"
                                ? selectedClasses
                                : unselectedClasses
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>

                        <span className="text-sm font-medium hidden md:inline">
                            {" "}
                            Transactions{" "}
                        </span>
                    </Link>

                    <Link
                        href="/profile/charges"
                        className={
                            selected === "charges"
                                ? selectedClasses
                                : unselectedClasses
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>

                        <span className="text-sm font-medium hidden md:inline">
                            {" "}
                            Charges{" "}
                        </span>
                    </Link>

                    <Link
                        href="/profile/updatepassword"
                        className={
                            selected == "update-password"
                                ? selectedClasses
                                : unselectedClasses
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            viewBox="0 0 24 24"
                            // fill="none"
                            stroke="#ddd"
                        >
                            <path d="M 7 5 C 3.1545455 5 0 8.1545455 0 12 C 0 15.845455 3.1545455 19 7 19 C 9.7749912 19 12.089412 17.314701 13.271484 15 L 16 15 L 16 18 L 22 18 L 22 15 L 24 15 L 24 9 L 23 9 L 13.287109 9 C 12.172597 6.6755615 9.8391582 5 7 5 z M 7 7 C 9.2802469 7 11.092512 8.4210017 11.755859 10.328125 L 11.988281 11 L 22 11 L 22 13 L 20 13 L 20 16 L 18 16 L 18 13 L 12.017578 13 L 11.769531 13.634766 C 11.010114 15.575499 9.1641026 17 7 17 C 4.2454545 17 2 14.754545 2 12 C 2 9.2454545 4.2454545 7 7 7 z M 7 9 C 5.3549904 9 4 10.35499 4 12 C 4 13.64501 5.3549904 15 7 15 C 8.6450096 15 10 13.64501 10 12 C 10 10.35499 8.6450096 9 7 9 z M 7 11 C 7.5641294 11 8 11.435871 8 12 C 8 12.564129 7.5641294 13 7 13 C 6.4358706 13 6 12.564129 6 12 C 6 11.435871 6.4358706 11 7 11 z" />
                        </svg>
                        <span className="text-sm font-medium hidden md:inline">
                            {" "}
                            Change Password{" "}
                        </span>
                    </Link>

                    <Link href="/signout" className={unselectedClasses}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>

                        <span className="text-sm font-medium hidden md:inline">
                            {" "}
                            Sign Out{" "}
                        </span>
                    </Link>
                </nav>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <a
                    href="#"
                    className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
                >
                    <div>{userInfoSection}</div>
                </a>
            </div>
        </div>
    );
};
