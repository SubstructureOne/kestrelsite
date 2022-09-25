import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'
import {Session} from "@supabase/gotrue-js";
import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'

const Home: NextPage = () => {
    const [session, setSession] = useState<Session|null>(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return <>
        <Headers title="Substructure Kestrel: The Platform for Open Source Software as a Service"/>
        <Navigation/>
        {/*<div className="container" style={{ padding: '50px 0 100px 0' }}>*/}
        {/*    {!session ? <Auth /> : <Account key={session.user?.id} session={session} />}*/}
        {/*</div>*/}
        <div className="slider w-slider">
            <div className="mask w-slider-mask">
                <div className="slide w-slide">
                    <div className="w-container">
                        <h1 className="main-heading">Substructure Kestrel</h1>
                        <h1 className="main-heading bold">Open Source<br/>Software as a Service</h1>
                        <div className="horizontal-bar"></div>
                        <div className="main-subheading">
                            Deploy open source software at scale without upfront fees or upkeep.
                            <br/>
                        </div>
                        <a href="work.html" className="button">Learn How</a>
                    </div>
                </div>
            </div>
            <div className="slider-nav w-slider-nav"></div>
        </div>
        <div className="section beige wf-section">
            <div className="w-container">
                <div className="w-row">
                    <div className="w-col w-col-4">
                        <div className="number">001</div>
                        <div className="process-titles">Open Code, Open Data</div>
                        <div className="icon-wrapper">
                            <img src="/images/lightbulb_white.svg" width="69" alt=""/>
                        </div>
                        <p>
                            Kestrel applications leverage cryptography to allow developers to
                            customize and extend functionality without exposing private data. Apps
                            can be freely forked, tweaked, and repurposed.
                        </p>
                    </div>
                    <div className="w-col w-col-4">
                        <div className="number">002</div>
                        <div className="process-titles">Self-Sustaining</div>
                        <div className="icon-wrapper">
                            <img src="/images/mobile-white.svg" width="95" alt=""/>
                        </div>
                        <p>
                            By utilizing pay-as-you-go pricing mechanisms, developers can deploy
                            arbitrarily complex or data-intensive applications by letting their
                            users pay reasonably for their own usage, and users never have to worry
                            about their favorite services being discontinued.
                        </p>
                    </div>
                    <div className="w-col w-col-4">
                        <div className="number">003</div>
                        <div className="process-titles">Fair Compensation</div>
                        <div className="icon-wrapper">
                            <img src="/images/linegraph_white.svg" width="114" alt=""/>
                        </div>
                        <p>
                            By defining reasonable premiums on top of base-layer service costs,
                            application developers and contributors can be fairly compensated based
                            on the usage and popularity of their app.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className="section image wf-section">
            <div className="w-container">
                <h1>
                    Open source software has revolutionized how software is developed. Kestrel is
                    designed to create new opportunities for open source software to flourish.
                </h1>
                <div className="horizontal-bar beige"></div>
            </div>
        </div>
        <Footer />
    </>
}

export default Home
