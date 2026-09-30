import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

export type BadgeStatus = 'ok' | 'watch' | 'critical' | 'note' | 'no-reading' | 'degraded' | 'default';

interface StatusBadgeProps {
    status: BadgeStatus | string;
    label?: string;
    size?: 'sm' | 'md';
    style?: any;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md', style }) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const normalizedStatus = (status || '').toLowerCase();

    const getStatusConfig = () => {
        switch (normalizedStatus) {
            case 'ok':
            case 'success':
            case 'salama':
                return {
                    text: label || (language === 'sw' ? 'Salama' : 'OK'),
                    icon: 'check-circle-outline',
                    textColor: isSunMode ? colors.ok : colors.ok,
                    bgColor: isSunMode ? '#ffffff' : colors.okWash,
                    borderColor: isSunMode ? colors.ok : colors.okFill,
                    borderStyle: 'solid' as const,
                };
            case 'watch':
            case 'warning':
            case 'pending':
            case 'angalia':
                return {
                    text: label || (language === 'sw' ? 'Angalia' : 'Watch'),
                    icon: 'alert-outline',
                    textColor: isSunMode ? colors.watch : colors.watch,
                    bgColor: isSunMode ? '#ffffff' : colors.watchWash,
                    borderColor: isSunMode ? colors.watch : colors.watchFill,
                    borderStyle: 'solid' as const,
                };
            case 'critical':
            case 'error':
            case 'failed':
            case 'hatari':
                return {
                    text: label || (language === 'sw' ? 'Hatari' : 'Critical'),
                    icon: 'close-circle-outline',
                    textColor: isSunMode ? colors.critical : colors.critical,
                    bgColor: isSunMode ? '#ffffff' : colors.criticalWash,
                    borderColor: isSunMode ? colors.critical : colors.criticalFill,
                    borderStyle: 'solid' as const,
                };
            case 'note':
            case 'info':
            case 'in transit':
            case 'kumbuka':
                return {
                    text: label || (language === 'sw' ? 'Kumbuka' : 'Note'),
                    icon: 'information-outline',
                    textColor: isSunMode ? colors.note : colors.note,
                    bgColor: isSunMode ? '#ffffff' : colors.noteWash,
                    borderColor: isSunMode ? colors.note : colors.noteFill,
                    borderStyle: 'solid' as const,
                };
            case 'no-reading':
            case 'no reading':
            case 'degraded':
            case 'hakuna kipimo':
            case 'hakuna_kipimo':
            default:
                return {
                    text: label || (language === 'sw' ? 'Hakuna kipimo' : 'No reading'),
                    icon: 'circle-outline',
                    textColor: colors.inkMuted,
                    bgColor: isSunMode ? '#ffffff' : 'transparent',
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderStyle: 'dashed' as const,
                };
        }
    };

    const config = getStatusConfig();
    const isSm = size === 'sm';

    return (
        <View 
            style={[
                styles.badge,
                {
                    backgroundColor: config.bgColor,
                    borderColor: config.borderColor,
                    borderStyle: config.borderStyle,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.pill,
                    paddingHorizontal: isSm ? spacing.space2 : spacing.space3,
                    paddingVertical: isSm ? 2 : 4,
                },
                style
            ]}
        >
            <IconButton
                icon={config.icon}
                size={isSm ? 13 : 15}
                iconColor={config.textColor}
                style={styles.iconStyle}
            />
            <Text 
                style={[
                    styles.text,
                    {
                        color: config.textColor,
                        fontSize: isSm ? typography.caption.fontSize : typography.label.fontSize,
                        fontWeight: '700',
                    }
                ]}
            >
                {config.text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    iconStyle: {
        margin: 0,
        marginRight: -2,
        marginLeft: -4,
        padding: 0,
        width: 18,
        height: 18,
    },
    text: {
        marginLeft: 4,
    }
});

export default StatusBadge;
