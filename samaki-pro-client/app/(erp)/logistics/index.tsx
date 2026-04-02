import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, useWindowDimensions, Platform } from 'react-native';
import { Text, Avatar, Button, IconButton, Chip, Divider, ActivityIndicator, DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/services/api';
import { BlurView } from 'expo-blur';

export default function VendorDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800 || Platform.OS === 'web';
    
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await api.get(`/orders/seller/${user?.id}`);
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.post(`/orders/${orderId}/status`, { status: newStatus }, { method: 'PATCH' });
            fetchOrders(); 
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    // ----------------------------------------------------
    // DESKTOP DATA GRID VIEW (ERP)
    // ----------------------------------------------------
    const renderDesktopGrid = () => (
        <BlurView intensity={20} tint="light" style={styles.gridContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 1000 }}>
                    <DataTable>
                        <DataTable.Header style={styles.dtHeader}>
                            <DataTable.Title textStyle={styles.dtTitleText}>Order ID</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Date</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Commodity</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Buyer</DataTable.Title>
                            <DataTable.Title textStyle={styles.dtTitleText}>Status</DataTable.Title>
                            <DataTable.Title numeric textStyle={styles.dtTitleText}>Escrow Valuation</DataTable.Title>
                            <DataTable.Title textStyle={[styles.dtTitleText, { paddingLeft: 20 }]}>Actions</DataTable.Title>
                        </DataTable.Header>

                        {orders.map((item) => (
                            <DataTable.Row key={item.id} style={styles.dtRow}>
                                <DataTable.Cell textStyle={styles.dtCellText}>#{item.id.substring(0, 8).toUpperCase()}</DataTable.Cell>
                                <DataTable.Cell textStyle={styles.dtCellText}>{new Date(item.createdAt).toLocaleDateString()}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ color: 'white', fontWeight: 'bold' }}>
                                    {item.listing?.title || 'Unknown'} ({item.quantity}{item.listing?.unit})
                                </DataTable.Cell>
                                <DataTable.Cell textStyle={styles.dtCellText}>{item.buyer?.fullName || 'Guest'}</DataTable.Cell>
                                <DataTable.Cell>
                                    <View style={[styles.statusBadge, { 
                                        borderColor: item.status === 'COMPLETED' ? '#00E676' : item.status === 'PAID' ? '#4FC3F7' : '#FFB74D',
                                        flex: 0, alignSelf: 'flex-start' 
                                    }]}>
                                        <Text style={[styles.statusText, { color: item.status === 'COMPLETED' ? '#00E676' : item.status === 'PAID' ? '#4FC3F7' : '#FFB74D' }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric textStyle={[styles.dtCellText, { color: '#00E676', fontWeight: 'bold' }]}>
                                    TZS {parseInt(item.totalAmount).toLocaleString()}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ paddingLeft: 20 }}>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        {item.status === 'PAID' && (
                                            <Button mode="contained" compact buttonColor="#0288D1" onPress={() => handleUpdateStatus(item.id, 'DISPATCHED')}>Dispatch</Button>
                                        )}
                                        {item.status === 'DISPATCHED' && (
                                            <Button mode="contained" compact buttonColor="#00E676" onPress={() => handleUpdateStatus(item.id, 'COMPLETED')}>Complete</Button>
                                        )}
                                        {item.status === 'PENDING' && (
                                            <Button mode="outlined" compact onPress={() => handleUpdateStatus(item.id, 'CANCELLED')} textColor="#FF5252" style={{ borderColor: 'rgba(255,82,82,0.5)' }}>Cancel</Button>
                                        )}
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </View>
            </ScrollView>
        </BlurView>
    );

    // ----------------------------------------------------
    // MOBILE CARD VIEW
    // ----------------------------------------------------
    const renderMobileCard = ({ item }: { item: any }) => (
        <BlurView intensity={25} tint="light" style={styles.orderCard} key={item.id}>
            <View style={styles.cardPad}>
                <View style={[styles.row, { marginBottom: 15 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar.Icon icon="truck-delivery" size={40} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="white" />
                        <View style={{ marginLeft: 12 }}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>#{item.id.substring(0, 8)}</Text>
                            <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <Chip
                        icon={item.status === 'COMPLETED' ? 'check' : item.status === 'PAID' ? 'cash' : 'clock'}
                        style={{ backgroundColor: item.status === 'COMPLETED' ? 'rgba(0,230,118,0.2)' : item.status === 'PAID' ? 'rgba(79,195,247,0.2)' : 'rgba(255,183,77,0.2)' }}
                        textStyle={{ color: item.status === 'COMPLETED' ? '#00E676' : item.status === 'PAID' ? '#4FC3F7' : '#FFB74D', fontSize: 12, fontWeight: 'bold' }}>
                        {item.status}
                    </Chip>
                </View>

                <Divider style={{ marginVertical: 15, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: 'white' }}>{item.listing?.title || 'Unknown Item'}</Text>
                        <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity} {item.listing?.unit} @ {parseInt(item.unitPrice).toLocaleString()} TZS</Text>
                    </View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#00E676' }}>
                        {parseInt(item.totalAmount).toLocaleString()} TZS
                    </Text>
                </View>

                {item.buyer && (
                    <View style={styles.buyerBox}>
                        <View>
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)' }}>Buyer</Text>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: 'white' }}>{item.buyer.fullName || 'Guest'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact</Text>
                            <Text variant="bodyMedium" style={{ color: 'white' }}>{item.buyer.phone || 'N/A'}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.actionsBox}>
                    {item.status === 'PAID' && (
                        <Button mode="contained" buttonColor="#0288D1" onPress={() => handleUpdateStatus(item.id, 'DISPATCHED')}>
                            Dispatch Logistics
                        </Button>
                    )}
                    {item.status === 'DISPATCHED' && (
                        <Button mode="contained" buttonColor="#00E676" onPress={() => handleUpdateStatus(item.id, 'COMPLETED')}>
                            Confirm Delivery & Claim Escrow
                        </Button>
                    )}
                    {item.status === 'PENDING' && (
                        <Button mode="outlined" onPress={() => handleUpdateStatus(item.id, 'CANCELLED')} textColor="#FF5252" style={{ borderColor: 'rgba(255,82,82,0.5)' }}>
                            Cancel Order
                        </Button>
                    )}
                </View>
            </View>
        </BlurView>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>Vendor Fulfillment Ledger</Text>
                <IconButton icon="refresh" iconColor="white" onPress={fetchOrders} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.statsRow}>
                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#4FC3F7' }}>{orders.length}</Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Orders</Text>
                        </View>
                    </BlurView>
                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#00E676' }}>
                                {orders.filter(o => o.status === 'COMPLETED').length}
                            </Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Completed</Text>
                        </View>
                    </BlurView>
                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.center}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#FFB74D' }}>
                                {orders.filter(o => o.status === 'PAID' || o.status === 'PENDING').length}
                            </Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Active</Text>
                        </View>
                    </BlurView>
                </View>

                <View style={{ marginBottom: 30 }}>
                    <Button 
                        mode="contained" 
                        icon="solar-panel-large"
                        style={{ borderRadius: 16, paddingVertical: 5 }}
                        buttonColor="rgba(255,255,255,0.15)"
                        onPress={() => router.push('/fintech/assets')}
                    >
                        Cold Chain IoT Financing
                    </Button>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Inbound Orders</Text>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 20 }} color="white" />
                ) : (
                    orders.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.5)' }}>No B2B orders yet.</Text>
                    ) : (
                        isDesktop ? renderDesktopGrid() : (
                            <FlatList
                                data={orders}
                                renderItem={renderMobileCard}
                                keyExtractor={item => item.id}
                                scrollEnabled={false} 
                            />
                        )
                    )
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    scrollContent: { padding: 20, paddingBottom: 50 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 10 },
    statCard: { flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    center: { alignItems: 'center', paddingVertical: 20 },

    sectionTitle: { fontWeight: 'bold', marginBottom: 20, color: 'white', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

    orderCard: { marginBottom: 25, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardPad: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    buyerBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    actionsBox: { marginTop: 20 },
    
    statusBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
    statusText: { fontWeight: 'bold', fontSize: 10 },

    // Data Grid Styles
    gridContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    dtHeader: { backgroundColor: 'rgba(0,0,0,0.3)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    dtTitleText: { color: 'white', fontWeight: 'bold' },
    dtRow: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    dtCellText: { color: 'rgba(255,255,255,0.8)' }
});
