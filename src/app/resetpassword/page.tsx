import React from "react";

import ResetPasswordComponent from "./ResetPasswordComponent";
import { Headers } from "@/components/Headers";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
    return (
        <>
            <Headers title="Kestrel: Log In" />
            <Navigation />
            <ResetPasswordComponent />
            <Footer />
        </>
    );
}
