import React, { createContext, useContext, useState, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { 
    themeColors, 
    spacing, 
    radii, 
    sizes, 
    shadows, 
    typography, 
    dictionary,
    ThemeMode, 
    Language, 
    ColorTokens 
} from './tokens';

export * from './tokens';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    colors: ColorTokens;
    spacing: typeof spacing;
    radii: typeof radii;
    sizes: typeof sizes;
    shadows: typeof shadows.light;
    typography: typeof typography;
    t: typeof dictionary['en'];
    isSunMode: boolean;
    isNightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const fontConfig = {
    displayLarge: { fontFamily: 'Inter_900Black', fontWeight: '900', fontSize: 57, letterSpacing: 0, lineHeight: 64 },
    displayMedium: { fontFamily: 'Inter_800ExtraBold', fontWeight: '800', fontSize: 45, letterSpacing: 0, lineHeight: 52 },
    displaySmall: { fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 36, letterSpacing: 0, lineHeight: 44 },
    headlineLarge: { fontFamily: 'Inter_700Bold', fontWeight: '700', fontSize: 32, letterSpacing: 0, lineHeight: 40 },
    headlineMedium: { fontFamily: 'Inter_600SemiBold', fontWeight: '600', fontSize: 28, letterSpacing: 0, lineHeight: 36 },
    titleLarge: { fontFamily: 'Inter_600SemiBold', fontWeight: '600', fontSize: 22, letterSpacing: 0, lineHeight: 28 },
    titleMedium: { fontFamily: 'Inter_500Medium', fontWeight: '500', fontSize: 16, letterSpacing: 0.15, lineHeight: 24 },
    labelLarge: { fontFamily: 'Inter_600SemiBold', fontWeight: '600', fontSize: 14, letterSpacing: 0.1, lineHeight: 20 },
    bodyLarge: { fontFamily: 'Inter_400Regular', fontWeight: '400', fontSize: 16, letterSpacing: 0.15, lineHeight: 24 },
    bodyMedium: { fontFamily: 'Inter_400Regular', fontWeight: '400', fontSize: 14, letterSpacing: 0.25, lineHeight: 20 },
} as const;

export function createPaperTheme(mode: ThemeMode) {
    const c = themeColors[mode];
    const baseTheme = mode === 'night' ? MD3DarkTheme : MD3LightTheme;

    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: c.primary,
            onPrimary: c.onPrimary,
            primaryContainer: c.primaryWash,
            onPrimaryContainer: c.primary,
            secondary: c.tint,
            onSecondary: c.onTint,
            background: c.surfacePage,
            onBackground: c.ink,
            surface: c.surfaceCard,
            onSurface: c.ink,
            surfaceVariant: c.surfaceSunken,
            onSurfaceVariant: c.inkMuted,
            outline: c.border,
            error: c.critical,
            onError: '#FFFFFF',
            elevation: {
                level0: 'transparent',
                level1: c.surfaceCard,
                level2: c.surfaceSunken,
                level3: c.border,
                level4: c.borderStrong,
                level5: c.inkMuted,
            }
        },
        fonts: configureFonts({ config: fontConfig }),
        roundness: radii.md,
    };
}

export const CleanEnterpriseTheme = createPaperTheme('light');

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('light');
    const [language, setLanguage] = useState<Language>('en');

    const toggleTheme = () => {
        setMode(prev => {
            if (prev === 'light') return 'night';
            if (prev === 'night') return 'sun';
            return 'light';
        });
    };

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'sw' : 'en'));
    };

    const colors = themeColors[mode];
    const t = dictionary[language];
    const currentShadow = shadows[mode];

    return (
        <ThemeContext.Provider value={{
            mode,
            setMode,
            toggleTheme,
            language,
            setLanguage,
            toggleLanguage,
            colors,
            spacing,
            radii,
            sizes,
            shadows: currentShadow,
            typography,
            t,
            isSunMode: mode === 'sun',
            isNightMode: mode === 'night',
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useAppTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback default if used outside Provider
        return {
            mode: 'light',
            setMode: () => {},
            toggleTheme: () => {},
            language: 'en',
            setLanguage: () => {},
            toggleLanguage: () => {},
            colors: themeColors.light,
            spacing,
            radii,
            sizes,
            shadows: shadows.light,
            typography,
            t: dictionary.en,
            isSunMode: false,
            isNightMode: false,
        };
    }
    return context;
}
