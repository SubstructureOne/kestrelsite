import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import { redirect } from "next/navigation";
import { pgconnect } from "@/utils/database";
import { getAccountInfo, getUserInfo, getTransactions } from "@/utils/accounts";
import ProfileContainer from "@/app/profile/ProfileContainer";
import { Headers } from "@/components/Headers";
import { AccountInfoTab } from "@/app/profile/AccountInfoComponent";
import React from "react";
import { KResult } from "@/utils/errors";
import { AllTransactions } from "@/utils/dbtypes";
import Alert from "@/components/Alert";

const TransactionsInfoTab: React.FC<{
    txnsInfo: KResult<AllTransactions> | undefined;
}> = ({ txnsInfo }) => {
    let allTxnInfo;
    if (txnsInfo !== undefined && txnsInfo.isErr) {
        allTxnInfo = <Alert alert={txnsInfo.error.friendly} />;
    } else {
        let internalTxnRows, externalTxnRows;
        if (txnsInfo === undefined) {
            internalTxnRows = "Loading...";
        } else if (txnsInfo.value.internal_txns.length === 0) {
            internalTxnRows = <td colSpan={2}>No recent transactions</td>;
        } else {
            internalTxnRows = txnsInfo.value.internal_txns.map((txn) => (
                <tr key={txn.txn_id}>
                    <td>{new Date(txn.txn_time).toLocaleString()}</td>
                    <td>{txn.amount}</td>
                </tr>
            ));
        }
        if (txnsInfo === undefined) {
            externalTxnRows = "Loading...";
        } else if (txnsInfo.value.external_txns.length === 0) {
            externalTxnRows = <td colSpan={2}>No external transactions</td>;
        } else {
            externalTxnRows = txnsInfo.value.external_txns.map((txn) => (
                <tr key={txn.exttransaction_id}>
                    <td>{txn.exttransaction_time.toLocaleString()}</td>
                    <td>${txn.amount.toFixed(2)}</td>
                </tr>
            ));
        }
        allTxnInfo = (
            <>
                {/*<h2>Recent transactions</h2>*/}
                {/*<table className="min-w-full divide-y-2 divide-gray-200 text-sm">*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        <th scope="col">Time</th>*/}
                {/*        <th scope="col">Amount</th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>{internalTxnRows}</tbody>*/}
                {/*</table>*/}
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
        );
    }
    return <div className="col-span-3 m-4 p-4 min-w-full">{allTxnInfo}</div>;
};

const Transactions = async () => {
    const cookiesStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookiesStore.get(name)?.value;
            },
        },
    });
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session === null) {
        redirect("/signin");
    }
    const client = await pgconnect();
    if (client.isErr) {
        return <p>Error connecting to database; please try again later.</p>;
    }
    const [userInfo, accountInfo, txnsInfo] = await Promise.all([
        getUserInfo(session),
        getAccountInfo(client.value, session),
        getTransactions(client.value, session),
    ]);
    return (
        <ProfileContainer
            userInfo={userInfo}
            accountInfo={accountInfo}
            selected={"transactions"}
        >
            <Headers title="Kestrel: Profile" />
            <TransactionsInfoTab txnsInfo={txnsInfo} />
        </ProfileContainer>
    );
};

export default Transactions;
