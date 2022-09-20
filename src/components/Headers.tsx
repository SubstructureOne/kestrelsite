import React, { FunctionComponent, useEffect } from 'react'
// import WebFont from 'webfontloader'

type HeadersProps = {
    title: string
}

export const Headers: FunctionComponent<HeadersProps> = ({title}) => {
    useEffect(
        () => {
            const WebFont = require('webfontloader')
            WebFont.load({
                google: {
                    families: [
                        "Vollkorn:400,400italic,700,700italic",
                        "Roboto Condensed:300,regular,700",
                        "Roboto:300,regular,500"
                    ]
                }
            })
        },
        []
    )
    return <>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content="Substructure Kestrel is the platform for Open Source Software as a Service" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/kestrel.webflow.css" rel="stylesheet" type="text/css" />
        <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="/images/webclip.png" rel="apple-touch-icon" />

    </>
}
