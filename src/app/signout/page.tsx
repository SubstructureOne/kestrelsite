"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";
import { useEffect } from "react";

export default function Signout() {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const router = useRouter();
    useEffect(() => {
        supabase.auth.signOut().then(() => router.push("/signin"));
    }, [supabase.auth, router]);
    return "Signing out...";
}
