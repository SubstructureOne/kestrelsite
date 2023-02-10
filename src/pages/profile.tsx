import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import { checkSession, supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import {Session} from '@supabase/gotrue-js'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {AccountInfo, ChargeInfo, TransactionInfo} from "../utils/dbtypes"

type UserInfo = {
    email: string
    balance: number
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
        balance: data[0].balance
    }
}

async function getAccountInfo(session: Session): Promise<AccountInfo> {
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
    return await response.json()
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

function accountInfoHtml(
    accountInfo: UserInfo,
    userInfo: AccountInfo | null,
    chargesInfo: ChargeInfo[] | null,
    txnsInfo: TransactionInfo[] | null,
): ReactElement {
    return <div className="section wf-section">
        <h4>User: {accountInfo.email}</h4>
        <div className="w-container">
            <div className="w-row">
                <div className="w-col w-col-5">
                    <div className="process-titles">Account Balance</div>
                    <p>{userInfo === null ? "Loading..." : userInfo.balance}</p>
                    <p>Make a deposit</p>
                </div>
                <div className="w-col w-col-5">
                    <div className="process-titles">Recent charges</div>
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
                            {chargesInfo === null ? "Loading..." : chargesInfo.map((charge) => <tr>
                                <td>{new Date(charge.charge_time).toLocaleString()}</td>
                                <td>{charge.charge_type}</td>
                                <td>{charge.amount}</td>
                                <td>{charge.transacted.toString()}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="w-col w-col-5">
                    <p className="process-titles">Recent transactions</p>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Time</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txnsInfo === null ? "Loading..." : txnsInfo.map((txn) => <tr>
                                <td>{new Date(txn.txn_time).toLocaleString()}</td>
                                <td>{txn.amount}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}

const AccountInfoComponent: FunctionComponent<AccountBalanceComponentArgs> = (
    {session}
) => {
    const [accountInfo, setAccountInfo] = useState<UserInfo|null>()
    const [userInfo, setUserInfo] = useState<AccountInfo|null>()
    const [chargesInfo, setChargesInfo] = useState<ChargeInfo[]|null>()
    const [txnsInfo, setTxnsInfo] = useState<TransactionInfo[]|null>()
    useEffect(
        () => {
            getUserInfo(session).then((info) => setAccountInfo(info))
            getAccountInfo(session).then((info) => setUserInfo(info))
            getCharges(session).then((info) => setChargesInfo(info))
            getTransactions(session).then((info) => setTxnsInfo(info))
        },
        []
    )
    return <p>{accountInfo == null ? "Loading..." : accountInfoHtml(
        accountInfo,
        userInfo || null,
        chargesInfo || null,
        txnsInfo || null,
    )}</p>
}

const ProfileOrLogin = () => {
    const [session, setSession] = checkSession()
    if (session) {
        return <AccountInfoComponent session={session}/>
    } else {
        return <Auth setSession={setSession}/>
    }
}

const Profile: NextPage = () => {
    return <>
        <Headers title="Kestrel: Log In"/>
        <Navigation/>
        <div className="section  wf-section">
            <div className="w-container">
                <div className="w-row">
                    <div className="w-col w-col-10">
                        {
                            process.env.NEXT_PUBLIC_PREVIEW_MODE_DISABLED
                                ? <ProfileOrLogin/>
                                : <PreviewOnly/>
                        }
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

export default Profile