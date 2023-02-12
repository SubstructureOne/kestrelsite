import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import { checkSession, supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import {Session} from '@supabase/gotrue-js'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {AccountInfo, ChargeInfo, TransactionInfo} from "../utils/dbtypes"
import {useRouter} from "next/router"

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

function accountInfoTab(accountInfo: AccountInfo | null) {
    return <>
        <div className="w-col w-col-3">
            <h2>Account Info</h2>
            <p>{accountInfo === null ? "Loading..." : <h4>Balance: ${accountInfo.balance.toFixed(2)}</h4>}</p>
            <section>
                <div className="product">
                    <h1
                        style={{borderRadius: "6px", margin: "10px", width: "54px", height: "57px", textAlign: "center"}}
                    >$</h1>
                    <div className="description">
                        <h3>Add $5 to account</h3>
                        <h5>$5.00</h5>
                    </div>
                </div>
                <form action="/api/txns/fund" method="POST">
                    <button type="submit" id="checkout-button">Checkout</button>
                </form>
            </section>
        </div>
        <div className="w-col w-col-3">
            <h2>Postgres Info</h2>
            <h5>Postgres Username: {accountInfo?.pg_name}</h5>
        </div>
    </>
}

function chargesInfoTab(chargesInfo: ChargeInfo[] | null) {
    return <div className="w-col w-col-5">
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
                {chargesInfo === null ? "Loading..." : chargesInfo.map((charge) => <tr>
                    <td>{new Date(charge.charge_time).toLocaleString()}</td>
                    <td>{charge.charge_type}</td>
                    <td>{charge.amount}</td>
                    <td>{charge.transacted.toString()}</td>
                </tr>)}
            </tbody>
        </table>
    </div>
}

function transactionsInfoTab(txnsInfo: TransactionInfo[] | null) {
    return <div className="w-col w-col-5">
        <h2>Recent transactions</h2>
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

}


function accountInfoHtml(
    accountInfo: UserInfo,
    userInfo: AccountInfo | null,
    chargesInfo: ChargeInfo[] | null,
    txnsInfo: TransactionInfo[] | null,
): ReactElement {
    const router = useRouter();
    return <div>
        <div className="sidebar w-col w-col-3">
            <ul>
                <li>
                    <a href="?" className={router.query.page === undefined ? "active" : ""}>
                        <span className="item">Account Info</span>
                    </a>
                </li>
                <li>
                    <a href="?page=transactions" className={router.query.page === "transactions" ? "active" : ""}>
                        <span className="item">Transactions</span>
                    </a>
                </li>
                <li>
                    <a href="?page=charges" className={router.query.page === "charges" ? "active" : ""}>
                        <span className="item">Charges</span>
                    </a>
                </li>
            </ul>
        </div>
        {router.query.page === undefined ? accountInfoTab(userInfo) : null}
        {router.query.page === "transactions" ? transactionsInfoTab(txnsInfo) : null}
        {router.query.page === "charges" ? chargesInfoTab(chargesInfo) : null}
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
                {/*<div className="w-row">*/}
                    {/*<div className="w-col w-col-10">*/}
                        {
                            process.env.NEXT_PUBLIC_PREVIEW_MODE_DISABLED
                                ? <ProfileOrLogin/>
                                : <PreviewOnly/>
                        }
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        </div>
        <Footer/>
    </>
}

export default Profile