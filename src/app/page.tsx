import {Metadata, NextPage} from 'next'
import Image from "next/image";

import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'
import toolsWhiteImage from "../images/tools_white.svg";
import speedometerWhiteImage from "../images/speedometer_white.svg";
import lineGraphImage from "../images/linegraph_white.svg";

export const metadata: Metadata = {
    title: "Kestrel: The Substructure for Open Source Software as a Service",
}

const Home: NextPage = () => {
    return <>
        <Headers title="Kestrel: The Substructure for Open Source Software as a Service"/>
        <Navigation/>
        <div className="slider w-slider">
            <div className="mask w-slider-mask">
                <div className="slide w-slide">
                    <div className="w-container">
                        <h1 className="main-heading">Kestrel Substructure</h1>
                        <h1 className="main-heading bold">Open Source<br/>Software as a Service</h1>
                        <div className="horizontal-bar"></div>
                        <div className="main-subheading">
                            Deploy open source software at scale without upfront fees or upkeep.
                        </div>
                        <a
                            href="https://docs.kestrelcodes.com"
                            className="button"
                            target="_blank"
                        >
                            Learn How
                        </a>
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
                            <Image src={toolsWhiteImage} style={{width: 69, height: 69}} alt="Tools icon"/>
                        </div>
                        <p>
                            Kestrel allows and encourages developers to
                            customize and extend functionality without exposing private data. Apps
                            can be freely forked, tweaked, and repurposed.
                        </p>
                    </div>
                    <div className="w-col w-col-4">
                        <div className="number">002</div>
                        <div className="process-titles">Self-Sustaining</div>
                        <div className="icon-wrapper">
                            <Image src={speedometerWhiteImage} style={{width: 95, height: 95}} alt="Speedometer icon"/>
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
                            <Image src={lineGraphImage} style={{width: 114, height: 114}} alt="Line graph logo"/>
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
