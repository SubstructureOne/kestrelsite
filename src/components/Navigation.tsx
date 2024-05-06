"use client";

import { FunctionComponent } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import kestrelTransparent from "../images/kestrel_transparent.png";
import profileIconWhite from "../images/profile-icon-white.png";
import twitterIcon from "../images/twitter-icon.svg";
import githubLight from "../images/GitHub-Mark-Light-32px.png";

type NavigationProps = {};

export const Navigation: FunctionComponent<NavigationProps> = () => {
    const pathname = usePathname();
    const defaultClasses = "nav-link w-nav-link";
    const profileClasses = "nav-link w-inline-block social-icons";
    const socialIcons = profileClasses + " w-hidden-small w-hidden-tiny";
    const currentTabAppend = " w--current";

    const docsClasses =
        pathname === "/docs"
            ? defaultClasses + currentTabAppend
            : defaultClasses;
    return (
        <div role="banner" className="navbar w-nav">
            <div className="w-container">
                <a href="/" className="brand w-clearfix w-nav-brand w--current">
                    <Image
                        src={kestrelTransparent}
                        alt="Kestrel logo"
                        className="stone-logo"
                        style={{ width: 75, height: 30 }}
                    />
                    <div className="logo-text w-hidden-tiny w-hidden-small">
                        Kestrel
                    </div>
                </a>
                <nav role="navigation" className="nav-menu w-nav-menu">
                    <a
                        href="https://docs.kestrelcodes.com"
                        className={docsClasses}
                        target="_blank"
                    >
                        Docs
                    </a>
                    <a
                        href="#"
                        className="nav-link w-hidden-main w-hidden-medium w-hidden-small w-hidden-tiny w-nav-link"
                    >
                        Twitter
                    </a>
                </nav>
                <a href="/profile" className={profileClasses}>
                    Profile&nbsp;
                    <Image
                        src={profileIconWhite}
                        style={{ width: 15, height: 15 }}
                        alt="Profile icon"
                    />
                </a>
                <a
                    href="https://www.twitter.com/substructureone"
                    className={socialIcons}
                    target="_blank"
                >
                    <Image
                        src={twitterIcon}
                        style={{ width: 16, height: 16 }}
                        alt="Twitter icon"
                    />
                </a>
                <a
                    href="https://github.com/SubstructureOne"
                    className={socialIcons}
                    target="_blank"
                >
                    <Image
                        src={githubLight}
                        style={{ width: 15, height: 15 }}
                        alt="Github icon"
                    />
                </a>
                <div className="menu-button w-nav-button">
                    <div className="menu-icon w-icon-nav-menu"></div>
                </div>
            </div>
        </div>
    );
};
