import { MD3LightTheme, configureFonts } from 'react-native-paper';

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

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const CleanEnterpriseTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#0B2027',    // Deep Navy / Slate
        onPrimary: '#FFFFFF',
        primaryContainer: '#E3F2FD',
        onPrimaryContainer: '#0B2027',
        
        secondary: '#00B4D8',  // Ocean Teal
        onSecondary: '#FFFFFF',
        secondaryContainer: '#CAF0F8',
        onSecondaryContainer: '#03045E',
        
        background: '#F8F9FA', // Off-white/Light grey for contrast
        onBackground: '#212529',
        
        surface: '#FFFFFF',    // Pure white cards
        onSurface: '#212529',
        surfaceVariant: '#E9ECEF',
        onSurfaceVariant: '#495057',
        
        error: '#D62828',
        onError: '#FFFFFF',

        // Semantic additions for ERP
        success: '#2A9D8F',
        onSuccess: '#FFFFFF',
        successContainer: '#D8F3DC',
        onSuccessContainer: '#1B4332',
        
        warning: '#F4A261',
        onWarning: '#FFFFFF',
        warningContainer: '#FFEFD5',
        onWarningContainer: '#783D00',
        
        info: '#4361EE',
        onInfo: '#FFFFFF',
        infoContainer: '#E0E7FF',
        onInfoContainer: '#312E81',
        
        outline: '#DEE2E6',
        elevation: {
            level0: 'transparent',
            level1: '#F8F9FA',
            level2: '#F1F3F5',
            level3: '#E9ECEF',
            level4: '#DEE2E6',
            level5: '#CED4DA',
        }
    },
    fonts: configureFonts({ config: fontConfig }),
    roundness: 12,
};
