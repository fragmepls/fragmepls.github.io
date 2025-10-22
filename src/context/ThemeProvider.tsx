// src/context/ThemeProvider.tsx
import React, {useState, useEffect} from 'react';
import type {ReactNode} from 'react';
import {ThemeContext, type Theme} from './ThemeContext';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) return savedTheme;

        // If no saved preference, check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        // Update data-theme attribute on document element
        document.documentElement.setAttribute('data-theme', theme);
        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
