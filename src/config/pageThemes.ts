export interface PageTheme {
    preferredTheme?: 'light' | 'dark' | null; // null means use global theme
    accentColor?: string;
    backgroundStyle?: 'default' | 'gradient' | 'particles';
}

export const pageThemes: Record<string, PageTheme> = {
    '/': {
        preferredTheme: null,
        backgroundStyle: 'particles',
    },
    '/about': {
        preferredTheme: null,
        backgroundStyle: 'particles',
    },
};
