import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import { useSession, supabase } from '../utils/supabaseClient'
import {SigninForm} from '../components/Auth'
import {Session} from '@supabase/gotrue-js'
import {Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState} from 'react'
import {AccountInfo, AllTransactions, ChargeInfo} from "../utils/dbtypes"
import {useRouter} from "next/router"
import React from "react"
import {Err, Ok, KResult} from "../utils/errors"
import Alert from "../components/Alert"
import logger from "../utils/logger"

type UserInfo = {
    email: string
    name: string
    access_token: string
}

async function getUserInfo(session: Session): Promise<UserInfo> {
    return {
        email: session.user.email ?? "",
        name: session.user.user_metadata.name,
        access_token: session.access_token,
    }
}

async function getAccountInfo(session: Session): Promise<KResult<AccountInfo|null>> {
    const user_id = session.user?.id
     if (user_id === undefined) {
        return Err({friendly: "Not logged in", cause: null})
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
        const accountInfo: AccountInfo = await response.json()
        return Ok(accountInfo)
    } else if (response.status == 404) {
        return Ok(null)
    } else {
        const result = await response.json()
        return Err({friendly: "Error getting account info", cause: result})
    }
}

async function getCharges(session: Session): Promise<KResult<ChargeInfo[]>> {
    const user_id = session.user?.id
    if (user_id === undefined) {
        return Err({friendly: "Not logged in", cause: null})
    }
    const response = await fetch(
        `/api/charges/${user_id}`,
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    )
    const result = await response.json()
    if (response.ok) {
        return Ok(result)
    } else {
        return Err({friendly: "Error getting charges", cause: result})
    }
}

async function getTransactions(session: Session): Promise<KResult<AllTransactions>> {
    const user_id = session.user?.id
    if (user_id === undefined) {
        return Err({friendly: "Not logged in", cause: null})
    }
    const response = await fetch(
        `/api/txns/${user_id}`,
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    )
    const result = await response.json()
    if (response.ok) {
        return Ok(result)
    } else {
        return Err({friendly: "Error getting transactions", cause: result})
    }
}


