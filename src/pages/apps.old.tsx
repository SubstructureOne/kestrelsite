import { NextPage } from 'next'
import { Headers } from '../components/Headers'
import { Navigation } from '../components/Navigation'
import Footer from '../components/Footer'

const Apps: NextPage = () => {
    return <>
        <Headers title="Apps deployed on Kestrel"/>
        <Navigation/>
        <div className="section grey wf-section">
            <div className="w-container">
                <h1>List of apps using Kestrel</h1>
                <div className="horizontal-bar beige"></div>
                {/*<div className="subheading">Submit your own here.</div>*/}
            </div>
        </div>
        <div className="section wf-section">
            <div className="w-container">
                <div className="w-row">
                    <div className="w-col w-col-4">
                        <div className="number">001</div>
                        <h2 className="project-title">Kestrel Photos</h2>
                        <p className="project-description">
                            Kestrel Photos is a sample Kestrel app that provides users with the
                            ability to create simple photo albums. All images are encrypted on
                            uploaded, so only individuals that have been provided access to the
                            private key can view them.
                        </p>
                        {/*<div className="tag-wrapper w-clearfix">*/}
                        {/*    <img src="/images/tag-icon-black.svg" alt="" className="tag-icon"/>*/}
                        {/*    <div className="tag-title">Web Design</div>*/}
                        {/*    <img src="/images/tag-icon-black.svg" alt="" className="tag-icon"/>*/}
                        {/*    <div className="tag-title">Icon Design</div>*/}
                        {/*</div>*/}
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
                            <img src="/images/GitHub-Mark-32px.png" height="20px" alt="" />
                            &nbsp;
                            Source
                        </a>
                    </div>
                    <div className="project-column w-col w-col-8">
                        <img
                            src="/images/kestrelphotos_screenshot.png"
                            alt="Kestrel Photos screenshot"
                        />
                    </div>
                </div>
            </div>
        </div>
        {/*<div className="section lightgrey wf-section">*/}
        {/*    <div className="w-container">*/}
        {/*        <div className="w-row">*/}
        {/*            <div className="project-column w-col w-col-8">*/}
        {/*                <img*/}
        {/*                    src="images/Project.jpg"*/}
        {/*                    sizes="(max-width: 767px) 92vw, (max-width: 991px) 478.65625px, 619.984375px"*/}
        {/*                    srcSet="images/Project-p-500x288.jpeg 500w, images/Project-p-800x460.jpeg 800w, images/Project.jpg 940w"*/}
        {/*                    alt=""*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="w-col w-col-4">*/}
        {/*                <div className="number">002</div>*/}
        {/*                <h2 className="project-title">Comet Skateboards</h2>*/}
        {/*                <p className="project-description">Vestibulum sed commodo nunc, eu aliquet sem. Curabitur*/}
        {/*                    semper, sem ut posuere tincidunt, sem velit sollicitudin odio, quis hendrerit sapien nunc*/}
        {/*                    sit amet sem. .</p>*/}
        {/*                <div className="tag-wrapper w-clearfix">*/}
        {/*                    <img src="images/tag-icon-black.svg" alt="" className="tag-icon"/>*/}
        {/*                    <div className="tag-title">Web Design</div>*/}
        {/*                    <img src="images/tag-icon-black.svg" alt="" className="tag-icon"/>*/}
        {/*                    <div className="tag-title">Icon Design</div>*/}
        {/*                </div>*/}
        {/*                <a href="project.html" className="button solid">VIEW PROJECT</a>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <Footer/>
    </>
}

export default Apps
