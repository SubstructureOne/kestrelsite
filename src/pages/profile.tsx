import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import { useSession, supabase } from '../utils/supabaseClient'
import {SigninForm} from '../components/Auth'
import {Session} from '@supabase/gotrue-js'
import {Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState} from 'react'
import {AccountInfo, ChargeInfo, TransactionInfo} from "../utils/dbtypes"
import {useRouter} from "next/router"
import React from "react";
import Link from "next/link";

type UserInfo = {
    email: string
    name: string
    balance: number
    access_token: string
}

async function getUserInfo(session: Session): Promise<UserInfo> {
    const {data, error} = await supabase.from("balances").select("balance")
    if (!data) {
        throw new Error("Data not found")
    }
    if (error) {
        throw error
    }
    return {
        email: session.user?.email ?? "",
        name: session.user?.user_metadata?.name,
        balance: data[0].balance,
        access_token: session.access_token,
    }
}

async function getAccountInfo(session: Session): Promise<AccountInfo | null> {
    const user_id = session.user?.id
    if (user_id === undefined) {
        throw new Error("Not logged in")
    }
    const response = await fetch(
        `/api/user/${user_id}`,
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    )
    if (response.ok) {
        return await response.json()
    } else if (response.status == 404) {
        return null
    } else {
        const result = await response.json()
        throw new Error(`Error getting account info: ${result?.error}`)
    }
}

async function getCharges(session: Session): Promise<ChargeInfo[]> {
    const user_id = session.user?.id
    if (user_id === undefined) {
        throw new Error("Not logged in")
    }
    const response = await fetch(
        `/api/charges/${user_id}`,
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    )
    return await response.json()
}

async function getTransactions(session: Session): Promise<TransactionInfo[]> {
    const user_id = session.user?.id
    if (user_id === undefined) {
        throw new Error("Not logged in")
    }
    const response = await fetch(
        `/api/txns/${user_id}`,
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    )
    return await response.json()
}


const PaymentBanner: React.FC<{newUser: boolean}> = ({newUser}) => {
    return <div className="m-4 p-4 text-center rounded-3xl shadow-2xl col-span-full">
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                {newUser ? "Initialize your account now" : "Fund your account now"}
            </p>

            <h2 className="mt-6 text-3xl font-bold">
                In order to use your Kestrel account, you must purchase credits.
            </h2>

            <Link
                href="/api/txns/fund"
                className="mt-8 inline-block w-full rounded-full bg-pink-600 py-4 text-sm font-bold text-white shadow-xl"
            >
                Purchase Credits
            </Link>
        </div>

}

const PreviewOnly = () => {
    return <>
        <h2>Preview-Only Mode</h2>
        <p>
            Kestrel is currently deployed in preview-only mode, so account
            creation and login is currently disabled.
        </p>
        <p>
            Follow <a href="https://twitter.com/SubstructureOne" target="_blank">
            @SubstructureOne
        </a> on Twitter to get the latest project updates and get notified when
            the Kestrel substructure goes live for public beta.
        </p>
    </>
}

type AccountBalanceComponentArgs = {
    session: Session
}

function accountInfoTab(userInfo: UserInfo | null, accountInfo: AccountInfo | null) {
    const redirect = async (event: React.MouseEvent<HTMLElement>) => {
        if (userInfo === null) {
            return
        }
        const res = await fetch("/api/txns/fund", {
            headers: {
                "Authorization": `Bearer ${userInfo.access_token}`
            }
        })
        const json = await res.json()
        window.location = json.redirect
    }
    return <>
        <a
            href="#"
            className="group m-4 flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
            onClick={redirect}
        >
            <h2>Account Credit</h2>
            <div>
                <h3 className="text-xl font-bold text-indigo-600">
                    ${accountInfo?.balance == null ? "Loading...." : accountInfo.balance.toFixed(2)}
                </h3>

                <div className="mt-4 border-t-2 border-gray-100 pt-4">
                    <p className="text-sm font-medium uppercase text-gray-500">Balance</p>
                </div>
            </div>

            <div
                className="mt-8 inline-flex items-center gap-2 text-indigo-600 sm:mt-6"
            >
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


        <a
            className="group m-4 flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
        >
            <h2>Postgres Info</h2>
            <div>
                <h3 className="text-lg border-b-2 border-gray-100">
                    {accountInfo == null ? "Loading...." : accountInfo.pg_name}
                </h3>

                {/*<div className="mt-4 border-t-2 border-gray-100 pt-4">*/}
                <div className="">
                    <p className="text-sm font-medium uppercase text-gray-500">Postgres Username</p>
                </div>
            </div>

        </a>
    </>
}

function chargesInfoTab(chargesInfo: ChargeInfo[] | null) {
    return <div className="col-span-3 p-4 m-4">
        <h2>Recent charges</h2>
        <table>
            <thead>
                <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Type</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Transacted</th>
                </tr>
            </thead>
            <tbody>
                {chargesInfo === null ? "Loading..." : chargesInfo.map((charge) => <tr key={charge.charge_id}>
                    <td>{new Date(charge.charge_time).toLocaleString()}</td>
                    <td>{charge.charge_type}</td>
                    <td>${(charge.amount || 0).toLocaleString([], {minimumFractionDigits: 2})}</td>
                    <td>{charge.transacted.toString()}</td>
                </tr>)}
            </tbody>
        </table>
    </div>
}

