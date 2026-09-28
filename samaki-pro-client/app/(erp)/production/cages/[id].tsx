import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl, Animated } from 'react-native';
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
    
    const displayColor = isWarning ? '#FF5252' : color;

    return (
        <BlurView intensity={30} tint="dark" style={[styles.chartCard, isWarning && { borderLeftColor: '#FF5252', borderLeftWidth: 4 }]}>
            <View style={styles.chartHeader}>
                <View>
                    <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
                    <Text variant="headlineSmall" style={{ fontWeight: '900', color: displayColor }}>
                        {latest?.toFixed(1)} <Text style={{ fontSize: 16 }}>{unit}</Text>
                    </Text>
                </View>
                {isWarning && (
                    <Chip icon="alert-decagram" textStyle={{ fontSize: 10, color: 'white', fontWeight: 'bold' }} style={{ backgroundColor: 'rgba(255,82,82,0.3)', height: 28, borderColor: '#FF5252', borderWidth: 1 }}>
                        CRITICAL
                    </Chip>
                )}
            </View>
            <View style={styles.barContainer}>
                {values.slice(-8).map((v, i) => {
                    const height = max === min ? 20 : ((v - min) / (max - min)) * 30 + 5;
                    return (
                        <View key={i} style={styles.barWrapper}>
                            <View style={[styles.bar, { height, backgroundColor: displayColor, opacity: i === values.length -1 ? 1 : 0.5 }]} />
                        </View>
                    );
                })}
            </View>
            <View style={styles.chartFooter}>
                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.4)' }}>Range: {min.toFixed(1)} – {max.toFixed(1)} {unit}</Text>
            </View>
        </BlurView>
    );
}

