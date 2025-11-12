import React, {useMemo, useEffect, type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {useTheme} from '../hooks/useTheme';
import {pageThemes} from '../config/pageThemes';
import {ThemeContext} from './ThemeContext';

const ThemeProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const {theme, themeSource, toggleTheme, resetToSystemTheme} = useTheme();
    const location = useLocation();

    const pageTheme = useMemo(() => pageThemes[location.pathname] || pageThemes['/'], [location.pathname]);

    useEffect(() => {
        if (pageTheme.accentColor) {
            document.documentElement.style.setProperty('--color-accent', pageTheme.accentColor);
        }
        document.documentElement.setAttribute('data-background', pageTheme.backgroundStyle || 'default');
    }, [pageTheme]);

    useEffect(() => {
        if (pageTheme.preferredTheme && themeSource !== 'user') {
            document.documentElement.setAttribute('data-theme', pageTheme.preferredTheme);
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [pageTheme, themeSource, theme]);

    const effectiveTheme = (pageTheme.preferredTheme && themeSource !== 'user')
        ? pageTheme.preferredTheme
        : theme;

    const value = {
        theme: effectiveTheme,
        themeSource,
        toggleTheme,
        resetToSystemTheme,
        accentColor: pageTheme.accentColor || '#default-accent',
        backgroundStyle: pageTheme.backgroundStyle || 'default'
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
