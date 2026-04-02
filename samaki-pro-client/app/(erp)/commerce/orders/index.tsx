import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, useWindowDimensions, Platform } from 'react-native';
import { Text, ActivityIndicator, IconButton, Button, Avatar, DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

export default function OrdersScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800 || Platform.OS === 'web';

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const data = await api.get(`/orders/buyer/${user.id}`);
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#FFB74D';
            case 'ESCROW_FUNDED': return '#0288D1';
            case 'SHIPPED': return '#ba68c8';
            case 'DELIVERED': return '#00E676';
            case 'COMPLETED': return '#4CAF50';
            default: return '#9E9E9E';
        }
    };

    // ----------------------------------------------------
    // DESKTOP DATA GRID VIEW (ERP)
    // ----------------------------------------------------
    const renderDesktopGrid = () => (
        <BlurView intensity={20} tint="light" style={styles.gridContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 900 }}>
                    <DataTable>
                        <DataTable.Header style={styles.dtHeader}>
                            <DataTable.Title textStyle={styles.dtTitleText}>Order ID</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Date</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Status</DataTable.Title>
                            <DataTable.Title numeric textStyle={styles.dtTitleText}>Items</DataTable.Title>
                            <DataTable.Title numeric textStyle={styles.dtTitleText}>Escrow Total</DataTable.Title>
                            <DataTable.Title textStyle={[styles.dtTitleText, { paddingLeft: 20 }]}>Action</DataTable.Title>
                        </DataTable.Header>

                        {orders.map((order) => {
                            const statusColor = getStatusColor(order.status);
                            return (
                                <DataTable.Row key={order.id} style={styles.dtRow}>
                                    <DataTable.Cell textStyle={styles.dtCellText}>#{order.id.substring(0, 8).toUpperCase()}</DataTable.Cell>
                                    <DataTable.Cell textStyle={styles.dtCellText}>{new Date(order.createdAt).toLocaleDateString()}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <View style={[styles.statusBadge, { borderColor: statusColor, flex: 0, alignSelf: 'flex-start' }]}>
                                            <Text style={[styles.statusText, { color: statusColor }]}>{order.status.replace('_', ' ')}</Text>
                                        </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={styles.dtCellText}>{order.quantity}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={[styles.dtCellText, { color: '#00E676', fontWeight: 'bold' }]}>
                                        TZS {parseInt(order.totalAmount).toLocaleString()}
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ paddingLeft: 20 }}>
                                        <Button 
                                            mode="contained" 
                                            compact
                                            buttonColor={order.status === 'DELIVERED' ? '#00E676' : 'rgba(255,255,255,0.1)'} 
                                            textColor={order.status === 'DELIVERED' ? '#111' : 'white'}
                                            disabled={order.status !== 'DELIVERED'}
                                        >
                                            {order.status === 'DELIVERED' ? 'Release Escrow' : 'View Logs'}
                                        </Button>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            );
                        })}
                    </DataTable>
                </View>
            </ScrollView>
        </BlurView>
    );

    // ----------------------------------------------------
    // MOBILE CARD VIEW
    // ----------------------------------------------------
    const renderMobileCard = (order: any) => {
        const statusColor = getStatusColor(order.status);
        
        return (
            <BlurView intensity={25} tint="light" style={styles.orderCard} key={order.id}>
                <View style={styles.cardPad}>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon icon="truck-fast" size={44} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color={statusColor} />
                            <View style={{ marginLeft: 15 }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>#{order.id.substring(0, 8)}</Text>
                                <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                            <Text style={[styles.statusText, { color: statusColor }]}>{order.status.replace('_', ' ')}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsBox}>
                        <View style={styles.row}>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.7)' }}>Items</Text>
                            <Text variant="bodyMedium" style={{ color: 'white', fontWeight: 'bold' }}>{order.quantity} pcs</Text>
                        </View>
                        <View style={[styles.row, { marginTop: 10 }]}>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.7)' }}>Escrow Total</Text>
                            <Text variant="bodyMedium" style={{ color: '#00E676', fontWeight: 'bold' }}>TZS {parseInt(order.totalAmount).toLocaleString()}</Text>
                        </View>
                    </View>

                    {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                        <View style={styles.timeline}>
                            <View style={[styles.timelineNode, { backgroundColor: statusColor }]} />
                            <View style={styles.timelineLine} />
                            <View style={[styles.timelineNode, { backgroundColor: ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order.status) ? statusColor : 'rgba(255,255,255,0.2)' }]} />
                            <View style={styles.timelineLine} />
                            <View style={[styles.timelineNode, { backgroundColor: order.status === 'DELIVERED' || order.status === 'COMPLETED' ? statusColor : 'rgba(255,255,255,0.2)' }]} />
                        </View>
                    )}

                    <View style={styles.timelineLabels}>
                        <Text style={styles.timelineLabel}>Escrow</Text>
                        <Text style={[styles.timelineLabel, { textAlign: 'center' }]}>Shipped</Text>
                        <Text style={[styles.timelineLabel, { textAlign: 'right' }]}>Delivered</Text>
                    </View>

                    {order.status === 'DELIVERED' && (
                        <Button mode="contained" buttonColor="#00E676" style={{ marginTop: 20 }}>
                            Release Escrow
                        </Button>
                    )}
                </View>
            </BlurView>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>B2B Escrow Ledger</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="white" />}
            >
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="white" />
                ) : (
                    <View>
                        {orders.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 60 }}>
                                <Avatar.Icon icon="receipt" size={100} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="white" />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 20, fontSize: 16 }}>No Escrow purchases active.</Text>
                                <Button mode="contained" buttonColor="#0288D1" onPress={() => router.push('/commerce/marketplace')}>Explore Market</Button>
                            </View>
                        ) : (
                            isDesktop ? renderDesktopGrid() : orders.map(renderMobileCard)
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    
    orderCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardPad: { padding: 25 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
    statusText: { fontWeight: 'bold', fontSize: 10 },
    detailsBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    
    timeline: { flexDirection: 'row', alignItems: 'center', marginTop: 25, paddingHorizontal: 10 },
    timelineNode: { width: 14, height: 14, borderRadius: 7 },
    timelineLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
    timelineLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginTop: 8 },
    timelineLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, flex: 1 },

    // Data Grid Styles
    gridContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    dtHeader: { backgroundColor: 'rgba(0,0,0,0.3)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    dtTitleText: { color: 'white', fontWeight: 'bold' },
    dtRow: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    dtCellText: { color: 'rgba(255,255,255,0.8)' }
});
