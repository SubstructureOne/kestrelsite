"use client"

import {SigninForm} from "../../newcomponents/Auth"
import {Headers} from "../../newcomponents/Headers"
import {Navigation} from "../../newcomponents/Navigation"
import React from "react"
import Footer from "../../components/Footer"

export default function SigninPage() {
    return <>
        <Headers title="Kestrel: Log In"/>
        <Navigation/>
        <SigninForm/>
        <Footer/>
    </>
}