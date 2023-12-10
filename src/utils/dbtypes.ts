export type AccountInfo = {
    user_id: string,
    pg_name: string,
    user_status: string,
    balance: number,
    status_synced: boolean,
    created_at: string,
    updated_at: string,
    pg_password: string,
};

export type ChargeInfo = {
    charge_id: string,
    charge_time: string,
    user_id: string,
    charge_type: string,
    quantity: number,
    rate: number,
    amount: number,
    report_ids: number[],
    transacted: boolean
};

export type TransactionInfo = {
    txn_id: number,
    txn_time: string,
    from_user: string,
    to_user: string,
    charge_ids: number[],
    amount: number
};

export type NewExternalTransactionInfo =  {
    user_id: string,
    amount: number,
    exttxn_time: string,
    exttxn_extid: string,
};

export type ExternalTransactionInfo = {
    exttransaction_id: number,
    user_id: string,
    amount: number,
    exttransaction_time: string,
    exttransaction_extid: string,
};

export type AllTransactions = {
    external_txns: ExternalTransactionInfo[],
    internal_txns: TransactionInfo[],
};

export type NewUserInfo = {
    user_id: string,
    pg_name: string,
    pg_password: string,
};
