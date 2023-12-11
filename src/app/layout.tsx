import "../styles/globals.css";
import {ReactNode} from "react";
import {Metadata} from "next";

export default function RootLayout({children}: {children: ReactNode}) {
    return <html lang="en">
        <body>{children}</body>
    </html>;
}

export const metadata: Metadata = {
    description: "Substructure Kestrel is the platform for Open Source Software as a Service",
};
