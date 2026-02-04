import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Avatar, Button, IconButton, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export default function VendorDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            // Fetch orders where the current user is the buyer (as a vendor buying from farmers)
            // or seller (if they are selling to others). 
            // For this MVP, let's assume Vendors BUY from Farmers.
            const data = await api.get(`/orders/buyer/${user?.id}`);
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderOrder = ({ item }: { item: any }) => (
        <Card style={styles.orderCard} mode="elevated">
            <Card.Content>
                <View style={[styles.row, { marginBottom: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar.Icon icon="fish" size={32} style={{ backgroundColor: '#E1F5FE' }} color="#0288D1" />
                        <View style={{ marginLeft: 10 }}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Order #{item.id.substring(0, 6)}</Text>
                            <Text variant="bodySmall" style={{ color: '#666' }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <Chip
                        icon={item.status === 'COMPLETED' ? 'check' : 'clock'}
                        style={{ backgroundColor: item.status === 'COMPLETED' ? '#E8F5E9' : '#FFF3E0' }}
                        textStyle={{ color: item.status === 'COMPLETED' ? 'green' : 'orange', fontSize: 12 }}>
                        {item.status}
                    </Chip>
                </View>

                <Divider style={{ marginVertical: 10 }} />

                <View style={styles.row}>
                    <View>
                        <Text variant="bodyMedium" style={{ fontWeight: '500' }}>{item.listing?.title}</Text>
                        <Text variant="bodySmall" style={{ color: '#666' }}>{item.quantity} {item.listing?.unit} @ {parseInt(item.unitPrice).toLocaleString()} TZS</Text>
                    </View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#00609C' }}>
                        {parseInt(item.totalAmount).toLocaleString()} TZS
                    </Text>
                </View>

                {item.seller && (
                    <View style={[styles.row, { marginTop: 15, backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8 }]}>
                        <Text variant="bodySmall">Seller: {item.seller.fullName}</Text>
                        <Text variant="bodySmall">{item.seller.phone}</Text>
                    </View>
                )}
            </Card.Content>
            <Card.Actions>
                <Button mode="outlined" compact onPress={() => { }}>Track</Button>
                <Button mode="contained" compact onPress={() => { }}>View Details</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>Vendor Hub</Text>
                <IconButton icon="refresh" onPress={fetchOrders} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Stats Section */}
                <View style={styles.statsRow}>
                    <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                        <Card.Content style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#1565C0' }}>{orders.length}</Text>
                            <Text variant="labelMedium" style={{ color: '#1565C0' }}>Total Orders</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                        <Card.Content style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                {orders.filter(o => o.status === 'COMPLETED').length}
                            </Text>
                            <Text variant="labelMedium" style={{ color: '#2E7D32' }}>Completed</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                        <Card.Content style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#EF6C00' }}>
                                {orders.filter(o => o.status === 'PENDING').length}
                            </Text>
                            <Text variant="labelMedium" style={{ color: '#EF6C00' }}>Pending</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Recent Orders</Text>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={renderOrder}
                        keyExtractor={item => item.id}
                        scrollEnabled={false} // Handled by parent ScrollView
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No orders found.</Text>}
                    />
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', elevation: 2 },
    scrollContent: { padding: 20, paddingBottom: 50 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '31%', borderRadius: 12 },
    center: { alignItems: 'center', paddingVertical: 5 },

    sectionTitle: { fontWeight: 'bold', marginBottom: 15, color: '#333' },

    orderCard: { marginBottom: 15, backgroundColor: 'white', borderRadius: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
