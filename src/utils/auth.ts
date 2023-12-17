import { NextApiRequest } from "next";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export async function userFromAuthHeader(
    req: NextApiRequest,
): Promise<User | null> {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        const jwt = authHeader?.substring(7);
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(jwt);
        return user;
    }
    return null;
}
