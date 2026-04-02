import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, Chip, IconButton, Portal, Modal, TextInput, Divider, useTheme, Avatar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '~/services/api';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

function SensorChart({ readings, metric, label, unit, color, warningRange }: {
    readings: any[], metric: string, label: string, unit: string, color: string,
    warningRange?: { min: number, max: number }
}) {
    if (!readings.length) return null;

    const values = readings.map(r => r[metric]).filter(Boolean).reverse();
    if (!values.length) return null;

    const max = Math.max(...values);
    const min = Math.min(...values);
    const latest = values[values.length - 1];
    const isWarning = warningRange && (latest < warningRange.min || latest > warningRange.max);

    return (
        <BlurView intensity={25} tint="light" style={[styles.chartCard, isWarning && { borderLeftColor: '#FF5252', borderLeftWidth: 4 }]}>
            <View style={styles.chartHeader}>
                <View>
                    <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</Text>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: isWarning ? '#FF5252' : color }}>
                        {latest?.toFixed(1)} {unit}
                    </Text>
                </View>
                {isWarning && (
                    <Chip icon="alert" textStyle={{ fontSize: 10, color: 'white' }} style={{ backgroundColor: 'rgba(255,82,82,0.3)', height: 28 }}>
                        Out of range
                    </Chip>
                )}
            </View>
            <View style={styles.barContainer}>
                {values.slice(-8).map((v, i) => {
                    const height = max === min ? 20 : ((v - min) / (max - min)) * 30 + 5;
                    return (
                        <View key={i} style={styles.barWrapper}>
                            <View style={[styles.bar, { height, backgroundColor: color }]} />
                        </View>
                    );
                })}
            </View>
            <View style={styles.chartFooter}>
                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)' }}>Range: {min.toFixed(1)} – {max.toFixed(1)} {unit}</Text>
            </View>
        </BlurView>
    );
}

