import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, TouchableRipple, useTheme, IconButton } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const theme = useTheme();
    const router = useRouter();

    const menuItems = [
        {
            title: 'Marketplace',
            subtitle: 'Buy & Sell Fish Stock',
            icon: 'store',
            route: '/marketplace',
            color: '#E3F2FD', // Light Blue
            iconColor: '#1976D2'
        },
        {
            title: 'Farmer Portal',
            subtitle: 'Manage Cages & Production',
            icon: 'fish',
            route: '/farmer',
            color: '#E8F5E9', // Light Green
            iconColor: '#388E3C'
        },
        // Future placeholders
        {
            title: 'Vendor Hub',
            subtitle: 'Logistics & Orders',
            icon: 'truck-delivery',
            route: '/vendor', // Placeholder
            color: '#FFF3E0', // Light Orange
            iconColor: '#F57C00'
        },
        {
            title: 'Insights',
            subtitle: 'Market Intelligence',
            icon: 'chart-line',
            route: '/farmer', // Redirect to farmer for now
            color: '#F3E5F5', // Light Purple
            iconColor: '#7B1FA2'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Samaki PRO</Text>
                    <Text variant="titleMedium" style={{ color: '#666', marginTop: 5 }}>Empowering Mwanza's Blue Economy</Text>
                </View>

                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
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

                <View style={styles.promoSection}>
                    <Card style={styles.promoCard}>
                        <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} style={styles.promoImage} />
                        <Card.Content>
                            <Text variant="titleLarge" style={{ marginTop: 10, fontWeight: 'bold' }}>Join the Blue Revolution</Text>
                            <Text variant="bodyMedium" style={{ marginTop: 5 }}>Connect directly with buyers and access fair financing.</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Text variant="bodySmall" style={styles.footer}>Powered by Bun, Elysia & Expo</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    card: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardRipple: {
        flex: 1,
        padding: 15,
    },
    cardContent: {
        alignItems: 'flex-start',
    },
    iconContainer: {
        borderRadius: 12,
        marginBottom: 10,
        marginLeft: -10, // Align icon properly with padding
    },
    textContainer: {
        marginTop: 5,
    },
    promoSection: {
        marginBottom: 20,
    },
    promoCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    promoImage: {
        height: 150,
    },
    footer: {
        textAlign: 'center',
        color: '#999',
        marginTop: 10,
    }
});
