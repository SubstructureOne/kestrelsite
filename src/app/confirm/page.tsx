"use client";

import { NextPage } from "next";
import { Headers } from "../../components/Headers";
import { Navigation } from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useEffect, useRef } from "react";
import { AllTransactions } from "../../utils/dbtypes";
import { useSession } from "../../utils/supabase/client";

type Callback = () => void;

function useInterval(callback: Callback, delay: number) {
    const savedCallback = useRef<Callback>();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        function tick() {
            if (savedCallback.current !== undefined) {
                savedCallback.current();
            }
        }
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
const ConfirmPayment: NextPage = () => {
    const [session] = useSession();
    let moreRecentThan = new Date();
    moreRecentThan.setHours(moreRecentThan.getHours() - 1);
    useInterval(() => {
        if (session !== null && session.user !== null) {
            fetch(`/api/txns/${session.user.id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            })
                .then((response) => response.json())
                .then((transactions) => {
                    if (
                        (transactions as AllTransactions).external_txns.filter(
                            (txn) =>
                                new Date(txn.exttransaction_time) >
                                moreRecentThan,
                        ).length > 0
                    ) {
                        (window as Window).location = "/profile";
                    }
                });
        }
    }, 1000);
    return (
        <>
            <Headers title="Kestrel Substructure: Confirm Payment" />
            <Navigation />
            <div className="max-w-2xl mx-auto my-16 grid grid-cols-1 place-items-center">
                <div className="w-[25vh] h-[25vh] rounded-full animate-spin border-8 border-solid border-blue-500 border-t-transparent"></div>
                <div className="my-10">Confirming payment...</div>
            </div>
            <Footer />
        </>
    );
};

export default ConfirmPayment;
