import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, List, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export default function MyOrdersScreen() {
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
            const data = await api.get(`/orders/buyer/${user?.id}`);
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#E8F5E9';
            case 'PENDING': return '#FFF3E0';
            case 'CANCELLED': return '#FFEBEE';
            default: return '#F5F5F5';
        }
    };

    const renderOrder = ({ item }: { item: any }) => (
        <Card style={styles.card} mode="outlined">
            <Card.Content>
                <View style={styles.headerRow}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.listing?.title}</Text>
                    <Chip
                        style={{ backgroundColor: getStatusColor(item.status), height: 28 }}
                        textStyle={{ fontSize: 11, lineHeight: 12 }}>
                        {item.status}
                    </Chip>
                </View>
                <Divider style={{ marginVertical: 8 }} />
                <View style={styles.row}>
                    <Text variant="bodyMedium">Quantity: {item.quantity} {item.listing?.unit}</Text>
                    <Text variant="titleSmall" style={{ color: '#00609C' }}>
                        {parseInt(item.totalAmount).toLocaleString()} TZS
                    </Text>
                </View>
                <Text variant="bodySmall" style={{ color: '#666', marginTop: 5 }}>
                    ID: {item.id.substring(0, 8)} • {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>My Purchases</Text>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>
                            You haven't purchased anything yet.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    header: { fontWeight: 'bold', marginBottom: 20, color: '#00609C' },
    card: { marginBottom: 15, borderRadius: 8, borderColor: '#EEE' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }
});
