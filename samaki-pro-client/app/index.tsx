import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, TouchableRipple, useTheme, IconButton, Button, Avatar } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: 'Marketplace',
            subtitle: 'Buy Fish Stock',
            icon: 'store',
            route: '/marketplace',
            color: '#E3F2FD', // Light Blue
            iconColor: '#1976D2',
            roles: ['VENDOR', 'BUYER', 'ADMIN', undefined] // Public/Vendor
        },
        {
            title: 'My Orders',
            subtitle: 'Track Purchases',
            icon: 'receipt',
            route: '/orders',
            color: '#E0F7FA', // Cyan
            iconColor: '#006064',
            roles: ['VENDOR', 'BUYER']
        },
        {
            title: 'Vendor Hub',
            subtitle: 'Manage Orders',
            icon: 'truck-delivery',
            route: '/vendor',
            color: '#FFF3E0', // Light Orange
            iconColor: '#F57C00',
            roles: ['VENDOR']
        },
        {
            title: 'My Farm', // Alias for Farmer Dashboard? 
            // For now, redirect to Create Listing or a Farmer specific page
            subtitle: 'Sell Stock',
            icon: 'fish',
            route: '/marketplace/create',
            color: '#E8F5E9', // Light Green
            iconColor: '#388E3C',
            roles: ['FARMER']
        },
        {
            title: 'Insights',
            subtitle: 'Market Intelligence',
            icon: 'chart-line',
            route: '/farmer', // Placeholder
            color: '#F3E5F5', // Light Purple
            iconColor: '#7B1FA2',
            roles: ['FARMER', 'ADMIN']
        }
    ];

    const filteredItems = menuItems.filter(item => {
        if (!user) return item.roles.includes(undefined);
        return item.roles.includes(user.role) || item.roles.includes(undefined);
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Samaki PRO</Text>
                        <Text variant="titleMedium" style={{ color: '#666', marginTop: 5 }}>
                            {user ? `Welcome, ${user.fullName?.split(' ')[0]}` : "Empowering Mwanza's Blue Economy"}
                        </Text>
                    </View>
                    {user ? (
                        <IconButton icon="logout" onPress={logout} iconColor={theme.colors.error} />
                    ) : (
                        <Button mode="contained" onPress={() => router.push('/auth/login')} style={{ borderRadius: 20 }}>
                            Login
                        </Button>
                    )}
                </View>

                {!user && (
                    <View style={styles.promoSection}>
                        <Card style={styles.promoCard}>
                            <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} style={styles.promoImage} />
                            <Card.Content>
                                <Text variant="titleLarge" style={{ marginTop: 10, fontWeight: 'bold' }}>Join the Blue Revolution</Text>
                                <Text variant="bodyMedium" style={{ marginTop: 5 }}>Connect directly with buyers and access fair financing.</Text>
                                <Button mode="contained" style={{ marginTop: 15 }} onPress={() => router.push('/auth/register')}>
                                    Get Started
                                </Button>
                            </Card.Content>
                        </Card>
                    </View>
                )}

                <View style={styles.grid}>
                    {filteredItems.map((item, index) => (
                        <Card key={index} style={[styles.card, { backgroundColor: item.color }]} mode="elevated" onPress={() => router.push(item.route as any)}>
                            <TouchableRipple style={styles.cardRipple} borderless>
                                <View style={styles.cardContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                                        <IconButton icon={item.icon} iconColor={item.iconColor} size={32} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>{item.title}</Text>
                                        <Text variant="bodySmall" style={{ color: '#555' }}>{item.subtitle}</Text>
                                    </View>
                                </View>
                            </TouchableRipple>
                        </Card>
                    ))}
                </View>

                <Text variant="bodySmall" style={styles.footer}>Powered by Bun, Elysia & Expo</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollContent: { padding: 20 },
    header: { marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
    card: { width: '48%', marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
    cardRipple: { flex: 1, padding: 15 },
    cardContent: { alignItems: 'flex-start' },
    iconContainer: { borderRadius: 12, marginBottom: 10, marginLeft: -10 },
    textContainer: { marginTop: 5 },
    promoSection: { marginBottom: 30 },
    promoCard: { borderRadius: 16, overflow: 'hidden' },
    promoImage: { height: 150 },
    footer: { textAlign: 'center', color: '#999', marginTop: 10 }
});
