import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Define custom theme
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#00609C', // Deep Blue for "Blue Economy"
        secondary: '#00A8E8', // Light Blue for water
        tertiary: '#FFA600', // Gold/Orange for fish/prosperity
    },
};

export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Samaki PRO', headerShown: false }} />
            </Stack>
        </PaperProvider>
    );
}
