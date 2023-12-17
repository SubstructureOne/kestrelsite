import { NextPage } from "next";
import Image from "next/image";

import { Headers } from "../../components/Headers";
import { Navigation } from "../../components/Navigation";
import Footer from "../../components/Footer";
import kestrelPhotosScreenshot from "./kestrelphotos_screenshot.png";
import githubLogoLight from "./GitHub-Mark-32px.png";

const Apps: NextPage = () => {
    return (
        <>
            <Headers title="Apps deployed on Kestrel" />
            <Navigation />
            <div className="section grey wf-section">
                <div className="w-container">
                    <h1>List of apps using Kestrel</h1>
                    <div className="horizontal-bar beige"></div>
                </div>
            </div>
            <div className="section wf-section">
                <div className="w-container">
                    <div className="w-row">
                        <div className="w-col w-col-4">
                            <div className="number">001</div>
                            <h2 className="project-title">Kestrel Photos</h2>
                            <p className="project-description">
                                Kestrel Photos is a sample Kestrel app that
                                provides users with the ability to create simple
                                photo albums. All images are encrypted on
                                uploaded, so only individuals that have been
                                provided access to the private key can view
                                them.
                            </p>
                            <a
                                href="https://kestrelphotos.substructure.one"
                                className="button solid"
                                target="_blank"
                            >
                                Launch
                            </a>
                            &nbsp;
                            <a
                                href="https://github.com/SubstructureOne"
                                className="button solid"
                                target="_blank"
                            >
                                <Image
                                    src={githubLogoLight}
                                    alt="Github logo"
                                    style={{ width: 18, height: 18 }}
                                />
                                &nbsp; Source
                            </a>
                        </div>
                        <div className="project-column w-col w-col-8">
                            <Image
                                src={kestrelPhotosScreenshot}
                                alt="Kestrel Photos screenshot"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Apps;
