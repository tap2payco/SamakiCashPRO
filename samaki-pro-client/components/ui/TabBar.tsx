import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

export type TabKey = 'home' | 'lake' | 'cages' | 'alerts' | 'more';

interface TabBarProps {
    activeTab: TabKey;
    onTabPress: (tab: TabKey) => void;
    alertsCount?: number;
    style?: any;
}

export const TabBar: React.FC<TabBarProps> = ({
    activeTab,
    onTabPress,
    alertsCount = 0,
    style
}) => {
    const { colors, typography, radii, sizes, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: 'home', label: isSw ? 'Mwanzo' : 'Home', icon: 'view-grid-outline' },
        { key: 'lake', label: isSw ? 'Ziwa' : 'Lake', icon: 'water-outline' },
        { key: 'cages', label: isSw ? 'Vizimba' : 'Cages', icon: 'fish' },
        { key: 'alerts', label: isSw ? 'Tahadhari' : 'Alerts', icon: 'bell-outline' },
        { key: 'more', label: isSw ? 'Zaidi' : 'More', icon: 'dots-horizontal' },
    ];

    return (
        <View 
            style={[
                styles.container,
                {
                    height: sizes.tabBarHeight,
                    backgroundColor: colors.surfaceCard,
                    borderTopColor: isSunMode ? colors.borderStrong : colors.border,
                    borderTopWidth: isSunMode ? 2 : 1,
                },
                style
            ]}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabPress(tab.key)}
                        style={styles.tabItem}
                        activeOpacity={0.8}
                    >
                        <View 
                            style={[
                                styles.iconPill,
                                isActive && {
                                    borderColor: colors.primary,
                                    borderWidth: isSunMode ? 2 : 1.5,
                                    borderRadius: radii.pill,
                                    backgroundColor: isSunMode ? '#ffffff' : colors.primaryWash,
                                }
                            ]}
                        >
                            <IconButton
                                icon={tab.icon}
                                size={22}
                                iconColor={isActive ? colors.primary : colors.inkMuted}
                                style={{ margin: 0, padding: 0 }}
                            />
                            {tab.key === 'alerts' && alertsCount > 0 && (
                                <View style={[styles.badgeDot, { backgroundColor: colors.critical }]} />
                            )}
                        </View>
                        <Text
                            style={[
                                styles.tabLabel,
                                {
                                    color: isActive ? colors.primary : colors.inkMuted,
                                    fontSize: typography.caption.fontSize,
                                    fontWeight: isActive ? '700' : '500',
                                }
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconPill: {
        paddingHorizontal: 16,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    badgeDot: {
        position: 'absolute',
        top: 2,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tabLabel: {
        marginTop: 2,
    }
});

export default TabBar;
