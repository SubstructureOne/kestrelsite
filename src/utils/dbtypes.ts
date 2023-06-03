export type AccountInfo = {
    user_id: string,
    pg_name: string,
    user_status: string,
    balance: number,
    status_synced: boolean,
    created_at: Date,
    updated_at: Date,
}

export type ChargeInfo = {
    charge_id: string,
    charge_time: Date,
    user_id: string,
    charge_type: string,
    quantity: number,
    rate: number,
    amount: number,
    report_ids: number[],
    transacted: boolean
}

export type TransactionInfo = {
    txn_id: number,
    txn_time: Date,
    from_user: string,
    to_user: string,
    charge_ids: number[],
    amount: number
}

export type NewExternalTransactionInfo =  {
    user_id: string,
    amount: number,
    exttxn_time: Date,
    exttxn_extid: string,
}

export type NewUserInfo = {
    user_id: string,
    pg_name: string,
}