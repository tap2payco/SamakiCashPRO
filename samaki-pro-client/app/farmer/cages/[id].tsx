import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import {
    Text, Card, Button, FAB, ActivityIndicator, Chip, IconButton,
    Portal, Modal, TextInput, Divider, useTheme, Surface, Avatar
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

const { width } = Dimensions.get('window');

// Mini bar chart component for sensor readings
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
        <Surface style={[styles.chartCard, isWarning && { borderLeftColor: '#FF6B35', borderLeftWidth: 3 }]} elevation={1}>
            <View style={styles.chartHeader}>
                <View>
                    <Text variant="labelMedium" style={{ color: '#666' }}>{label}</Text>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: isWarning ? '#FF6B35' : color }}>
                        {latest?.toFixed(1)} {unit}
                    </Text>
                </View>
                {isWarning && (
                    <Chip icon="alert" textStyle={{ fontSize: 10 }} style={{ backgroundColor: '#FFF3E0', height: 28 }}>
                        Out of range
                    </Chip>
                )}
            </View>
            {/* Mini visual bar chart */}
            <View style={styles.barContainer}>
                {values.slice(-8).map((v, i) => {
                    const height = max === min ? 20 : ((v - min) / (max - min)) * 30 + 5;
                    return (
                        <View key={i} style={styles.barWrapper}>
                            <View style={[styles.bar, { height, backgroundColor: color + '99' }]} />
                        </View>
                    );
                })}
            </View>
            <View style={styles.chartFooter}>
                <Text variant="labelSmall" style={{ color: '#999' }}>Range: {min.toFixed(1)} – {max.toFixed(1)} {unit}</Text>
            </View>
        </Surface>
    );
}

