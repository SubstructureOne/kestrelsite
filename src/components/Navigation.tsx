import { FunctionComponent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type NavigationProps = {
}

export const Navigation: FunctionComponent<NavigationProps> = () => {
    const router = useRouter()
    const defaultClasses = "nav-link w-nav-link"
    const profileClasses = "nav-link w-inline-block social-icons"
    const socialIcons = profileClasses + " w-hidden-small w-hidden-tiny"
    const currentTabAppend = " w--current"
    const [docsClasses, setDocsClasses] = useState(defaultClasses)
    const [appsClasses, setAppsClasses] = useState(defaultClasses)
    useEffect(
        () => {
            if (!router.isReady) return;
            console.log(`Pathname: ${router.pathname}`)
            switch (router.pathname) {
                case "/docs":
                    setDocsClasses(defaultClasses + currentTabAppend)
                    break
                case "/apps":
                    setAppsClasses(defaultClasses + currentTabAppend)
                    break
                // case "/contact":
                //     setContactClasses(defaultClasses + currentTabAppend)
                //     break
            }
        },
        [router.isReady],
    )
    return <div role="banner" className="navbar w-nav">
        <div className="w-container">
            <a href="/" className="brand w-clearfix w-nav-brand w--current">
                <img
                    src="/images/kestrel_transparent.png"
                    width="75"
                    srcSet="/images/kestrel_transparent-p-500.png 500w, /images/kestrel_transparent.png 508w"
                    sizes="75px"
                    alt=""
                    className="stone-logo"
                />
                <div className="logo-text w-hidden-tiny w-hidden-small">Kestrel</div>
            </a>
            <nav role="navigation" className="nav-menu w-nav-menu">
                <a href="https://docs.kestrel.codes" className={docsClasses} target="_blank">Docs</a>
                <a href="/apps" className={appsClasses}>Apps</a>
                {/*<a href="/contact" className={contactClasses}>Contact</a>*/}
                {/*<a*/}
                {/*    href="#"*/}
                {/*    className="nav-link w-hidden-main w-hidden-medium w-hidden-small w-hidden-tiny w-nav-link"*/}
                {/*>*/}
                {/*    Facebook*/}
                {/*</a>*/}
                <a
                    href="#"
                    className="nav-link w-hidden-main w-hidden-medium w-hidden-small w-hidden-tiny w-nav-link"
                >
                    Twitter
                </a>
            </nav>
            <a
                href="/profile"
                className={profileClasses}
            >
                <img src="/images/profile-icon-white.png" width="15" alt="" />
            </a>
            <a
                href="https://www.twitter.com/substructureone"
                className={socialIcons}
                target="_blank"
            >
                <img src="/images/twitter-icon.svg" width="16" alt="" />
            </a>
            <a
                href="https://github.com/SubstructureOne"
                className={socialIcons}
                target="_blank"
            >
                <img src="/images/GitHub-Mark-Light-32px.png" width="15" alt="" />
            </a>
            <div className="menu-button w-nav-button">
                <div className="menu-icon w-icon-nav-menu"></div>
            </div>
        </div>
    </div>
}

