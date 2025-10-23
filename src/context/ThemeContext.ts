import {createContext, useContext} from 'react';

export type Theme = 'light' | 'dark';
export type ThemeSource = 'user' | 'system';

export interface ThemeContextType {
    theme: Theme;
    themeSource: ThemeSource;
    toggleTheme: () => void;
    resetToSystemTheme: () => void;
    accentColor: string;
    backgroundStyle: string;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
