import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CleanEnterpriseTheme, spacing } from '~/theme';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
    status: StatusType;
    label: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
    const getColors = () => {
        switch (status) {
            case 'success':
                return { bg: CleanEnterpriseTheme.colors.successContainer, text: CleanEnterpriseTheme.colors.success };
            case 'warning':
                return { bg: CleanEnterpriseTheme.colors.warningContainer, text: CleanEnterpriseTheme.colors.warning };
            case 'error':
                return { bg: 'rgba(214, 40, 40, 0.1)', text: CleanEnterpriseTheme.colors.error };
            case 'info':
                return { bg: CleanEnterpriseTheme.colors.infoContainer, text: CleanEnterpriseTheme.colors.info };
            default:
                return { bg: CleanEnterpriseTheme.colors.surfaceVariant, text: CleanEnterpriseTheme.colors.onSurfaceVariant };
        }
    };

    const colors = getColors();

    return (
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.text, { color: colors.text }]}>
                {label.toUpperCase()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: CleanEnterpriseTheme.roundness,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
});
