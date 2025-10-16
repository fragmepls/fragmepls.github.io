import React, {useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext.ts';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
