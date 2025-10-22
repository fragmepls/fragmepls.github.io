import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import InteractiveBlockGrid from "./components/InteractiveBlockGrid";
import Header from "./components/Header.tsx";
import {ThemeProvider} from "./context/ThemeProvider";
import "./App.css";
import logo from "../public/galaxy.svg"

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
    <ThemeProvider>
        <Router>
            <InteractiveBlockGrid
                imageToTrace={logo}
                traceThreshold={150}  // Optional: controls darkness threshold
                traceDensity={1.5}    // Optional: controls block density
            />
            <Header/>
            <ScrollToTop/>
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                </Routes>
            </main>
        </Router>
    </ThemeProvider>
);

export default App;
