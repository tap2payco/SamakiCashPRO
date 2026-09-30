import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton, TouchableRipple, Avatar } from 'react-native-paper';
import { Slot as ExpoSlot, useRouter as useExpoRouter, usePathname as useExpoPathname, Redirect as ExpoRedirect } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '~/theme';
import ThemeToggle from '~/components/ui/ThemeToggle';

export default function ERPLayout() {
    const { user, logout } = useAuth();
    const router = useExpoRouter();
    const pathname = useExpoPathname();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800 || Platform.OS === 'web';
    const { colors, radii, isSunMode, language, setLanguage } = useAppTheme();
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!user) {
        return <ExpoRedirect href="/auth/login" />;
    }

    const navigationLinks = [
        { title: 'Dashboard', route: '/dashboard', icon: 'view-dashboard', roles: ['FARMER', 'VENDOR', 'ADMIN'] },
        { title: 'Production Inventory', route: '/production/cages', icon: 'water', roles: ['FARMER', 'ADMIN'] },
        { title: 'B2B Marketplace', route: '/commerce/marketplace', icon: 'store', roles: ['FARMER', 'VENDOR', 'ADMIN'] },
        { title: 'Escrow Logistics', route: '/commerce/orders', icon: 'truck-fast', roles: ['FARMER', 'VENDOR', 'ADMIN'] },
        { title: 'Vendor Operations', route: '/logistics', icon: 'shield-account', roles: ['VENDOR', 'ADMIN'] },
        { title: 'Cold Chain Assets', route: '/fintech/assets', icon: 'solar-panel-large', roles: ['VENDOR', 'ADMIN'] },
        { title: 'Micro-Insurance', route: '/fintech/insurance', icon: 'shield-check', roles: ['FARMER', 'ADMIN'] },
        { title: 'Design System', route: '/design-system', icon: 'palette-swatch-outline', roles: ['FARMER', 'VENDOR', 'ADMIN'] },
    ];

    const filteredLinks = navigationLinks.filter(link => link.roles.includes(user.role));

    const renderSidebar = () => (
        <View 
            style={[
                styles.sidebar, 
                {
                    backgroundColor: colors.surfaceCard,
                    borderRightColor: isSunMode ? colors.borderStrong : colors.border,
                    borderRightWidth: isSunMode ? 2 : 1,
                },
                !isDesktop && styles.mobileSidebar, 
                !isDesktop && !mobileMenuOpen && { display: 'none' }
            ]}
        >
            <View 
                style={[
                    styles.brandBox, 
                    { 
                        borderBottomColor: isSunMode ? colors.borderStrong : colors.border,
                        borderBottomWidth: 1,
                    }
                ]}
            >
                <Avatar.Icon 
                    icon="fish" 
                    size={40} 
                    style={{ backgroundColor: colors.primaryWash }} 
                    color={colors.primary} 
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text variant="titleMedium" style={[styles.brandText, { color: colors.ink }]}>Samaki Pro</Text>
                    <Text style={{ fontSize: 11, color: colors.inkMuted }}>Lake Victoria ERP</Text>
                </View>
                <ThemeToggle variant="header" />
            </View>

            <ScrollView contentContainerStyle={styles.navScroll}>
                {filteredLinks.map((item, index) => {
                    const isActive = pathname.startsWith(item.route);
                    return (
                        <TouchableRipple 
                            key={index}
                            style={[
                                styles.navItem, 
                                {
                                    borderRadius: radii.md,
                                    backgroundColor: isActive 
                                        ? (isSunMode ? colors.primaryWash : colors.primaryWash) 
                                        : 'transparent',
                                    borderColor: isActive 
                                        ? (isSunMode ? colors.borderStrong : colors.primary) 
                                        : 'transparent',
                                    borderWidth: isActive ? 1 : 0,
                                }
                            ]}
                            onPress={() => {
                                router.push(item.route as any);
                                if (!isDesktop) setMobileMenuOpen(false);
                            }}
                        >
                            <View style={styles.navRow}>
                                <IconButton 
                                    icon={item.icon} 
                                    size={20} 
                                    iconColor={isActive ? colors.primary : colors.inkMuted} 
                                    style={{ margin: 0 }} 
                                />
                                <Text 
                                    style={[
                                        styles.navText, 
                                        { 
                                            color: isActive ? colors.primary : colors.ink,
                                            fontWeight: isActive ? '700' : '500',
                                        }
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </ScrollView>

            <View 
                style={[
                    styles.userBox, 
                    { 
                        borderTopColor: isSunMode ? colors.borderStrong : colors.border,
                        borderTopWidth: 1,
                        backgroundColor: colors.surfaceSunken,
                    }
                ]}
            >
                <Avatar.Icon 
                    icon="account" 
                    size={36} 
                    color={colors.primary} 
                    style={{ backgroundColor: colors.primaryWash }} 
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text 
                        variant="bodyMedium" 
                        style={{ color: colors.ink, fontWeight: '700' }} 
                        numberOfLines={1}
                    >
                        {user.fullName || 'User'}
                    </Text>
                    <Text variant="labelSmall" style={{ color: colors.inkMuted }}>{user.role}</Text>
                </View>
                <IconButton icon="logout" size={20} iconColor={colors.critical} onPress={logout} />
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.surfacePage }]}>
            {/* Mobile Header Bar */}
            {!isDesktop && (
                <View 
                    style={[
                        styles.mobileHeader, 
                        {
                            backgroundColor: colors.surfaceCard,
                            borderBottomColor: isSunMode ? colors.borderStrong : colors.border,
                            borderBottomWidth: isSunMode ? 2 : 1,
                        }
                    ]}
                >
                    <IconButton icon="menu" iconColor={colors.ink} onPress={() => setMobileMenuOpen(!mobileMenuOpen)} />
                    <Text variant="titleMedium" style={{ color: colors.ink, fontWeight: '800', flex: 1, paddingLeft: 10 }}>
                        Samaki Pro
                    </Text>
                    <ThemeToggle variant="header" />
                </View>
            )}

            <View style={styles.bodyFlex}>
                {renderSidebar()}
                <View style={styles.contentArea}>
                    <ExpoSlot />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mobileHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 60, 
        paddingHorizontal: 12, 
    },
    bodyFlex: { flex: 1, flexDirection: 'row' },
    sidebar: { 
        width: 270, 
        justifyContent: 'space-between',
        zIndex: 50,
    },
    mobileSidebar: { 
        position: 'absolute', 
        zIndex: 100, 
        height: '100%', 
        left: 0, 
        shadowColor: '#000', 
        shadowOffset: { width: 4, height: 0 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 10 
    },
    brandBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
    },
    brandText: { 
        fontWeight: '800', 
        letterSpacing: 0.2 
    },
    navScroll: { padding: 12 },
    navItem: { 
        paddingVertical: 10, 
        paddingHorizontal: 12, 
        marginBottom: 4 
    },
    navRow: { flexDirection: 'row', alignItems: 'center' },
    navText: { marginLeft: 12, fontSize: 14 },
    userBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 14, 
    },
    contentArea: { flex: 1, position: 'relative' }
});
