import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { 
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { ThemeProvider, DefaultTheme as NavigationLightTheme } from '@react-navigation/native';
import { AuthProvider } from '~/contexts/AuthContext';
import GradientBackground from '~/components/GradientBackground';
import { CleanEnterpriseTheme } from '~/theme';

const navTheme = {
    ...NavigationLightTheme,
    colors: {
        ...NavigationLightTheme.colors,
        background: 'transparent',
    },
};

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <PaperProvider theme={CleanEnterpriseTheme}>
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
