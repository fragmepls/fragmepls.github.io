import React, {useRef} from "react";
import "../styles/Pages.css";
import "../styles/About.css";
import "../styles/Social.css";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import {useTypewriter} from "../hooks/useTypewriter";

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLElement>(null);

    useIntersectionObserver([section1Ref], {threshold: 0.5});

    const typewriterText = useTypewriter("I like coding", 50);

    return (
        <div ref={containerRef} className="home-container no-scroll">
            <section className="fade-in-section first-section" ref={section1Ref}>
                <h1>{typewriterText}</h1>
                <ul className="social small">
                    <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/fragmepls">
                        <i className="fab fa-github icon"></i>
                    </a></li>
                </ul>
            </section>
        </div>
    );
};

export default About;
