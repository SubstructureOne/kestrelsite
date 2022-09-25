import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'

const Profile: NextPage = () => {
    return <>
        <Headers title="Kestrel: Log In"/>
        <Navigation/>
        <div className="section  wf-section">
            <div className="w-container">
                <div className="w-row">
                    <div className="w-col w-col-10">
                        <h2>Preview-Only Mode</h2>
                        <p>
                            Kestrel is currently deployed in preview-only mode, so account
                            creation and login is currently disabled.
                        </p>
                        <p>
                            Follow <a href="https://twitter.com/SubstructureOne" target="_blank">
                                @SubstructureOne
                            </a> on Twitter to get the latest project updates and get notified when the Kestrel
                            substructure goes live for public beta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

export default Profile