import { createBrowserClient } from '@supabase/ssr';
import {Session} from "@supabase/supabase-js";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );


export function useSession(): [Session|null, Dispatch<SetStateAction<Session|null>>] {
    const [session, setSession] = useState<Session|null>(null);
    useEffect(
        () => {
            const client = createClient();
            client.auth.getSession().then(({data}) => setSession(data.session));
        },
        []
    );
    return [session, setSession];
}
