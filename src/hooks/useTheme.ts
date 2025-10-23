import {useState, useEffect} from 'react';
import type {Theme, ThemeSource} from '../context/ThemeContext';

export const useTheme = () => {
    // Determine initial theme and source
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) return savedTheme;

        // First visit: use system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [themeSource, setThemeSource] = useState<ThemeSource>(() =>
        localStorage.getItem('themeSource') as ThemeSource || 'system'
    );

    // Only listen for system changes if we're still using system theme
    useEffect(() => {
        if (themeSource !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeSource]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        localStorage.setItem('themeSource', themeSource);
    }, [theme, themeSource]);

    const toggleTheme = () => {
        setTheme(current => current === 'light' ? 'dark' : 'light');
        setThemeSource('user'); // Mark as user preference once toggled
    };

    const resetToSystemTheme = () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(isDarkMode ? 'dark' : 'light');
        setThemeSource('system');
    };

    return {theme, themeSource, toggleTheme, resetToSystemTheme};
};
