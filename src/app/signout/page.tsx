"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";

export default function Signout() {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const router = useRouter();
    supabase.auth.signOut().then(() => router.push("/"));
    return "Signing out...";
}
