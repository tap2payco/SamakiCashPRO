import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ProgressBar, IconButton, Dialog, Portal, RadioButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function VendorAssetsScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [applyModal, setApplyModal] = useState(false);
    const [selectedAssetType, setSelectedAssetType] = useState('Solar Cooler 50L');
    const [applying, setApplying] = useState(false);

    const ASSET_OPTIONS = [
        { label: 'Solar Cooler 50L (850,000 TZS)', value: 'Solar Cooler 50L' },
        { label: 'Solar Cooler 100L (1,500,000 TZS)', value: 'Solar Cooler 100L' }
    ];

    const fetchAssets = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get(`/assets/${user.id}`);
            setAssets(data);
        } catch (err) {
            console.error('Failed to fetch assets', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => { fetchAssets(); }, [fetchAssets]);

    const onRefresh = () => { setRefreshing(true); fetchAssets(); };

    const handleApply = async () => {
        setApplying(true);
        try {
            await api.post('/assets/apply', {
                vendorId: user?.id,
                assetType: selectedAssetType
            });
            setApplyModal(false);
            fetchAssets();
        } catch (err) {
            console.error('Failed to apply for lease', err);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return null; // Or a loading spinner

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Cold Chain Assets</Text>
            </View>

            <View style={styles.introBox}>
                <Text variant="bodyMedium" style={{ color: '#00609C', marginBottom: 10 }}>
                    Reduce post-harvest loss with Solar-Powered Cold Storage. Apply for Pay-As-You-Go (PAYG) financing with 0% interest for active marketplace vendors.
                </Text>
                <Button mode="contained" icon="solar-panel-large" onPress={() => setApplyModal(true)} style={{ backgroundColor: '#00609C' }}>
                    Request Financing
                </Button>
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>My Active Leases</Text>

            {assets.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <IconButton icon="fridge-outline" size={60} iconColor="#CCC" />
                    <Text style={{ color: '#999', marginTop: 10 }}>You have no active equipment leases.</Text>
                </View>
            ) : (
                assets.map((asset: any) => {
                    const progress = Number(asset.amountPaid) / Number(asset.totalCost);
                    
                    return (
                        <Card key={asset.id} style={styles.assetCard}>
                            <Card.Content>
                                <View style={styles.row}>
                                    <View>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{asset.assetType}</Text>
                                        <Text variant="labelSmall" style={{ color: '#666' }}>
                                            Leased: {new Date(asset.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={[styles.statusBadge, asset.status === 'OWNED' && { backgroundColor: '#E8F5E9' }]}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: asset.status === 'OWNED' ? '#2E7D32' : '#00609C' }}>
                                            {asset.status}
                                        </Text>
                                    </View>
                                </View>

                                <Divider style={{ marginVertical: 15 }} />

                                <View style={styles.row}>
                                    <View>
                                        <Text variant="labelSmall" style={{ color: '#666' }}>Paid (M-Pesa Auto-Deduct)</Text>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>
                                            {Number(asset.amountPaid).toLocaleString()} TZS
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text variant="labelSmall" style={{ color: '#666' }}>Total Cost</Text>
                                        <Text variant="titleMedium" style={{ color: '#666' }}>
                                            {Number(asset.totalCost).toLocaleString()} TZS
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <Text variant="labelSmall" style={{ color: '#00609C' }}>Ownership Progress</Text>
                                        <Text variant="labelSmall" style={{ fontWeight: 'bold', color: '#00609C' }}>
                                            {(progress * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                    <ProgressBar progress={progress} color={asset.status === 'OWNED' ? '#4CAF50' : '#00609C'} style={{ height: 8, borderRadius: 4 }} />
                                </View>
                            </Card.Content>
                        </Card>
                    );
                })
            )}

            {/* Application Modal */}
            <Portal>
                <Dialog visible={applyModal} onDismiss={() => setApplyModal(false)} style={{ backgroundColor: 'white' }}>
                    <Dialog.Title>Lease Application</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ marginBottom: 15, color: '#666' }}>Select the equipment you wish to finance. Daily installments will be automatically deducted from your sales escrow payouts.</Text>
                        <RadioButton.Group onValueChange={value => setSelectedAssetType(value)} value={selectedAssetType}>
                            {ASSET_OPTIONS.map(opt => (
                                <RadioButton.Item key={opt.value} label={opt.label} value={opt.value} labelStyle={{ fontSize: 13 }} />
                            ))}
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setApplyModal(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleApply} loading={applying} disabled={applying}>Submit Request</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: 0 },
    introBox: { margin: 20, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 12, borderWidth: 1, borderColor: '#BBDEFB' },
    sectionTitle: { paddingHorizontal: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    assetCard: { marginHorizontal: 20, marginBottom: 15, backgroundColor: 'white' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { backgroundColor: '#E1F5FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }
});