export default function CageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();

    const [cage, setCage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Stock modal
    const [showStockModal, setShowStockModal] = useState(false);
    const [species, setSpecies] = useState('Tilapia');
    const [quantity, setQuantity] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [stocking, setStocking] = useState(false);
    const [stockError, setStockError] = useState('');

    // Sensor modal
    const [showSensorModal, setShowSensorModal] = useState(false);
    const [temperature, setTemperature] = useState('');
    const [dissolvedOxygen, setDissolvedOxygen] = useState('');
    const [ph, setPh] = useState('');
    const [recording, setRecording] = useState(false);

    const handleStock = async () => {
        if (!quantity || parseInt(quantity) <= 0) {
            setStockError('Enter a valid quantity');
            return;
        }
        setStocking(true);
        setStockError('');
        try {
            await api.post(`/cages/${id}/stock`, {
                species,
                quantity: parseInt(quantity),
                estimatedHarvestDate: harvestDate || undefined
            });
            setShowStockModal(false);
            setSpecies('Tilapia');
            setQuantity('');
            setHarvestDate('');
            fetchCage(); // Refresh
        } catch (err) {
            setStockError('Failed to stock batch');
        } finally {
            setStocking(false);
        }
    };

    const handleRecordSensor = async () => {
        setRecording(true);
        try {
            await api.post(`/cages/${id}/readings`, {
                temperature: temperature ? parseFloat(temperature) : undefined,
                ph: ph ? parseFloat(ph) : undefined,
                dissolvedOxygen: dissolvedOxygen ? parseFloat(dissolvedOxygen) : undefined,
            });
            setShowSensorModal(false);
            setTemperature('');
            setPh('');
            setDissolvedOxygen('');
            fetchCage();
        } catch (err) {
            console.error(err);
        } finally {
            setRecording(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10, color: '#999' }}>Loading cage details...</Text>
            </View>
        );
    }

    if (!cage) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text variant="titleMedium" style={{ color: '#999' }}>Cage not found</Text>
                <Button mode="outlined" onPress={() => router.back()} style={{ marginTop: 15 }}>Go Back</Button>
            </View>
        );
    }

    const activeBatch = cage.batches?.find((b: any) => b.status === 'ACTIVE');
    const pastBatches = cage.batches?.filter((b: any) => b.status !== 'ACTIVE') || [];
    const sensors = cage.sensors || [];
    const capacityUsed = activeBatch ? (activeBatch.currentQuantity / (cage.capacity || 1)) * 100 : 0;

    // Days until harvest
    const daysToHarvest = activeBatch?.estimatedHarvestDate
        ? Math.ceil((new Date(activeBatch.estimatedHarvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <IconButton icon="arrow-left" onPress={() => router.back()} />
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{cage.name}</Text>
                        <Text variant="bodySmall" style={{ color: '#666' }}>
                            {cage.type?.charAt(0).toUpperCase() + cage.type?.slice(1)} • Capacity: {cage.capacity || 'N/A'}
                        </Text>
                    </View>
                    <Chip
                        icon={cage.status === 'ACTIVE' ? 'check-circle' : 'pause-circle'}
                        style={{
                            backgroundColor: cage.status === 'ACTIVE' ? '#E8F5E9' : '#FFF3E0',
                        }}
                        textStyle={{ color: cage.status === 'ACTIVE' ? '#2E7D32' : '#EF6C00', fontSize: 11 }}
                    >
                        {cage.status}
                    </Chip>
                </View>

                {cage.location && (
                    <View style={styles.locationRow}>
                        <Avatar.Icon icon="map-marker" size={24} style={{ backgroundColor: '#E3F2FD' }} color="#1565C0" />
                        <Text variant="bodySmall" style={{ marginLeft: 6, color: '#666' }}>{cage.location}</Text>
                    </View>
                )}

                {/* Active Batch Card */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Current Stock</Text>
                {activeBatch ? (
                    <Card style={styles.batchCard} mode="elevated">
                        <Card.Content>
                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar.Icon icon="fish" size={40} style={{ backgroundColor: '#E0F2F1' }} color="#00695C" />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{activeBatch.species}</Text>
                                        <Text variant="bodySmall" style={{ color: '#666' }}>
                                            Stocked: {new Date(activeBatch.stockingDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <Chip style={{ backgroundColor: '#E8F5E9' }} textStyle={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                    ACTIVE
                                </Chip>
                            </View>

                            <Divider style={{ marginVertical: 15 }} />

                            {/* Stats Grid */}
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: '#666' }}>Initial Stock</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>
                                        {activeBatch.quantity?.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: '#666' }}>Current</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                        {(activeBatch.currentQuantity || activeBatch.quantity)?.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text variant="labelSmall" style={{ color: '#666' }}>Capacity Used</Text>
                                    <Text variant="titleMedium" style={{
                                        fontWeight: 'bold',
                                        color: capacityUsed > 90 ? '#D32F2F' : capacityUsed > 70 ? '#EF6C00' : '#2E7D32'
                                    }}>
                                        {capacityUsed.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>

                            {daysToHarvest !== null && (
                                <Surface style={styles.harvestBanner} elevation={0}>
                                    <Avatar.Icon icon="calendar-clock" size={32} style={{ backgroundColor: 'transparent' }} color="#1565C0" />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text variant="labelSmall" style={{ color: '#1565C0' }}>Estimated Harvest</Text>
                                        <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: '#0D47A1' }}>
                                            {daysToHarvest > 0
                                                ? `${daysToHarvest} days remaining`
                                                : daysToHarvest === 0
                                                    ? 'Harvest today!'
                                                    : `${Math.abs(daysToHarvest)} days overdue`}
                                        </Text>
                                    </View>
                                </Surface>
                            )}

                            {/* AI Vision Beta Integration */}
                            <Divider style={{ marginVertical: 15 }} />
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>Live Camera Feed (AI)</Text>
                            <Button 
                                mode="contained-tonal" 
                                icon="camera-iris"
                                loading={analyzingVision}
                                disabled={analyzingVision}
                                onPress={handleVisionAnalysis}
                                style={{ backgroundColor: '#E0F7FA' }}
                                textColor="#006064"
                            >
                                {analyzingVision ? 'Analyzing Satiety...' : 'Analyze Feeding Behavior'}
                            </Button>

                            {visionResult && (
                                <Surface style={{ marginTop: 15, padding: 15, backgroundColor: '#F1F8E9', borderRadius: 8 }} elevation={0}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text variant="labelMedium" style={{ color: '#33691E', fontWeight: 'bold' }}>AI Recommendation</Text>
                                        <Text variant="labelSmall" style={{ color: '#7CB342' }}>{visionResult.timestamp.split('T')[1].substring(0, 5)}</Text>
                                    </View>
                                    <Text variant="bodyMedium" style={{ color: '#33691E', marginTop: 5 }}>{visionResult.recommendation}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                        <Chip icon="tag" style={{ backgroundColor: 'white', marginRight: 10 }} textStyle={{ fontSize: 10, color: '#558B2F' }}>
                                            Save: {visionResult.estimatedSavings} feed
                                        </Chip>
                                        <Text variant="labelSmall" style={{ color: '#8BC34A' }}>Confidence: {(visionResult.confidenceScore * 100).toFixed(0)}%</Text>
                                    </View>
                                </Surface>
                            )}

                        </Card.Content>
                    </Card>
                ) : (
                    <Card style={[styles.batchCard, { borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' }]}>
                        <Card.Content style={{ alignItems: 'center', paddingVertical: 30 }}>
                            <Avatar.Icon icon="fish" size={48} style={{ backgroundColor: '#F5F5F5' }} color="#999" />
                            <Text variant="bodyMedium" style={{ color: '#999', marginTop: 10 }}>No active stock in this cage</Text>
                            <Button
                                mode="contained"
                                onPress={() => setShowStockModal(true)}
                                style={{ marginTop: 15 }}
                                icon="plus"
                            >
                                Stock Fish
                            </Button>
                        </Card.Content>
                    </Card>
                )}

                {/* Sensor Readings */}
                <View style={styles.row}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Water Quality</Text>
                    <Button
                        mode="text"
                        icon="plus"
                        compact
                        onPress={() => setShowSensorModal(true)}
                        labelStyle={{ fontSize: 12 }}
                    >
                        Record
                    </Button>
                </View>

                {sensors.length > 0 ? (
                    <View>
                        <SensorChart
                            readings={sensors}
                            metric="temperature"
                            label="Temperature"
                            unit="°C"
                            color="#FF5722"
                            warningRange={{ min: 24, max: 30 }}
                        />
                        <SensorChart
                            readings={sensors}
                            metric="ph"
                            label="pH Level"
                            unit=""
                            color="#4CAF50"
                            warningRange={{ min: 6.5, max: 8.5 }}
                        />
                        <SensorChart
                            readings={sensors}
                            metric="dissolvedOxygen"
                            label="Dissolved Oxygen"
                            unit="mg/L"
                            color="#2196F3"
                            warningRange={{ min: 5, max: 15 }}
                        />
                    </View>
                ) : (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Text style={{ color: '#999' }}>No sensor readings yet</Text>
                            <Button mode="outlined" onPress={() => setShowSensorModal(true)} style={{ marginTop: 10 }}>
                                Add First Reading
                            </Button>
                        </Card.Content>
                    </Card>
                )}

                {/* Batch History */}
                {pastBatches.length > 0 && (
                    <>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Batch History</Text>
                        {pastBatches.map((batch: any) => (
                            <Card key={batch.id} style={styles.historyCard}>
                                <Card.Content>
                                    <View style={styles.row}>
                                        <View>
                                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{batch.species}</Text>
                                            <Text variant="bodySmall" style={{ color: '#666' }}>
                                                {new Date(batch.stockingDate).toLocaleDateString()} — {batch.status}
                                            </Text>
                                        </View>
                                        <Text variant="bodyMedium">{batch.quantity} fish</Text>
                                    </View>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Button 
                                            mode="text" 
                                            icon="file-certificate" 
                                            compact
                                            onPress={() => router.push(`/farmer/cages/passport?batchId=${batch.id}` as any)}
                                        >
                                            View Export Passport
                                        </Button>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                    </>
                )}
            </ScrollView>

            {/* Stock Fish FAB */}
            {activeBatch ? null : (
                <FAB
                    icon="plus"
                    label="Stock Fish"
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    color="white"
                    onPress={() => setShowStockModal(true)}
                />
            )}

            {/* Stock Batch Modal */}
            <Portal>
                <Modal visible={showStockModal} onDismiss={() => setShowStockModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Stock New Batch</Text>

                    <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '500' }}>Species</Text>
                    <View style={styles.speciesRow}>
                        {['Tilapia', 'Nile Perch', 'Catfish', 'Sardine'].map(s => (
                            <Chip
                                key={s}
                                selected={species === s}
                                onPress={() => setSpecies(s)}
                                style={[styles.speciesChip, species === s && { backgroundColor: theme.colors.primaryContainer }]}
                            >
                                {s}
                            </Chip>
                        ))}
                    </View>

                    <TextInput
                        label="Quantity"
                        value={quantity}
                        onChangeText={setQuantity}
                        mode="outlined"
                        keyboardType="numeric"
                        placeholder="e.g. 500"
                        style={{ marginBottom: 15 }}
                    />

                    <TextInput
                        label="Estimated Harvest Date"
                        value={harvestDate}
                        onChangeText={setHarvestDate}
                        mode="outlined"
                        placeholder="YYYY-MM-DD"
                        style={{ marginBottom: 15 }}
                    />

                    {stockError ? <Text style={{ color: 'red', marginBottom: 10 }}>{stockError}</Text> : null}

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                        <Button mode="outlined" onPress={() => setShowStockModal(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleStock} loading={stocking} disabled={stocking}>
                            Stock Batch
                        </Button>
                    </View>
                </Modal>
            </Portal>

            {/* Record Sensor Modal */}
            <Portal>
                <Modal visible={showSensorModal} onDismiss={() => setShowSensorModal(false)} contentContainerStyle={styles.modal}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Record Water Quality</Text>

                    <TextInput
                        label="Temperature (°C)"
                        value={temperature}
                        onChangeText={setTemperature}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        placeholder="e.g. 26.5"
                        style={{ marginBottom: 15 }}
                        left={<TextInput.Icon icon="thermometer" />}
                    />

                    <TextInput
                        label="pH Level"
                        value={ph}
                        onChangeText={setPh}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        placeholder="e.g. 7.2"
                        style={{ marginBottom: 15 }}
                        left={<TextInput.Icon icon="test-tube" />}
                    />

                    <TextInput
                        label="Dissolved Oxygen (mg/L)"
                        value={dissolvedOxygen}
                        onChangeText={setDissolvedOxygen}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        placeholder="e.g. 6.5"
                        style={{ marginBottom: 15 }}
                        left={<TextInput.Icon icon="waves" />}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                        <Button mode="outlined" onPress={() => setShowSensorModal(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleRecordSensor} loading={recording} disabled={recording}>
                            Save Reading
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingTop: 10, paddingBottom: 5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    sectionTitle: { fontWeight: 'bold', color: '#333', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
    batchCard: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
    statBox: { alignItems: 'center', flex: 1 },
    harvestBanner: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD',
        borderRadius: 12, padding: 12, marginTop: 15
    },
    chartCard: { marginHorizontal: 20, marginBottom: 10, borderRadius: 12, padding: 16, backgroundColor: 'white' },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    barContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 40, marginTop: 10, gap: 4 },
    barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
    bar: { width: '80%', borderRadius: 3, minHeight: 3 },
    chartFooter: { marginTop: 6 },
    emptyCard: { marginHorizontal: 20, borderRadius: 12, backgroundColor: 'white' },
    historyCard: { marginHorizontal: 20, marginBottom: 8, borderRadius: 12, backgroundColor: '#FAFAFA' },
    fab: { position: 'absolute', margin: 20, right: 0, bottom: 0 },
    modal: { backgroundColor: 'white', margin: 20, padding: 25, borderRadius: 16 },
    speciesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    speciesChip: { marginBottom: 4 },
});
