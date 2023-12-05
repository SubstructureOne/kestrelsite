"use client"

import {cookies} from "next/headers"
import {createBrowserClient, createServerClient} from "@supabase/ssr"
import {supabaseAnonKey, supabaseUrl} from "../../utils/supabaseClient"
import {redirect} from "next/navigation"

export default async function Signout() {
    const supabase = createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
    );
    await supabase.auth.signOut();
    console.log("User is signed out");
    console.log(`Session: ${JSON.stringify(await supabase.auth.getSession())}`)
    redirect("/");
    return <>
    Hi</>
}