export default function CageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();

    const [cage, setCage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [showStockModal, setShowStockModal] = useState(false);
    const [species, setSpecies] = useState('Tilapia');
    const [quantity, setQuantity] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [stocking, setStocking] = useState(false);
    const [stockError, setStockError] = useState('');

    const [showSensorModal, setShowSensorModal] = useState(false);
    const [temperature, setTemperature] = useState('');
    const [dissolvedOxygen, setDissolvedOxygen] = useState('');
    const [ph, setPh] = useState('');
    const [recording, setRecording] = useState(false);

    const fetchCage = async () => {
        try {
            const data = await api.get(`/cages/${id}`);
            setCage(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { id && fetchCage(); }, [id]);

    const handleStock = async () => {
        if (!quantity || parseInt(quantity) <= 0) return setStockError('Enter a valid quantity');
        setStocking(true); setStockError('');
        try {
            await api.post(`/cages/${id}/stock`, { species, quantity: parseInt(quantity), estimatedHarvestDate: harvestDate || undefined });
            setShowStockModal(false); setSpecies('Tilapia'); setQuantity(''); setHarvestDate(''); fetchCage();
        } catch (err) { setStockError('Failed to stock batch'); } finally { setStocking(false); }
    };

    const handleRecordSensor = async () => {
        setRecording(true);
        try {
            await api.post(`/cages/${id}/readings`, {
                temperature: temperature ? parseFloat(temperature) : undefined,
                ph: ph ? parseFloat(ph) : undefined,
                dissolvedOxygen: dissolvedOxygen ? parseFloat(dissolvedOxygen) : undefined,
            });
            setShowSensorModal(false); setTemperature(''); setPh(''); setDissolvedOxygen(''); fetchCage();
        } catch (err) { console.error(err); } finally { setRecording(false); }
    };

    if (loading) return <View style={{ flex: 1 }}><View style={styles.center}><ActivityIndicator color="white" size="large" /></View></View>;
    if (!cage) return <View style={{ flex: 1 }}><View style={styles.center}><Text style={{ color: 'white' }}>Cage not found</Text><Button mode="contained" onPress={() => router.back()} style={{ marginTop: 15 }}>Go Back</Button></View></View>;

    const activeBatch = cage.batches?.find((b: any) => b.status === 'ACTIVE');
    const pastBatches = cage.batches?.filter((b: any) => b.status !== 'ACTIVE') || [];
    const sensors = cage.sensors || [];
    const capacityUsed = activeBatch ? (activeBatch.currentQuantity / (cage.capacity || 1)) * 100 : 0;
    const daysToHarvest = activeBatch?.estimatedHarvestDate ? Math.ceil((new Date(activeBatch.estimatedHarvestDate).getTime() - Date.now()) / 86400000) : null;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCage(); }} tintColor="white" />}>
                
                <View style={styles.header}>
                    <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white' }}>{cage.name}</Text>
                        <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>{cage.type?.toUpperCase()} • Cap: {cage.capacity}</Text>
                    </View>
                    <Chip style={{ backgroundColor: cage.status === 'ACTIVE' ? 'rgba(0,230,118,0.2)' : 'rgba(255,183,77,0.2)' }} textStyle={{ color: cage.status === 'ACTIVE' ? '#00E676' : '#FFB74D', fontWeight: 'bold' }}>
                        {cage.status}
                    </Chip>
                </View>

                {cage.location && (
                    <View style={styles.locationRow}>
                        <Avatar.Icon icon="map-marker" size={28} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="#4FC3F7" />
                        <Text variant="bodySmall" style={{ marginLeft: 10, color: 'rgba(255,255,255,0.8)' }}>{cage.location}</Text>
                    </View>
                )}

                <Text variant="titleMedium" style={styles.sectionTitle}>Current Stock</Text>
                {activeBatch ? (
                    <BlurView intensity={30} tint="light" style={styles.batchCard}>
                        <View style={{ padding: 25 }}>
                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar.Icon icon="fish" size={48} style={{ backgroundColor: 'rgba(0,230,118,0.2)' }} color="#00E676" />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>{activeBatch.species}</Text>
                                        <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Stocked: {new Date(activeBatch.stockingDate).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={{ marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Initial</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{activeBatch.quantity?.toLocaleString()}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Current</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#00E676' }}>{(activeBatch.currentQuantity || activeBatch.quantity)?.toLocaleString()}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Usage</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: capacityUsed > 90 ? '#FF5252' : capacityUsed > 70 ? '#FFB74D' : '#00E676' }}>
                                        {capacityUsed.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>

                            {daysToHarvest !== null && (
                                <View style={styles.harvestBanner}>
                                    <Avatar.Icon icon="calendar-clock" size={36} style={{ backgroundColor: 'transparent' }} color="#4FC3F7" />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text variant="labelSmall" style={{ color: '#E1F5FE' }}>Estimated Harvest</Text>
                                        <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: 'white' }}>
                                            {daysToHarvest > 0 ? `${daysToHarvest} days remaining` : daysToHarvest === 0 ? 'Harvest today!' : `${Math.abs(daysToHarvest)} days overdue`}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </BlurView>
                ) : (
                    <BlurView intensity={20} tint="light" style={[styles.batchCard, { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.3)' }]}>
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Avatar.Icon icon="fish-off" size={60} style={{ backgroundColor: 'transparent' }} color="rgba(255,255,255,0.5)" />
                            <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 15 }}>No active stock in this cage</Text>
                            <Button mode="contained" onPress={() => setShowStockModal(true)} style={{ marginTop: 20, borderRadius: 20 }} buttonColor="#0288D1" icon="plus">
                                Stock Fish
                            </Button>
                        </View>
                    </BlurView>
                )}

                <View style={styles.row}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Water Quality Analytics</Text>
                    <Button mode="text" icon="plus" onPress={() => setShowSensorModal(true)} textColor="#4FC3F7">Record</Button>
                </View>

                {sensors.length > 0 ? (
                    <View>
                        <SensorChart readings={sensors} metric="temperature" label="Temperature" unit="°C" color="#FFB74D" warningRange={{ min: 24, max: 30 }} />
                        <SensorChart readings={sensors} metric="ph" label="pH Level" unit="" color="#81C784" warningRange={{ min: 6.5, max: 8.5 }} />
                        <SensorChart readings={sensors} metric="dissolvedOxygen" label="Dissolved Oxygen" unit="mg/L" color="#4FC3F7" warningRange={{ min: 5, max: 15 }} />
                    </View>
                ) : (
                    <BlurView intensity={20} tint="light" style={styles.emptyCard}>
                        <View style={{ padding: 30, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)' }}>No telemetry readings recorded</Text>
                        </View>
                    </BlurView>
                )}

            </ScrollView>

            {activeBatch ? <FAB icon="camera-iris" label="AI Analyze" style={styles.fab} color="white" onPress={() => {}} /> : null}

            {/* Modals */}
            <Portal>
                <Modal visible={showStockModal} onDismiss={() => setShowStockModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Stock New Batch</Text>
                    <TextInput label="Quantity" value={quantity} onChangeText={setQuantity} mode="outlined" keyboardType="numeric" placeholder="e.g. 500" style={{ marginBottom: 15 }} />
                    <Button mode="contained" onPress={handleStock} loading={stocking} disabled={stocking} buttonColor="#0288D1">Confirm Stock</Button>
                </Modal>
                <Modal visible={showSensorModal} onDismiss={() => setShowSensorModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Add Sensor Reading</Text>
                    <TextInput label="Temp (°C)" value={temperature} onChangeText={setTemperature} mode="outlined" keyboardType="decimal-pad" style={{ marginBottom: 15 }} />
                    <TextInput label="pH" value={ph} onChangeText={setPh} mode="outlined" keyboardType="decimal-pad" style={{ marginBottom: 15 }} />
                    <Button mode="contained" onPress={handleRecordSensor} loading={recording} disabled={recording} buttonColor="#00E676">Save Telemetry</Button>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingHorizontal: 15 },
    sectionTitle: { fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, marginBottom: 15 },
    batchCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    statBox: { alignItems: 'center', flex: 1 },
    harvestBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(2,136,209,0.2)', borderRadius: 16, padding: 15, marginTop: 25, borderWidth: 1, borderColor: 'rgba(2,136,209,0.4)' },
    chartCard: { marginBottom: 15, borderRadius: 20, overflow: 'hidden', padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    barContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 45, marginTop: 15, gap: 5 },
    barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
    bar: { width: '80%', borderRadius: 3, minHeight: 4 },
    chartFooter: { marginTop: 10 },
    emptyCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    fab: { position: 'absolute', margin: 20, right: 0, bottom: 0, backgroundColor: '#ba68c8' },
    modal: { backgroundColor: 'white', margin: 20, padding: 30, borderRadius: 24 }
});
