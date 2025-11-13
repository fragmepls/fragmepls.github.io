import React, {useRef} from "react";
import "../styles/Pages.css";
import "../styles/About.css";
import "../styles/Social.css";
import {DvdBounce} from "../components/DvdBounce";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import Typewriter from "typewriter-effect";
import {SEO} from "../components/SEO";

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLElement>(null);

    useIntersectionObserver([section1Ref], {threshold: 0.5});

    return (
        <>
            <SEO
                title="fragmepls - About"
                description="Learn more about me and the projects I work on"
                keywords="about, developer, portfolio"
                path="/about"
            />
            <div ref={containerRef} className="home-container no-scroll">
                <DvdBounce/>
                <section className="fade-in-section first-section" ref={section1Ref}>
                    <h1>
                        <Typewriter
                            options={{
                                strings: ["I like coding"],
                                autoStart: true,
                                loop: false,
                                delay: 80,
                                cursor: "|",
                                deleteSpeed: Infinity
                            }}
                        />
                    </h1>
                    <ul className="social small">
                        <li>
                            <a target="_blank" rel="noopener noreferrer"
                               href="https://github.com/fragmepls">
                                <i className="fab fa-github icon"></i>
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </>
    );
};

export default About;
