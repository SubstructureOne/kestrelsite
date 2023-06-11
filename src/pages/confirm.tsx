import {NextPage} from "next"
import {Headers} from "../components/Headers"
import {Navigation} from "../components/Navigation"
import Footer from "../components/Footer"
import {useEffect, useRef, useState} from "react"
import {getExternalTransactions, pgconnect} from "../utils/database"
import {Client} from "pg"
import {useSession} from "../utils/supabaseClient"
import {AllTransactions} from "../utils/dbtypes"


type Callback = () => void

function useInterval(callback: Callback, delay: number) {
    const savedCallback = useRef<Callback>();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        function tick() {
            if (savedCallback.current !== undefined) {
                savedCallback.current()
            }
        }
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
const ConfirmPayment: NextPage = () => {
    const [session, setSession] = useSession()
    let moreRecentThan = new Date()
    moreRecentThan.setHours(moreRecentThan.getHours() - 1)
    useInterval(() => {
        if (session !== null && session.user !== null) {
            fetch(
                `/api/txns/${session.user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    }
                }
            )
                .then(response => response.json())
                .then(transactions => {
                    console.log(`External transactions: ${JSON.stringify(transactions)}`)
                    if ((transactions as AllTransactions).external_txns.filter(txn => txn.exttransaction_time > moreRecentThan).length > 0) {
                        window.location = "/profile"
                    }
                })
        }
            // getExternalTransactions(client, session.user.id).then(transactions => {
            //     if (transactions.filter(txn => moreRecentThan).length > 0) {
            //         window.location = "/profile"
            //     }
            // })
        // }
    }, 1000)
    return <>
        <Headers title="Kestrel Substructure: Confirm Payment"/>
        <Navigation/>
        <div className="max-w-2xl mx-auto my-16 grid grid-cols-1 place-items-center">
            <div className="w-[25vh] h-[25vh] rounded-full animate-spin border-8 border-solid border-blue-500 border-t-transparent">
            </div>
            <div className="my-10">Confirming payment...</div>
        </div>
        <Footer/>
    </>
}

export default ConfirmPayment
