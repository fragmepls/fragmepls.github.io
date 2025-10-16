import React, {useEffect, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/Header.css";

const Header: React.FC = () => {
    const location = useLocation();
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                if (window.scrollY > 50) {
                    navRef.current.classList.add("fade-out");
                } else {
                    navRef.current.classList.remove("fade-out");
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="header-nav" ref={navRef}>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
            <div className="theme-toggle-container">
                <ThemeToggle/>
            </div>
        </nav>
    );
};

export default Header;
