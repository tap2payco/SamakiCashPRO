import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { AuthProvider } from '~/contexts/AuthContext';
import GradientBackground from '~/components/GradientBackground';

// Define custom theme
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#0288D1', 
        secondary: '#00E676', 
        tertiary: '#FFA600',
        background: 'transparent',
        surface: 'transparent',
        elevation: { level0: 'transparent', level1: 'transparent', level2: 'transparent', level3: 'transparent', level4: 'transparent', level5: 'transparent' } as any
    },
};

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <ThemeProvider value={navTheme}>
                <AuthProvider>
                    <GradientBackground>
                        <Stack 
                            screenOptions={{ 
                                headerShown: false,
                                contentStyle: { backgroundColor: 'transparent' },
                                animation: 'fade'
                            }} 
                        >
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(erp)" />
                        </Stack>
                    </GradientBackground>
                </AuthProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({});
