import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

export type SyncState = 'synced' | 'waiting' | 'sending' | 'offline' | 'error';

interface SyncBarProps {
    state?: SyncState;
    count?: number;
    current?: number;
    total?: number;
    time?: string;
    onAction?: () => void;
    style?: any;
}

export const SyncBar: React.FC<SyncBarProps> = ({
    state = 'synced',
    count = 3,
    current = 2,
    total = 3,
    time = '14:32',
    onAction,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    const renderContent = () => {
        switch (state) {
            case 'waiting':
                return (
                    <>
                        <View style={styles.leftRow}>
                            <IconButton 
                                icon="sync" 
                                size={18} 
                                iconColor={colors.ink} 
                                style={styles.iconStyle} 
                            />
                            <Text style={[styles.mainLabel, { color: colors.ink }]}>
                                {isSw ? 'Inasubiri' : 'Waiting to send'}
                            </Text>
                            <View style={[styles.counterPill, { backgroundColor: colors.primary }]}>
                                <Text style={[styles.counterText, { color: colors.onPrimary }]}>
                                    {count}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={[
                                styles.actionButton,
                                { 
                                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                                    borderWidth: isSunMode ? 2 : 1,
                                    backgroundColor: isSunMode ? '#ffffff' : colors.surfaceCard 
                                }
                            ]}
                            onPress={onAction}
                        >
                            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                                {isSw ? 'Tuma sasa' : 'Send now'}
                            </Text>
                        </TouchableOpacity>
                    </>
                );

            case 'sending':
                return (
                    <>
                        <View style={styles.leftRow}>
                            <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />
                            <Text style={[styles.mainLabel, { color: colors.ink }]}>
                                {isSw ? 'Inatuma' : 'Sending'}
                            </Text>
                        </View>
                        <Text style={[styles.statusInfo, { color: colors.inkMuted }]}>
                            {current} {isSw ? 'ya' : 'of'} {total}
                        </Text>
                    </>
                );

            case 'offline':
                return (
                    <>
                        <View style={styles.leftRow}>
                            <IconButton 
                                icon="wifi-off" 
                                size={18} 
                                iconColor={colors.inkMuted} 
                                style={styles.iconStyle} 
                            />
                            <Text style={[styles.mainLabel, { color: colors.ink }]}>
                                {isSw ? 'Nje ya mtandao' : 'Offline'}
                            </Text>
                        </View>
                        <Text style={[styles.statusInfo, { color: colors.inkMuted }]}>
                            {count} {isSw ? 'zimehifadhiwa' : 'saved'}
                        </Text>
                    </>
                );

            case 'error':
                return (
                    <>
                        <View style={styles.leftRow}>
                            <IconButton 
                                icon="alert-circle-outline" 
                                size={18} 
                                iconColor={colors.critical} 
                                style={styles.iconStyle} 
                            />
                            <Text style={[styles.mainLabel, { color: colors.critical }]}>
                                {isSw ? 'Haikuweza kutumwa' : 'Could not send'}
                            </Text>
                            <View style={[styles.counterPill, { backgroundColor: colors.critical }]}>
                                <Text style={[styles.counterText, { color: '#ffffff' }]}>
                                    {count}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={[
                                styles.actionButton,
                                { 
                                    borderColor: isSunMode ? colors.critical : colors.border,
                                    borderWidth: isSunMode ? 2 : 1,
                                    backgroundColor: isSunMode ? '#ffffff' : colors.surfaceCard 
                                }
                            ]}
                            onPress={onAction}
                        >
                            <Text style={[styles.actionButtonText, { color: colors.critical }]}>
                                {isSw ? 'Jaribu tena' : 'Try again'}
                            </Text>
                        </TouchableOpacity>
                    </>
                );

            case 'synced':
            default:
                return (
                    <>
                        <View style={styles.leftRow}>
                            <IconButton 
                                icon="check-circle-outline" 
                                size={18} 
                                iconColor={colors.ok} 
                                style={styles.iconStyle} 
                            />
                            <Text style={[styles.mainLabel, { color: colors.ink }]}>
                                {isSw ? 'Imelandanishwa' : 'Synced'}
                            </Text>
                        </View>
                        <Text style={[styles.statusInfo, { color: colors.inkMuted }]}>
                            {time}
                        </Text>
                    </>
                );
        }
    };

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    paddingHorizontal: spacing.space4,
                },
                style
            ]}
        >
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        margin: 0,
        marginRight: 6,
        padding: 0,
        width: 24,
        height: 24,
    },
    spinner: {
        marginRight: 10,
    },
    mainLabel: {
        fontWeight: '600',
        fontSize: 14,
    },
    counterPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    counterText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statusInfo: {
        fontSize: 13,
        fontWeight: '500',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
    }
});

export default SyncBar;
