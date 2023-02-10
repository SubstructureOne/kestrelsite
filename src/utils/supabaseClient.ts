import {createClient, Session} from "@supabase/supabase-js"
import { Dispatch, SetStateAction, useEffect, useState } from 'react'


const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function checkSession(
    // setSession: Dispatch<SetStateAction<Session|null>>,
): [Session|null, Dispatch<SetStateAction<Session|null>>] {
    const [session, setSession] = useState<Session|null>(null)
    useEffect(
        () => setSession(supabase.auth.session()),
        []
    )
    return [session, setSession]
}


