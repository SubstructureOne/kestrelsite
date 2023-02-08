import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import { checkSession, supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import {Session} from '@supabase/gotrue-js'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {ReactComponentLike} from "prop-types";
import {UserInfo} from "../utils/dbtypes"

type AccountInfo = {
    email: string
    balance: number
}

async function getAccountInfo(session: Session): Promise<AccountInfo> {
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

async function getUserInfo(session: Session): Promise<UserInfo> {
    const user_id = session.user?.id;
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
    );
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

function accountInfoHtml(accountInfo: AccountInfo, userInfo: UserInfo): ReactElement {
    return <div className="section wf-section">
        <h3>Account: {accountInfo.email}</h3>
        <div className="w-container">
            <div className="w-row">
                <div className="w-col w-col-5">
                    <div className="process-titles">Account Balance</div>
                    <p>{userInfo.balance}</p>
                    <p>Make a deposit</p>
                </div>
                <div className="w-col w-col-5">
                    <div className="process-titles">Recent charges</div>
                    <ul>
                        <li>$12.34</li>
                        <li>$81.34</li>
                        <li>$98.51</li>
                    </ul>
                </div>
                <div className="w-col w-col-5">
                    <p className="process-titles">Recent transactions</p>

                </div>
            </div>
        </div>
    </div>
}

const AccountInfoComponent: FunctionComponent<AccountBalanceComponentArgs> = (
    {session}
) => {
    const [accountInfo, setAccountInfo] = useState<AccountInfo|null>()
    const [userInfo, setUserInfo] = useState<UserInfo|null>()
    useEffect(
        () => {
            getAccountInfo(session).then((info) => setAccountInfo(info))
            getUserInfo(session).then((info) => setUserInfo(info))
        },
        []
    )
    return <p>{accountInfo == null || userInfo == null ? "Loading..." : accountInfoHtml(accountInfo, userInfo)}</p>
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