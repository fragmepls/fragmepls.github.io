import React, {useRef} from "react";
import "../styles/Pages.css";
import "../styles/About.css";
import "../styles/Social.css";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import {useTypewriter} from "../hooks/useTypewriter";

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLElement>(null);
    const section2Ref = useRef<HTMLElement>(null);
    const section3Ref = useRef<HTMLElement>(null);
    const section4Ref = useRef<HTMLElement>(null);

    useIntersectionObserver([section1Ref, section2Ref, section3Ref, section4Ref], {threshold: 0.5});

    const typewriterText = useTypewriter("Welcome to the About Page", 50);

    return (
        <div ref={containerRef} className="home-container">
            <section className="fade-in-section first-section" ref={section1Ref}>
                <h1>{typewriterText}</h1>
                <ul className="social small">
                    <li>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/fragmepls">
                            <i className="fab fa-github icon"></i>
                        </a>
                    </li>
                </ul>
            </section>
            <section className="fade-in-section" ref={section2Ref}>
                <h2>Section 2</h2>
                <p>Test content</p>
            </section>
            <section className="fade-in-section" ref={section3Ref}>
                <h2>Section 3</h2>
                <p>Test content</p>
            </section>
        </div>
    );
};

export default About;
