import {createClient, Session} from "@supabase/supabase-js"
import { Dispatch, SetStateAction, useEffect, useState } from 'react'


const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function useSession(): [Session|null, Dispatch<SetStateAction<Session|null>>] {
    const [session, setSession] = useState<Session|null>(null)
    useEffect(
        () => {
            supabase.auth.getSession().then(({data}) => setSession(data.session))
        },
        []
    )
    return [session, setSession]
}


