import {redirect} from "next/navigation";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { Headers } from '../../components/Headers';
import { Navigation } from '../../components/Navigation';
import Footer from '../../components/Footer';
import {supabaseUrl, supabaseAnonKey} from '../../utils/supabaseClient';
import AccountInfoComponent from "./AccountInfoComponent";
import React from "react"


const PreviewOnly = () => {
    return <>
        <h2>Preview-Only Mode</h2>
        <p>
            Kestrel is currently deployed in preview-only mode, so account
            creation and login is currently disabled.
        </p>
        <p>
            Follow <a href="https://twitter.com/SubstructureOne" target="_blank">
            @SubstructureOne
        </a> on Twitter to get the latest project updates and get notified when
            the Kestrel substructure goes live for public beta.
        </p>
    </>
}


const Profile = async () => {
    // const {data} = await supabase.auth.getSession();
    // const session = data.session;
    const cookiesStore = cookies();
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookiesStore.get(name)?.value;
                }
            }
        }
    );
    const {data} = await supabase.auth.getSession();
    const session = data.session;
    console.log(`My session is ${JSON.stringify(session)}`)
    if (session === null) {
        redirect("/signin");
    }
    const title = "Kestrel: Profile";
    return <>
        <Headers title={title}/>
        <Navigation/>
        {
            process.env.NEXT_PUBLIC_PREVIEW_MODE_DISABLED
                ? <AccountInfoComponent session={session}/>
                : <PreviewOnly/>
        }
        <Footer/>
    </>
}

export default Profile