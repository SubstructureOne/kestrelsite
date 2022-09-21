import { FunctionComponent } from 'react'

type NavigationProps = {
}

export const Navigation: FunctionComponent<NavigationProps> = () => {
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
                <div className="logo-text">Kestrel</div>
            </a>
            <nav role="navigation" className="nav-menu w-nav-menu">
                <a href="/" className="nav-link w-nav-link w--current">Docs</a>
                <a href="/apps" className="nav-link w-nav-link">Apps</a>
                <a href="/contact" className="nav-link w-nav-link">Contact</a>
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
                href="http://www.twitter.com/substructureone"
                className="nav-link social-icons w-hidden-medium w-hidden-small w-hidden-tiny w-inline-block"
            >
                <img src="/images/twitter-icon.svg" width="16" alt="" />
            </a>
            <a
                href="https://github.com/SubstructureOne"
                className="nav-link social-icons w-hidden-medium w-hidden-small w-hidden-tiny w-inline-block"
            >
                <img src="/images/GitHub-Mark-Light-32px.png" width="15" alt="" />
            </a>
            <div className="menu-button w-nav-button">
                <div className="menu-icon w-icon-nav-menu"></div>
            </div>
        </div>
    </div>
}

