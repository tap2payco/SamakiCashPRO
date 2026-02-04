import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, ActivityIndicator, IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function FarmerDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const theme = useTheme();
    const [cages, setCages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchCages();
    }, [user]);

    const fetchCages = async () => {
        try {
            const data = await api.get('/cages');
            setCages(data);
        } catch (err) {
            console.error('Failed to fetch cages', err);
        } finally {
            setLoading(false);
        }
    };

    // Derived Stats
    const totalFish = cages.reduce((sum, cage) => {
        const activeBatch = cage.batches?.[0]; // Assuming recent batch
        return sum + (activeBatch?.currentQuantity || 0);
    }, 0);

    const cagesInUse = cages.filter(c => c.batches?.length > 0 && c.batches[0].status === 'ACTIVE').length;

    const renderCageCard = (cage: any) => {
        const batch = cage.batches?.[0];
        const sensor = cage.sensors?.[0];

        return (
            <Card style={styles.cageCard} key={cage.id} mode="elevated" onPress={() => router.push(`/farmer/cages/${cage.id}`)}>
                <Card.Content>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon icon="grid" size={36} style={{ backgroundColor: '#E0F2F1' }} color="#00695C" />
                            <View style={{ marginLeft: 10 }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{cage.name}</Text>
                                <Text variant="bodySmall" style={{ color: '#666' }}>{cage.type}</Text>
                            </View>
                        </View>
                        <IconButton icon="chevron-right" onPress={() => router.push(`/farmer/cages/${cage.id}`)} />
                    </View>

                    {batch ? (
                        <View style={{ marginTop: 15 }}>
                            <View style={styles.row}>
                                <Text variant="bodyMedium">Stock: {batch.species}</Text>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{batch.currentQuantity} pcs</Text>
                            </View>
                            <ProgressBar progress={0.6} color={theme.colors.primary} style={{ marginTop: 5, height: 6, borderRadius: 3 }} />
                            <Text variant="caption" style={{ marginTop: 2, color: '#666' }}>Est. Harvest: {batch.estimatedHarvestDate ? new Date(batch.estimatedHarvestDate).toLocaleDateString() : 'N/A'}</Text>
                        </View>
                    ) : (
                        <Text style={{ marginTop: 15, fontStyle: 'italic', color: '#999' }}>Empty Cage</Text>
                    )}

                    {sensor && (
                        <View style={styles.sensorRow}>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall">Temp</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>{sensor.temperature}°C</Text>
                            </View>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall">pH</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>{sensor.ph}</Text>
                            </View>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall">DO</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>{sensor.dissolvedOxygen} mg/L</Text>
                            </View>
                        </View>
                    )}
                </Card.Content>
            </Card>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>My Farm</Text>
                <IconButton icon="plus" mode="contained" containerColor={theme.colors.primary} iconColor="white" size={20} onPress={() => router.push('/farmer/cages/create')} />
            </View>

            {/* Overview Cards */}
            <View style={styles.statsRow}>
                <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Card.Content style={styles.center}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#1565C0' }}>{cages.length}</Text>
                        <Text variant="labelMedium" style={{ color: '#1565C0' }}>Total Cages</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Card.Content style={styles.center}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#2E7D32' }}>{totalFish.toLocaleString()}</Text>
                        <Text variant="labelMedium" style={{ color: '#2E7D32' }}>Live Fish</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                    <Card.Content style={styles.center}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#EF6C00' }}>{cages.length - cagesInUse}</Text>
                        <Text variant="labelMedium" style={{ color: '#EF6C00' }}>Empty</Text>
                    </Card.Content>
                </Card>
            </View>

            <Text variant="titleLarge" style={styles.sectionTitle}>Cage Status</Text>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <View>
                    {cages.length === 0 ? (
                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <Text style={{ color: '#999', marginBottom: 10 }}>No cages found.</Text>
                            <Button mode="outlined" onPress={() => router.push('/farmer/cages/create')}>Create First Cage</Button>
                        </View>
                    ) : (
                        cages.map(renderCageCard)
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '31%', borderRadius: 12 },
    center: { alignItems: 'center', paddingVertical: 5 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 15, color: '#333' },
    cageCard: { marginBottom: 15, backgroundColor: 'white', borderRadius: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sensorRow: { flexDirection: 'row', marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
    sensorItem: { flex: 1, alignItems: 'center' }
});
