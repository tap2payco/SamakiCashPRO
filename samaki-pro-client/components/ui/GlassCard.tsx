import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { CleanEnterpriseTheme, spacing } from '~/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard = ({ children, style, intensity = 70 }: GlassCardProps) => {
    return (
        <View style={[styles.glassWrapper, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.glassCard}>
                <View style={styles.contentPad}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    glassWrapper: {
        borderRadius: CleanEnterpriseTheme.roundness * 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // fallback
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
    },
    contentPad: {
        padding: spacing.lg,
    }
});
