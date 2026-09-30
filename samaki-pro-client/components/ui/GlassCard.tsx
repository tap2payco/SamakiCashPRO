import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '~/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    elevation?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
    children, 
    style, 
    intensity = 60,
}) => {
    const { colors, radii, spacing, shadows, isSunMode, isNightMode } = useAppTheme();

    if (isSunMode) {
        return (
            <View 
                style={[
                    styles.solidSunCard,
                    {
                        backgroundColor: '#ffffff',
                        borderColor: colors.borderStrong,
                        borderWidth: 2,
                        borderRadius: radii.lg,
                        padding: spacing.space4,
                    },
                    style
                ]}
            >
                {children}
            </View>
        );
    }

    return (
        <View 
            style={[
                styles.glassWrapper, 
                {
                    borderRadius: radii.lg,
                    borderColor: colors.border,
                    ...shadows,
                },
                style
            ]}
        >
            <BlurView 
                intensity={intensity} 
                tint={isNightMode ? 'dark' : 'light'} 
                style={[
                    styles.glassCard,
                    {
                        backgroundColor: isNightMode ? 'rgba(21, 28, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                    }
                ]}
            >
                <View style={[styles.contentPad, { padding: spacing.space4 }]}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

export const Card = GlassCard;

const styles = StyleSheet.create({
    glassWrapper: {
        overflow: 'hidden',
        borderWidth: 1,
    },
    glassCard: {
        width: '100%',
    },
    solidSunCard: {
        overflow: 'hidden',
    },
    contentPad: {
        width: '100%',
    }
});

export default GlassCard;
