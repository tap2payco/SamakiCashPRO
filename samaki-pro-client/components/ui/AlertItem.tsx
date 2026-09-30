import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';
import StatusBadge, { BadgeStatus } from './StatusBadge';
import SourceTag, { SourceType } from './SourceTag';

interface AlertItemProps {
    status: 'critical' | 'watch' | 'note';
    title: string;
    description: string;
    source?: SourceType;
    sourceTimestamp?: string;
    onAcknowledge?: () => void;
    isAcknowledged?: boolean;
    style?: any;
}

export const AlertItem: React.FC<AlertItemProps> = ({
    status,
    title,
    description,
    source = 'sensor',
    sourceTimestamp,
    onAcknowledge,
    isAcknowledged = false,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    const getStatusTheme = () => {
        switch (status) {
            case 'critical':
                return {
                    icon: 'alert-decagram-outline',
                    iconColor: colors.critical,
                    badgeStatus: 'critical' as BadgeStatus,
                };
            case 'watch':
                return {
                    icon: 'alert-outline',
                    iconColor: colors.watch,
                    badgeStatus: 'watch' as BadgeStatus,
                };
            case 'note':
            default:
                return {
                    icon: 'information-outline',
                    iconColor: colors.note,
                    badgeStatus: 'note' as BadgeStatus,
                };
        }
    };

    const st = getStatusTheme();

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    padding: spacing.space4,
                },
                style
            ]}
        >
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSunken }]}>
                    <IconButton 
                        icon={st.icon} 
                        size={20} 
                        iconColor={st.iconColor} 
                        style={{ margin: 0 }} 
                    />
                </View>
                <View style={styles.titleArea}>
                    <Text 
                        style={[
                            styles.titleText, 
                            { color: colors.ink, fontSize: typography.heading.fontSize }
                        ]}
                    >
                        {title}
                    </Text>
                    <View style={{ marginTop: spacing.space1 }}>
                        <StatusBadge status={st.badgeStatus} size="sm" />
                    </View>
                </View>
            </View>

            <Text 
                style={[
                    styles.descText, 
                    { 
                        color: colors.inkMuted, 
                        fontSize: typography.body.fontSize,
                        marginVertical: spacing.space3,
                    }
                ]}
            >
                {description}
            </Text>

            <View style={styles.footerRow}>
                <SourceTag source={source} timestamp={sourceTimestamp} />

                {onAcknowledge && (
                    <TouchableOpacity
                        onPress={onAcknowledge}
                        disabled={isAcknowledged}
                        style={[
                            styles.ackBtn,
                            {
                                borderColor: isSunMode ? colors.borderStrong : colors.border,
                                borderWidth: isSunMode ? 2 : 1,
                                borderRadius: radii.md,
                                backgroundColor: isAcknowledged ? colors.surfaceSunken : colors.surfaceCard,
                            }
                        ]}
                    >
                        <Text 
                            style={[
                                styles.ackText, 
                                { 
                                    color: isAcknowledged ? colors.inkMuted : colors.ink,
                                    fontSize: typography.label.fontSize 
                                }
                            ]}
                        >
                            {isAcknowledged 
                                ? (isSw ? 'Imethibitishwa' : 'Acknowledged') 
                                : (isSw ? 'Thibitisha' : 'Acknowledge')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titleArea: {
        flex: 1,
    },
    titleText: {
        fontWeight: '700',
        lineHeight: 24,
    },
    descText: {
        lineHeight: 22,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    ackBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    ackText: {
        fontWeight: '700',
    }
});

export default AlertItem;
