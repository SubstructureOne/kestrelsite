"use client";

import {SigninForm} from "../../components/Auth";
import {Headers} from "../../components/Headers";
import {Navigation} from "../../components/Navigation";
import React from "react";
import Footer from "../../components/Footer";

export default function SigninPage() {
    return <>
        <Headers title="Kestrel: Log In"/>
        <Navigation/>
        <SigninForm/>
        <Footer/>
    </>;
}