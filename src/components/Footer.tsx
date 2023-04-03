const Footer = () => {
    return <div className="section footer wf-section">
        <div className="w-container px-10">
            <div className="w-row">
                <div className="w-clearfix w-col w-col-4">
                    {/*<img*/}
                    {/*    src="/images/stone-logo.svg"*/}
                    {/*    width="20"*/}
                    {/*    alt=""*/}
                    {/*    className="stone-logo footer"*/}
                    {/*/>*/}
                    <div className="footer-text w-hidden-small w-hidden-tiny">
                        A <a href="https://substructure.one">Substructure One, LLC</a> Project
                    </div>
                    <div className="footer-text">
                        <a href="termsofuse">Terms & Conditions</a>
                    </div>
                </div>
                <div className="w-col w-col-4">
                    {/*<a href="contact.html" className="button beige footer">get in touch with us</a>*/}
                </div>
                <div className="w-col w-col-4">
                    <div className="footer-text address">
                        <p>Twitter: <a href="https://twitter.com/substructureone">@substructureone</a></p>
                        <p>Github: <a href="https://github.com/SubstructureOne/">SubstructureOne</a></p>
                        <p>Email: <a href="mailto:contact@substructure.one">contact@substructure.one</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Footer
