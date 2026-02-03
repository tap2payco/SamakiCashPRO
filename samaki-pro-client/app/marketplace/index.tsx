import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Card, Text, FAB, ActivityIndicator, Chip, Avatar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

export default function MarketplaceScreen() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchListings = async () => {
        try {
            setLoading(true);
            const data = await api.get('/marketplace/listings');
            setListings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => router.push(`/marketplace/${item.id}`)} mode="elevated">
            <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} style={styles.cardCover} />
            <Card.Content style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <Text variant="titleMedium" style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Chip icon="check-decagram" compact style={styles.badge} textStyle={{ fontSize: 10, marginVertical: 0, marginHorizontal: 4 }}>Verified</Chip>
                </View>

                <Text variant="bodySmall" style={styles.description} numberOfLines={2}>{item.description}</Text>

                <View style={styles.detailsRow}>
                    <View style={styles.sellerInfo}>
                        <Avatar.Text size={24} label={item.seller?.fullName?.substring(0, 1) || 'F'} style={{ backgroundColor: '#00609C' }} />
                        <Text variant="labelSmall" style={styles.sellerName}>{item.seller?.fullName || 'Unknown Farmer'}</Text>
                    </View>
                    <Text variant="labelSmall" style={{ color: '#666' }}>{item.seller?.location || 'Mwanza'}</Text>
                </View>

                <View style={styles.priceRow}>
                    <View>
                        <Text variant="labelSmall" style={{ color: '#666' }}>Price per {item.unit}</Text>
                        <Text variant="titleLarge" style={styles.price}>{parseInt(item.price).toLocaleString()} TZS</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text variant="labelSmall" style={{ color: '#666' }}>Available</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.quantity} {item.unit}</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>Marketplace</Text>
                <IconButton icon="filter-variant" onPress={() => { }} />
            </View>

            <FlatList
                data={listings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                onRefresh={fetchListings}
                refreshing={loading}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>No listings available</Text>}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push('/marketplace/create')}
                label="Sell Stock"
                color="white"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', elevation: 2 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 15, paddingBottom: 80 },

    card: { marginBottom: 15, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
    cardCover: { height: 140 },
    cardContent: { paddingTop: 12 },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    title: { fontWeight: 'bold', flex: 1, marginRight: 10, fontSize: 18 },
    badge: { backgroundColor: '#E0F2F1', height: 24 },

    description: { color: '#666', marginBottom: 12, lineHeight: 18 },

    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    sellerInfo: { flexDirection: 'row', alignItems: 'center' },
    sellerName: { marginLeft: 8, fontWeight: '500' },

    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { color: '#00609C', fontWeight: 'bold' },

    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#FFA000' },
});
