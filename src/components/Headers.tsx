"use client";

import React, { FunctionComponent, useEffect } from "react";
import Head from "next/head";
// import WebFont from 'webfontloader'

type HeadersProps = {
    title?: string | undefined;
};

export const Headers: FunctionComponent<HeadersProps> = ({ title }) => {
    useEffect(() => {
        const WebFont = require("webfontloader");
        WebFont.load({
            google: {
                families: [
                    "Vollkorn:400,400italic,700,700italic",
                    "Roboto Condensed:300,regular,700",
                    "Roboto:300,regular,500",
                ],
            },
        });
    }, []);
    return (
        <>
            <meta charSet="utf-8" />
            {title !== undefined ? <title>{title}</title> : null}
            <meta
                name="description"
                content="Substructure Kestrel is the platform for Open Source Software as a Service"
            />
            <meta
                content="width=device-width, initial-scale=1"
                name="viewport"
            />
            <meta content="Webflow" name="generator" />
            <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
            <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
            <link
                href="/css/kestrel.webflow.css"
                rel="stylesheet"
                type="text/css"
            />
            <link href="/css/kestrel.css" rel="stylesheet" type="text/css" />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg"
                color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="black" />
            <script src="https://js.stripe.com/v3/" async></script>
        </>
    );
};
