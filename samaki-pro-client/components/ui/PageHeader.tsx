import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';
import ThemeToggle from './ThemeToggle';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    locationChip?: string;
    categoryChip?: string;
    unreadAlertsCount?: number;
    onNotificationsPress?: () => void;
    style?: any;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    locationChip,
    categoryChip,
    unreadAlertsCount = 0,
    onNotificationsPress,
    style
}) => {
    const { colors, typography, radii, spacing, isSunMode } = useAppTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.topRow}>
                <View style={styles.titleArea}>
                    {subtitle && (
                        <Text 
                            style={[
                                styles.subtitle, 
                                { color: colors.inkMuted, fontSize: typography.caption.fontSize }
                            ]}
                            numberOfLines={1}
                        >
                            {subtitle}
                        </Text>
                    )}
                    <Text 
                        style={[
                            styles.title, 
                            { 
                                color: colors.ink, 
                                fontSize: typography.title.fontSize,
                                lineHeight: typography.title.lineHeight,
                            }
                        ]} 
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <ThemeToggle variant="header" />
                    <TouchableOpacity
                        onPress={onNotificationsPress}
                        style={[
                            styles.bellBtn,
                            {
                                borderColor: isSunMode ? colors.borderStrong : colors.border,
                                borderWidth: isSunMode ? 2 : 1,
                                borderRadius: radii.md,
                                backgroundColor: colors.surfaceCard,
                                marginLeft: spacing.space2,
                            }
                        ]}
                    >
                        <IconButton
                            icon="bell-outline"
                            size={20}
                            iconColor={colors.ink}
                            style={{ margin: 0, padding: 0 }}
                        />
                        {unreadAlertsCount > 0 && (
                            <View 
                                style={[
                                    styles.unreadBadge, 
                                    { backgroundColor: colors.critical }
                                ]} 
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {(locationChip || categoryChip) && (
                <View style={[styles.chipsRow, { marginTop: spacing.space2 }]}>
                    {locationChip && (
                        <View 
                            style={[
                                styles.chip, 
                                {
                                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                                    borderWidth: isSunMode ? 2 : 1,
                                    borderRadius: radii.pill,
                                    backgroundColor: colors.surfaceCard,
                                    marginRight: spacing.space2,
                                }
                            ]}
                        >
                            <IconButton 
                                icon="map-marker-outline" 
                                size={14} 
                                iconColor={colors.ink} 
                                style={{ margin: 0, padding: 0, width: 16, height: 16 }} 
                            />
                            <Text style={[styles.chipText, { color: colors.ink }]}>{locationChip}</Text>
                        </View>
                    )}
                    {categoryChip && (
                        <View 
                            style={[
                                styles.chip, 
                                {
                                    borderRadius: radii.pill,
                                    backgroundColor: colors.primary,
                                    borderWidth: isSunMode ? 1 : 0,
                                    borderColor: colors.borderStrong,
                                }
                            ]}
                        >
                            <Text style={[styles.chipText, { color: colors.onPrimary, fontWeight: '700' }]}>
                                {categoryChip}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleArea: {
        flex: 1,
        marginRight: 12,
    },
    subtitle: {
        fontWeight: '500',
        marginBottom: 2,
    },
    title: {
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    unreadBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    chipsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    }
});

export default PageHeader;
