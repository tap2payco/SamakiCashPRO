import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { Text, IconButton, TouchableRipple, Avatar, Button } from 'react-native-paper';
import { Slot, useRouter, usePathname, Redirect } from 'react-native-router-flux'; // wait, it's expo router
import { Stack } from 'expo-router'; // Fix import
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

// Temporary fix from previous thought block string - correctly importing expo-router instead of RNRF
import { Slot as ExpoSlot, useRouter as useExpoRouter, usePathname as useExpoPathname, Redirect as ExpoRedirect } from 'expo-router';

export default function ERPLayout() {
    const { user, logout } = useAuth();
    const router = useExpoRouter();
    const pathname = useExpoPathname();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800 || Platform.OS === 'web';
    
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
    ];

    const filteredLinks = navigationLinks.filter(link => link.roles.includes(user.role));

    const renderSidebar = () => (
        <BlurView intensity={30} tint="light" style={[styles.sidebar, !isDesktop && styles.mobileSidebar, !isDesktop && !mobileMenuOpen && { display: 'none' }]}>
            <View style={styles.brandBox}>
                <Avatar.Icon icon="fish" size={40} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="white" />
                <Text variant="titleLarge" style={styles.brandText}>Samaki ERP</Text>
            </View>

            <ScrollView contentContainerStyle={styles.navScroll}>
                {filteredLinks.map((item, index) => {
                    const isActive = pathname.startsWith(item.route);
                    return (
                        <TouchableRipple 
                            key={index}
                            style={[styles.navItem, isActive && styles.navItemActive]}
                            onPress={() => {
                                router.push(item.route as any);
                                if (!isDesktop) setMobileMenuOpen(false);
                            }}
                        >
                            <View style={styles.navRow}>
                                <IconButton icon={item.icon} size={20} iconColor={isActive ? '#0288D1' : 'white'} style={{ margin: 0 }} />
                                <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.title}</Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </ScrollView>

            <View style={styles.userBox}>
                <Avatar.Icon icon="account" size={36} color="white" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text variant="bodyMedium" style={{ color: 'white', fontWeight: 'bold' }} numberOfLines={1}>{user.fullName || 'User'}</Text>
                    <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.6)' }}>{user.role}</Text>
                </View>
                <IconButton icon="logout" size={20} iconColor="#FF5252" onPress={logout} />
            </View>
        </BlurView>
    );

    return (
        <View style={styles.container}>
            {/* Mobile Header Bar */}
            {!isDesktop && (
                <BlurView intensity={20} tint="light" style={styles.mobileHeader}>
                    <IconButton icon="menu" iconColor="white" onPress={() => setMobileMenuOpen(!mobileMenuOpen)} />
                    <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', flex: 1, paddingLeft: 10 }}>Samaki ERP</Text>
                </BlurView>
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
    mobileHeader: { flexDirection: 'row', alignItems: 'center', height: 60, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    
    bodyFlex: { flex: 1, flexDirection: 'row' },
    
    sidebar: { width: 260, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)', justifyContent: 'space-between' },
    mobileSidebar: { position: 'absolute', zIndex: 100, height: '100%', left: 0, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
    
    brandBox: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    brandText: { color: 'white', fontWeight: 'bold', marginLeft: 15, letterSpacing: 0.5 },
    
    navScroll: { padding: 15 },
    navItem: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 5 },
    navItemActive: { backgroundColor: 'white' },
    navRow: { flexDirection: 'row', alignItems: 'center' },
    navText: { marginLeft: 15, color: 'white', fontWeight: '500', fontSize: 14 },
    navTextActive: { color: '#0288D1', fontWeight: 'bold' },
    
    userBox: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' },
    
    contentArea: { flex: 1, position: 'relative' }
});