export default function CageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [cage, setCage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modals
    const [showStockModal, setShowStockModal] = useState(false);
    const [species, setSpecies] = useState('Tilapia');
    const [quantity, setQuantity] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [stocking, setStocking] = useState(false);

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
        if (!quantity) return;
        setStocking(true);
        try {
            await api.post(`/cages/${id}/stock`, { species, quantity: parseInt(quantity), estimatedHarvestDate: harvestDate || undefined });
            setShowStockModal(false); setQuantity(''); fetchCage();
        } catch (err) {} finally { setStocking(false); }
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
        } catch (err) {} finally { setRecording(false); }
    };

    if (loading) return <View style={{ flex: 1 }}><ActivityIndicator style={styles.center} color="#00E5FF" size="large" /></View>;
    if (!cage) return <View style={styles.center}><Text style={{ color: 'white' }}>Node offline</Text></View>;

    const activeBatch = cage.batches?.find((b: any) => b.status === 'ACTIVE');
    const sensors = cage.sensors || [];
    const capacityUsed = activeBatch ? (activeBatch.currentQuantity / (cage.capacity || 1)) * 100 : 0;
    const daysToHarvest = activeBatch?.estimatedHarvestDate ? Math.ceil((new Date(activeBatch.estimatedHarvestDate).getTime() - Date.now()) / 86400000) : null;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCage(); }} tintColor="#00E5FF" />}>
                
                <View style={styles.header}>
                    <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineSmall" style={{ fontWeight: '900', color: 'white' }}>{cage.name}</Text>
                        <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>{cage.type?.toUpperCase()} NODE • VOL {cage.capacity}L</Text>
                    </View>
                    <Chip style={{ backgroundColor: cage.status === 'ACTIVE' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255,183,77,0.15)', borderWidth: 1, borderColor: cage.status === 'ACTIVE' ? '#00E676' : '#FFB74D' }} textStyle={{ color: cage.status === 'ACTIVE' ? '#00E676' : '#FFB74D', fontWeight: 'bold' }}>
                        {cage.status}
                    </Chip>
                </View>

                {cage.location && (
                    <View style={styles.locationRow}>
                        <Avatar.Icon icon="crosshairs-gps" size={32} style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }} color="#00E5FF" />
                        <Text variant="bodyMedium" style={{ marginLeft: 15, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>GEO: {cage.location}</Text>
                    </View>
                )}

                <Text variant="titleMedium" style={styles.sectionTitle}>Biomass Inventory</Text>
                {activeBatch ? (
                    <BlurView intensity={30} tint="dark" style={styles.batchCard}>
                        <View style={{ padding: 25 }}>
                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar.Icon icon="fish" size={54} style={{ backgroundColor: 'rgba(0, 229, 255, 0.15)' }} color="#00E5FF" />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white' }}>{activeBatch.species}</Text>
                                        <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)' }}>DEPLOYED: {new Date(activeBatch.stockingDate).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={{ marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={styles.statLabel}>INITIAL</Text>
                                    <Text variant="titleLarge" style={{ fontWeight: 'bold', color: 'white' }}>{activeBatch.quantity?.toLocaleString()}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={styles.statLabel}>CURRENT</Text>
                                    <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#00E5FF' }}>{(activeBatch.currentQuantity || activeBatch.quantity)?.toLocaleString()}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={styles.statLabel}>DENSITY</Text>
                                    <Text variant="titleLarge" style={{ fontWeight: 'bold', color: capacityUsed > 90 ? '#FF5252' : capacityUsed > 70 ? '#FF9100' : '#00E676' }}>
                                        {capacityUsed.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>

                            {daysToHarvest !== null && (
                                <View style={styles.harvestBanner}>
                                    <Avatar.Icon icon="calendar-clock" size={40} style={{ backgroundColor: 'rgba(0, 230, 118, 0.2)' }} color="#00E676" />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>HARVEST WINDOW</Text>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>
                                            {daysToHarvest > 0 ? `T-Minus ${daysToHarvest} Days` : daysToHarvest === 0 ? 'Optimal Harvest Now' : `Overdue by ${Math.abs(daysToHarvest)} Days`}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </BlurView>
                ) : (
                    <BlurView intensity={25} tint="dark" style={[styles.batchCard, { borderWidth: 1, borderStyle: 'dashed', borderColor: '#00E5FF' }]}>
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Avatar.Icon icon="fish-off" size={60} style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }} color="#00E5FF" />
                            <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 20 }}>Node is ready for stocking</Text>
                            <Button mode="contained" onPress={() => setShowStockModal(true)} style={{ borderRadius: 50 }} buttonColor="#00E5FF" textColor="#0F2027" icon="plus">
                                Initialize Biomass
                            </Button>
                        </View>
                    </BlurView>
                )}

                <View style={styles.row}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Telemetry Stream</Text>
                    <Button mode="outlined" icon="access-point" onPress={() => setShowSensorModal(true)} textColor="#00E676" style={{ borderColor: '#00E676' }}>Manual Ping</Button>
                </View>

                {sensors.length > 0 ? (
                    <View>
                        <SensorChart readings={sensors} metric="temperature" label="Temperature" unit="°C" color="#FF9100" warningRange={{ min: 24, max: 30 }} />
                        <SensorChart readings={sensors} metric="ph" label="pH Level" unit="" color="#00E5FF" warningRange={{ min: 6.5, max: 8.5 }} />
                        <SensorChart readings={sensors} metric="dissolvedOxygen" label="Dissolved Oxygen" unit="mg/L" color="#00E676" warningRange={{ min: 5, max: 15 }} />
                    </View>
                ) : (
                    <BlurView intensity={20} tint="dark" style={styles.emptyCard}>
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Avatar.Icon icon="chart-timeline-variant-shimmer" size={50} style={{ backgroundColor: 'transparent' }} color="rgba(255,255,255,0.3)" />
                            <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>No telemetry signal detected</Text>
                        </View>
                    </BlurView>
                )}
            </ScrollView>

            {/* Floating Smart Action */}
            {activeBatch && sensors.length > 0 && (
                <FAB 
                    icon="robot" 
                    label="AI Control" 
                    style={styles.fab} 
                    color="#0F2027" 
                    customSize={56}
                    onPress={() => alert('Samaki AI: Triggering automated smart feeders and activating aeration nodes.')} 
                />
            )}

            {/* Modals */}
            <Portal>
                <Modal visible={showStockModal} onDismiss={() => setShowStockModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={styles.modalTitle}>Initialize Biomass</Text>
                    <TextInput label="Quantity (pcs)" value={quantity} onChangeText={setQuantity} mode="outlined" keyboardType="numeric" style={{ marginBottom: 15 }} textColor="white" outlineColor="rgba(255,255,255,0.2)" activeOutlineColor="#00E5FF" theme={{ colors: { background: 'rgba(255,255,255,0.05)' } }} />
                    <Button mode="contained" onPress={handleStock} loading={stocking} disabled={stocking} buttonColor="#00E5FF" textColor="#0F2027">Deploy</Button>
                </Modal>
                <Modal visible={showSensorModal} onDismiss={() => setShowSensorModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={styles.modalTitle}>Inject Telemetry Ping</Text>
                    <TextInput label="Temp (°C)" value={temperature} onChangeText={setTemperature} mode="outlined" keyboardType="decimal-pad" style={{ marginBottom: 15 }} textColor="white" outlineColor="rgba(255,255,255,0.2)" activeOutlineColor="#00E676" theme={{ colors: { background: 'rgba(255,255,255,0.05)' } }} />
                    <TextInput label="pH" value={ph} onChangeText={setPh} mode="outlined" keyboardType="decimal-pad" style={{ marginBottom: 15 }} textColor="white" outlineColor="rgba(255,255,255,0.2)" activeOutlineColor="#00E676" theme={{ colors: { background: 'rgba(255,255,255,0.05)' } }} />
                    <TextInput label="Dissolved O2" value={dissolvedOxygen} onChangeText={setDissolvedOxygen} mode="outlined" keyboardType="decimal-pad" style={{ marginBottom: 25 }} textColor="white" outlineColor="rgba(255,255,255,0.2)" activeOutlineColor="#00E676" theme={{ colors: { background: 'rgba(255,255,255,0.05)' } }} />
                    <Button mode="contained" onPress={handleRecordSensor} loading={recording} disabled={recording} buttonColor="#00E676" textColor="#0F2027">Transmit Data</Button>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    scrollContent: { padding: 25, paddingBottom: 120 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'rgba(0, 229, 255, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.1)' },
    sectionTitle: { fontWeight: 'bold', color: 'white', letterSpacing: 0.5, marginBottom: 20 },
    batchCard: { borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.2)', elevation: 10, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15, marginBottom: 40 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    statBox: { alignItems: 'center', flex: 1 },
    statLabel: { color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 5 },
    harvestBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 230, 118, 0.1)', borderRadius: 20, padding: 20, marginTop: 25, borderWidth: 1, borderColor: 'rgba(0, 230, 118, 0.3)' },
    chartCard: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    barContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 50, marginTop: 20, gap: 6 },
    barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
    bar: { width: '80%', borderRadius: 4, minHeight: 4 },
    chartFooter: { marginTop: 15 },
    emptyCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    fab: { position: 'absolute', margin: 25, right: 0, bottom: 0, backgroundColor: '#00E5FF' },
    modal: { backgroundColor: '#1A2930', margin: 25, padding: 35, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.3)' },
    modalTitle: { fontWeight: 'bold', marginBottom: 25, color: 'white' }
});
