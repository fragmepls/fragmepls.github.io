import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";

import "./App.css";
import logo from "./galaxy.svg";
import Header from "./components/Header";
import InteractiveBlockGrid from "./components/InteractiveBlockGrid";
import ThemeProvider from "./context/ThemeProvider";
import About from "./pages/About";
import Home from "./pages/Home";
import PrivacyPolicy from "./components/PrivacyPolicy";

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
    <Router>
        <ThemeProvider>
            <InteractiveBlockGrid
                imageToTrace={logo}
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
        </ThemeProvider>
    </Router>
);

export default App;
