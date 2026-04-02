import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, ProgressBar, IconButton, Dialog, Portal, RadioButton, Divider, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

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

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>Cold Chain Asset Financing</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.container} 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAssets(); }} tintColor="white" />}
            >
                <BlurView intensity={20} tint="light" style={styles.introBox}>
                    <View style={styles.cardPad}>
                        <Text variant="bodyLarge" style={{ color: 'white', marginBottom: 15, lineHeight: 22 }}>
                            Reduce post-harvest loss with Solar-Powered Cold Storage. Apply for Pay-As-You-Go (PAYG) financing with 0% interest directly integrated with your Escrow payouts.
                        </Text>
                        <Button mode="contained" icon="solar-panel-large" onPress={() => setApplyModal(true)} buttonColor="#00E676" labelStyle={{ fontWeight: 'bold' }} style={{ borderRadius: 16 }}>
                            Request Solar Cooler
                        </Button>
                    </View>
                </BlurView>

                <Text variant="titleLarge" style={styles.sectionTitle}>My Embedded Leases</Text>

                {loading ? null : assets.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 20 }}>
                        <Avatar.Icon icon="fridge-outline" size={80} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="white" />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 20, textAlign: 'center', lineHeight: 22 }}>
                            You currently have no active equipment leases. Zero deposits required for top merchants.
                        </Text>
                    </View>
                ) : (
                    assets.map((asset: any) => {
                        const progress = Number(asset.amountPaid) / Number(asset.totalCost);
                        return (
                            <BlurView intensity={25} tint="light" style={styles.assetCard} key={asset.id}>
                                <View style={styles.cardPad}>
                                    <View style={styles.row}>
                                        <View>
                                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{asset.assetType}</Text>
                                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Activated on {new Date(asset.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, asset.status === 'OWNED' && { backgroundColor: 'rgba(0, 230, 118, 0.2)' }]}>
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: asset.status === 'OWNED' ? '#00E676' : '#FFB74D' }}>
                                                {asset.status}
                                            </Text>
                                        </View>
                                    </View>

                                    <Divider style={{ marginVertical: 15, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                                    <View style={styles.row}>
                                        <View>
                                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Paid via Auto-Deduct</Text>
                                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>
                                                {Number(asset.amountPaid).toLocaleString()} TZS
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Lease Cost</Text>
                                            <Text variant="titleMedium" style={{ color: '#E0E0E0' }}>
                                                {Number(asset.totalCost).toLocaleString()} TZS
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text variant="labelMedium" style={{ color: 'white', fontWeight: 'bold' }}>Lease to Own Progress</Text>
                                            <Text variant="labelMedium" style={{ fontWeight: 'bold', color: '#00E676' }}>
                                                {(progress * 100).toFixed(1)}%
                                            </Text>
                                        </View>
                                        <ProgressBar progress={progress} color={asset.status === 'OWNED' ? '#00E676' : '#4FC3F7'} style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    </View>
                                </View>
                            </BlurView>
                        );
                    })
                )}

                <Portal>
                    <Dialog visible={applyModal} onDismiss={() => setApplyModal(false)} style={{ backgroundColor: 'rgba(30, 40, 60, 0.95)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Dialog.Title style={{ color: 'white', fontWeight: 'bold' }}>Apply for Financing</Dialog.Title>
                        <Dialog.Content>
                            <Text style={{ marginBottom: 20, color: 'rgba(255,255,255,0.8)', lineHeight: 20 }}>
                                Select the equipment. The daily installment will be automatically deducted from your sales payouts inside Samaki PRO.
                            </Text>
                            <RadioButton.Group onValueChange={value => setSelectedAssetType(value)} value={selectedAssetType}>
                                {ASSET_OPTIONS.map(opt => (
                                    <RadioButton.Item key={opt.value} label={opt.label} value={opt.value} labelStyle={{ fontSize: 14, color: 'white' }} uncheckedColor="rgba(255,255,255,0.5)" color="#00E676" />
                                ))}
                            </RadioButton.Group>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setApplyModal(false)} textColor="white">Cancel</Button>
                            <Button mode="contained" onPress={handleApply} loading={applying} disabled={applying} buttonColor="#00E676">Confirm Application</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.2)' },
    introBox: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 25 },
    cardPad: { padding: 25 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 20, color: 'white', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
    assetCard: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { backgroundColor: 'rgba(255,183,77,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
});
