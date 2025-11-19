import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";

import "./App.css";
import logo from "./galaxy.svg";
import logo_1 from "./galaxy_1.svg";
import Header from "./components/Header";
import InteractiveBlockGrid from "./components/InteractiveBlockGrid";
import ThemeProvider from "./context/ThemeProvider";
import About from "./pages/About";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Footer from "./components/Footer";
import {SEO} from "./components/SEO";

const ScrollToTop: React.FC = () => {
    const location = useLocation();
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
    }, [location]);
    return null;
};

const App: React.FC = () => (
    <>
        <SEO
            title="fragmepls - Home"
            description="Personal portfolio and projects showcase of fragmepls"
            keywords="portfolio, web development, react, typescript"
            path="/"
        />
        <Router>
            <ThemeProvider>
                <InteractiveBlockGrid
                    imageToTrace={Math.random() > 0.5 ? logo : logo_1}
                    traceThreshold={150}
                    traceDensity={1.5}
                />
                <Header/>
                <ScrollToTop/>
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/privacy" element={<PrivacyPolicy/>}/>
                    </Routes>
                </main>
                <Footer/>
            </ThemeProvider>
        </Router>
    </>
);

export default App;