const PaymentBanner: React.FC<{userInfo: UserInfo | undefined, newUser: boolean}> = ({userInfo, newUser}) => {
    return <div className="m-4 p-4 text-center rounded-3xl shadow-2xl col-span-full">
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                {newUser ? "Initialize your account now" : "Fund your account now"}
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

async function createCheckoutSession(userInfo: UserInfo | undefined) {
    if (userInfo === undefined) {
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

function AccountInfoTab({userInfo, accountInfo}: {userInfo: UserInfo | undefined, accountInfo: KResult<AccountInfo | null> | undefined}) {
    let balance, pgName, pgPassword;
    const [blurred, setBlurred] = useState(true);
    if (accountInfo === undefined) {
        balance = "Loading...";
        pgName = "Loading...";
        pgPassword = "Loading...";
    } else if (accountInfo.isOk) {
        if (accountInfo.value === null || accountInfo.value.balance === undefined) {
            balance = "$0.00";
            pgName = "Not Set";
            pgPassword = "Not Set";
        } else {
            balance = "$" + accountInfo.value.balance.toFixed(2);
            pgName = accountInfo.value.pg_name;
            pgPassword = accountInfo.value.pg_password;
        }
    } else {
        balance = "error"
        pgName = "error"
    }
    return <>
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
            className="col-span-2 group m-4 flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
        >
            <h2>Postgres Info</h2>
            <div>
                <h3 className="text-lg border-b-2 border-gray-100">
                    {pgName}
                </h3>
                <div className="">
                    <p className="text-sm font-medium uppercase text-gray-500">Postgres Username</p>
                </div>
            </div>
            <div className="relative">
                <h3
                    className="text-lg border-b-2 border-grey-100"
                    style={blurred ? {color: "transparent", textShadow: "0 0 12px rgba(0,0,0,0.5)"} : {}}
                >
                    {blurred ? "Click icon to reveal" : pgPassword}
                </h3>
                <div
                    className="absolute inset-y-0 right-0 pr-3 pb-8 flex items-center text-sm leading-5"
                    onClick={() => setBlurred(!blurred)}
                >
                    <svg
                        className={`${blurred ? "hidden" : "block"} h-6 text-gray-700`}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                    >
                        <path fill="currentColor"
                              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                        </path>
                    </svg>

                    <svg className={`${blurred ? "block" : "hidden"} h-6 text-gray-700`} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path fill="currentColor"
                              d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                        </path>
                    </svg>

                </div>
                <div className="">
                    <p className="text-sm font-medium uppercase text-gray-500">Postgres Password</p>
                </div>
            </div>

        </a>
    </>
}

function chargesInfoTab(chargesInfo: KResult<ChargeInfo[]> | undefined) {
    let chargeTable
    if (chargesInfo?.isErr) {
        chargeTable = <Alert alert={chargesInfo.error.friendly} />
    } else {
        chargeTable = <>
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
                {chargesInfo === undefined ? "Loading..." : chargesInfo.value.map((charge) => <tr key={charge.charge_id}>
                    <td>{new Date(charge.charge_time).toLocaleString()}</td>
                    <td>{charge.charge_type}</td>
                    <td>${(charge.amount || 0).toLocaleString([], {minimumFractionDigits: 2})}</td>
                    <td>{charge.transacted.toString()}</td>
                </tr>)}
                </tbody>
            </table>
        </>
    }
    return <div className="col-span-3 p-4 m-4">
        {chargeTable}
    </div>
}

function transactionsInfoTab(txnsInfo: KResult<AllTransactions> | undefined) {
    let allTxnInfo
    if (txnsInfo !== undefined && txnsInfo.isErr) {
        allTxnInfo = <Alert alert={txnsInfo.error.friendly} />
    } else {
        let internalTxnRows, externalTxnRows
        if (txnsInfo === undefined) {
            internalTxnRows = "Loading..."
        } else if (txnsInfo.value.internal_txns.length === 0) {
            internalTxnRows = <td colSpan={2}>No recent transactions</td>
        } else {
            internalTxnRows = txnsInfo.value.internal_txns.map((txn) => <tr key={txn.txn_id}>
                <td>{new Date(txn.txn_time).toLocaleString()}</td>
                <td>{txn.amount}</td>
            </tr>)
        }
        if (txnsInfo === undefined) {
            externalTxnRows = "Loading..."
        } else if (txnsInfo.value.external_txns.length === 0) {
            externalTxnRows = <td colSpan={2}>No external transactions</td>
        } else {
            externalTxnRows = txnsInfo.value.external_txns.map((txn) => <tr key={txn.exttransaction_id}>
                <td>{txn.exttransaction_time.toLocaleString()}</td>
                <td>${txn.amount.toFixed(2)}</td>
            </tr>)
        }
        allTxnInfo = <>
            <h2>Recent transactions</h2>
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead>
                <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Amount</th>
                </tr>
                </thead>
                <tbody>{internalTxnRows}</tbody>
            </table>
            <h2 className="my-5">External transactions</h2>
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead>
                <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Amount</th>
                </tr>
                </thead>
                <tbody>{externalTxnRows}</tbody>
            </table>
        </>
    }
    return <div className="col-span-3 m-4 p-4 min-w-full">
        {allTxnInfo}
    </div>

}

type MenuItems = "account-info" | "transactions" | "charges"
type MenuProps = {
    selected: MenuItems
    setSelected: Dispatch<SetStateAction<MenuItems>>
    userInfo: UserInfo | undefined
}

const LeftSideMenu: FunctionComponent<MenuProps> = ({selected, setSelected, userInfo}) => {
    const router = useRouter()
    const signout = async () => {
        await supabase.auth.signOut()
        router.reload()
    }
    const userInfoSection = (userInfo !== undefined) ? <p className="text-xs">
        <strong className="block font-medium">{userInfo.name}</strong>
        <span> {userInfo.email} </span>
    </p> : <p></p>
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
                <div>
                    {userInfoSection}
                </div>
            </a>
        </div>
    </div>
}


function AccountInfoHtml(
    userInfo: UserInfo | undefined,
    accountInfo: KResult<AccountInfo | null> | undefined,
    chargesInfo: KResult<ChargeInfo[]> | undefined,
    txnsInfo: KResult<AllTransactions> | undefined,
): ReactElement {
    const [selected, setSelected] = useState<MenuItems>("account-info")
    const showBanner = accountInfo !== undefined && accountInfo.isOk && (
        accountInfo.value === null
        || accountInfo.value.user_status === "Disabled"
    )
    const newUser = accountInfo !== undefined && accountInfo.isOk && accountInfo.value === null
    return <div className="gap-4 flex">
        <LeftSideMenu selected={selected} setSelected={setSelected} userInfo={userInfo}/>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {showBanner
                ? <PaymentBanner newUser={newUser} userInfo={userInfo}/>
                : null
            }
            {selected === "account-info" ? <AccountInfoTab userInfo={userInfo} accountInfo={accountInfo}/>  : null}
            {selected === "transactions" ? transactionsInfoTab(txnsInfo) : null}
            {selected === "charges" ? chargesInfoTab(chargesInfo) : null}
        </div>
    </div>
}

const AccountInfoComponent: FunctionComponent<AccountBalanceComponentArgs> = (
    {session}
) => {
    const [userInfo, setUserInfo] = useState<UserInfo|undefined>(undefined)
    const [accountInfo, setAccountInfo] = useState<KResult<AccountInfo|null>|undefined>(undefined)
    const [chargesInfo, setChargesInfo] = useState<KResult<ChargeInfo[]>|undefined>(undefined)
    const [txnsInfo, setTxnsInfo] = useState<KResult<AllTransactions>|undefined>(undefined)
    useEffect(
        () => {
            getUserInfo(session).then((info) => setUserInfo(info))
            getAccountInfo(session).then((info) => setAccountInfo(info))
            getCharges(session).then((info) => setChargesInfo(info))
            getTransactions(session).then((info) => setTxnsInfo(info))
        },
        [session]
    )
    return AccountInfoHtml(
        userInfo,
        accountInfo,
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