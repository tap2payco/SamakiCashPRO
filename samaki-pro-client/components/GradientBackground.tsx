import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
    colors?: [string, string, ...string[]];
}

export default function GradientBackground({ 
    children, 
    style,
    // Default ocean/tech aesthetic
    colors = ['#001a33', '#003366', '#004d99'] 
}: Props) {
    return (
        <LinearGradient
            colors={colors}
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
