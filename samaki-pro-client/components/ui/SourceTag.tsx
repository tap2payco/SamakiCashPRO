import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

export type SourceType = 'manual' | 'sensor' | 'satellite' | 'demo';

interface SourceTagProps {
    source: SourceType;
    timestamp?: string;
    style?: any;
}

export const SourceTag: React.FC<SourceTagProps> = ({ source, timestamp, style }) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const getSourceConfig = () => {
        switch (source) {
            case 'sensor':
                return {
                    label: language === 'sw' ? 'Kihisi' : 'Sensor',
                    icon: 'access-point',
                    color: colors.srcSensor,
                    isDashed: false,
                };
            case 'satellite':
                return {
                    label: language === 'sw' ? 'Setilaiti' : 'Satellite',
                    icon: 'satellite-variant',
                    color: colors.srcSatellite,
                    isDashed: false,
                };
            case 'demo':
                return {
                    label: language === 'sw' ? 'Data ya majaribio' : 'Demo data',
                    icon: undefined,
                    color: colors.inkMuted,
                    isDashed: true,
                };
            case 'manual':
            default:
                return {
                    label: language === 'sw' ? 'Mkono' : 'Manual',
                    icon: 'hand-back-right-outline',
                    color: colors.srcManual,
                    isDashed: false,
                };
        }
    };

    const config = getSourceConfig();

    return (
        <View style={[styles.container, style]}>
            <View 
                style={[
                    styles.tagBadge,
                    {
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderStyle: config.isDashed ? 'dashed' : 'solid',
                        borderWidth: isSunMode ? 2 : 1,
                        borderRadius: radii.pill,
                        backgroundColor: isSunMode ? '#ffffff' : 'transparent',
                    }
                ]}
            >
                {config.icon && (
                    <IconButton
                        icon={config.icon}
                        size={14}
                        iconColor={config.color}
                        style={styles.iconStyle}
                    />
                )}
                <Text 
                    style={[
                        styles.tagText,
                        {
                            color: config.color,
                            fontSize: typography.caption.fontSize,
                            fontWeight: '600',
                        }
                    ]}
                >
                    {config.label}
                </Text>
            </View>

            {timestamp && (
                <Text 
                    style={[
                        styles.timestampText,
                        {
                            color: colors.inkMuted,
                            fontSize: typography.caption.fontSize,
                            marginLeft: spacing.space2,
                        }
                    ]}
                >
                    {timestamp}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8,
        height: 24,
    },
    iconStyle: {
        margin: 0,
        marginRight: -4,
        marginLeft: -4,
        padding: 0,
        width: 18,
        height: 18,
    },
    tagText: {
        marginLeft: 4,
    },
    timestampText: {
        fontWeight: '400',
    }
});

export default SourceTag;
