import React, {useRef, useState} from "react";
import "../styles/Pages.css";
import "../styles/Home.css";
import "../styles/Social.css";
import {DvdBounce} from "../components/DvdBounce";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import Typewriter from "typewriter-effect";
import UserInputForm from "../components/UserInputForm";

const Home: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLElement>(null);
    const [showInput, setShowInput] = useState(false);

    useIntersectionObserver([section1Ref], {threshold: 0.5});

    return (
        <div ref={containerRef} className="home-container no-scroll">
            <DvdBounce/>
            <section className="fade-in-section first-section" ref={section1Ref}>
                <div className="content-wrapper">
                    {showInput ? (
                        <UserInputForm/>
                    ) : (
                        <h1>
                            <Typewriter
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString("Welcome")
                                        .pauseFor(1000)
                                        .deleteAll()
                                        .callFunction(() => {
                                            setShowInput(true);
                                        })
                                        .start();
                                }}
                                options={{
                                    cursor: "|",
                                    delay: 80,
                                }}
                            />
                        </h1>
                    )}
                </div>
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
    );
};

export default Home;