function transactionsInfoTab(txnsInfo: TransactionInfo[] | null) {
    return <div className="col-span-3 m-4 p-4 min-w-full">
        <h2>Recent transactions</h2>
        <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
                <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {txnsInfo === null ? "Loading..." : txnsInfo.map((txn) => <tr key={txn.txn_id}>
                    <td>{new Date(txn.txn_time).toLocaleString()}</td>
                    <td>{txn.amount}</td>
                </tr>)}
            </tbody>
        </table>
    </div>

}

type MenuItems = "account-info" | "transactions" | "charges"
type MenuProps = {
    selected: MenuItems
    setSelected: Dispatch<SetStateAction<MenuItems>>
    userInfo: UserInfo | null | undefined
}

const LeftSideMenu: FunctionComponent<MenuProps> = ({selected, setSelected, userInfo}) => {
    const router = useRouter()
    const signout = async () => {
        const { error } = await supabase.auth.signOut()
        router.reload()
    }
    const selectedClasses = "flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700"
    const unselectedClasses = "flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    return <div className="flex flex-col justify-between border-r bg-white row-span-4">
        <div className="px-4 py-6">
            <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
                <a
                    href="#"
                    className={selected === "account-info" ? selectedClasses : unselectedClasses}
                    onClick={() => setSelected("account-info")}
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

                    <span className="text-sm font-medium hidden md:inline"> Account Info </span>
                </a>

                <a
                    href="#"
                    className={selected === "transactions" ? selectedClasses : unselectedClasses}
                    onClick={() => setSelected("transactions")}
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

                    <span className="text-sm font-medium hidden md:inline"> Transactions </span>
                </a>

                <a
                    href="#"
                    className={selected === "charges" ? selectedClasses : unselectedClasses}
                    onClick={() => setSelected("charges")}
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

                    <span className="text-sm font-medium hidden md:inline"> Charges </span>
                </a>

                <a
                    href="#"
                    className={unselectedClasses}
                    onClick={signout}
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>

                    <span className="text-sm font-medium hidden md:inline"> Sign Out </span>
                </a>
            </nav>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
            <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                {/*<img*/}
                {/*    alt="Man"*/}
                {/*    src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"*/}
                {/*    className="h-10 w-10 rounded-full object-cover"*/}
                {/*/>*/}

                <div>
                    <p className="text-xs">
                        <strong className="block font-medium">{userInfo?.name}</strong>

                        <span> {userInfo?.email} </span>
                    </p>
                </div>
            </a>
        </div>
    </div>
}


function AccountInfoHtml(
    userInfo: UserInfo | null,
    accountInfo: AccountInfo | null | undefined,
    chargesInfo: ChargeInfo[] | null,
    txnsInfo: TransactionInfo[] | null,
): ReactElement {
    const [selected, setSelected] = useState<MenuItems>("account-info")

    return <div className="gap-4 flex">
        <LeftSideMenu selected={selected} setSelected={setSelected} userInfo={userInfo}/>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {accountInfo === null ? <PaymentBanner newUser={true}/> : (accountInfo?.user_status == "Disabled" ? <PaymentBanner newUser={false}/> : null) }
            {selected === "account-info" ? accountInfoTab(userInfo, accountInfo || null) : null}
            {selected === "transactions" ? transactionsInfoTab(txnsInfo) : null}
            {selected === "charges" ? chargesInfoTab(chargesInfo) : null}
        </div>
    </div>
}

const AccountInfoComponent: FunctionComponent<AccountBalanceComponentArgs> = (
    {session}
) => {
    const metadata = session.user.user_metadata
    const [accountInfo, setAccountInfo] = useState<UserInfo|null>(null)
    const [userInfo, setUserInfo] = useState<AccountInfo|null|undefined>(undefined)
    const [chargesInfo, setChargesInfo] = useState<ChargeInfo[]|null>(null)
    const [txnsInfo, setTxnsInfo] = useState<TransactionInfo[]|null>(null)
    useEffect(
        () => {
            getUserInfo(session).then((info) => setAccountInfo(info))
            getAccountInfo(session).then((info) => setUserInfo(info))
            getCharges(session).then((info) => setChargesInfo(info))
            getTransactions(session).then((info) => setTxnsInfo(info))
        },
        []
    )
    return AccountInfoHtml(
        accountInfo,
        userInfo,
        chargesInfo,
        txnsInfo,
    )
}

const Profile: NextPage = () => {
    const [session, setSession] = useSession()
    const title = session ? "Kestrel: Profile" : "Kestrel: Log In"
    return <>
        <Headers title={title}/>
        <Navigation/>
        {
            process.env.NEXT_PUBLIC_PREVIEW_MODE_DISABLED
                ? (session ? <AccountInfoComponent session={session}/> : <SigninForm setSession={setSession}/>)
                : <PreviewOnly/>
        }
        <Footer/>
    </>
}

export default Profile