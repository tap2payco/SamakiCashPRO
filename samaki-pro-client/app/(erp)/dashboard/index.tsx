import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Avatar, ActivityIndicator, IconButton, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

export default function FarmerDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [cages, setCages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCages();
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
        const isActive = !!batch;

        return (
            <BlurView intensity={25} tint="light" style={styles.cageCard} key={cage.id}>
                <View style={styles.cardPad}>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon 
                                icon="grid" 
                                size={44} 
                                style={{ backgroundColor: isActive ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.2)' }} 
                                color={isActive ? '#00E676' : '#FFFFFF'} 
                            />
                            <View style={{ marginLeft: 15 }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{cage.name}</Text>
                                <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>{cage.type.toUpperCase()}</Text>
                            </View>
                        </View>
                        <IconButton icon="chevron-right" iconColor="white" onPress={() => router.push(`/farmer/cages/${cage.id}` as any)} />
                    </View>

                    {batch ? (
                        <View style={{ marginTop: 20 }}>
                            <View style={styles.row}>
                                <Text variant="bodyMedium" style={{ color: 'white' }}>Stock: <Text style={{ fontWeight: 'bold' }}>{batch.species}</Text></Text>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: '#00E676' }}>{batch.currentQuantity} pcs</Text>
                            </View>
                            <ProgressBar progress={batch.currentQuantity / cage.capacity} color="#00E676" style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                            <Text variant="caption" style={{ marginTop: 5, color: 'rgba(255,255,255,0.6)' }}>Est. Harvest: {batch.estimatedHarvestDate ? new Date(batch.estimatedHarvestDate).toLocaleDateString() : 'N/A'}</Text>
                        </View>
                    ) : (
                        <View style={{ marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                            <Text style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>Cage Empty - Ready for Stocking</Text>
                        </View>
                    )}

                    {sensor && (
                        <View style={styles.sensorRow}>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.6)' }}>Temp</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold', color: '#FFB74D' }}>{sensor.temperature}°C</Text>
                            </View>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.6)' }}>pH</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold', color: '#81C784' }}>{sensor.ph}</Text>
                            </View>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.6)' }}>DO</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold', color: '#4FC3F7' }}>{sensor.dissolvedOxygen} mg/L</Text>
                            </View>
                        </View>
                    )}
                    
                    <Button 
                        mode="contained" 
                        onPress={() => router.push(`/farmer/cages/${cage.id}` as any)} 
                        style={{ marginTop: 15, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                        Manage Cage
                    </Button>
                </View>
            </BlurView>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="white" />}
            >
                <View style={styles.header}>
                    <IconButton icon="home" iconColor="white" onPress={() => router.push('/')} />
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1, color: 'white', letterSpacing: 0.5 }}>Farm Telemetry</Text>
                    <IconButton icon="plus" mode="contained" containerColor="rgba(255,255,255,0.2)" iconColor="white" size={24} onPress={() => router.push('/farmer/cages/create')} />
                </View>

                {/* Dashboard Stats */}
                <View style={styles.statsRow}>
                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#4FC3F7' }}>{cages.length}</Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Cages</Text>
                        </View>
                    </BlurView>
                    
                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#00E676' }}>{totalFish >= 1000 ? (totalFish/1000).toFixed(1)+'k' : totalFish}</Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Live Fish</Text>
                        </View>
                    </BlurView>

                    <BlurView intensity={20} tint="light" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#FFB74D' }}>{cages.length - cagesInUse}</Text>
                            <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Empty</Text>
                        </View>
                    </BlurView>
                </View>

                {/* ERP Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 10 }}>
                    <Button mode="contained" icon="credit-card" style={styles.actionBtn} buttonColor="rgba(255,255,255,0.15)">
                        Credit
                    </Button>
                    <Button mode="contained" icon="shield-check" style={styles.actionBtn} buttonColor="rgba(255,255,255,0.15)">
                        Insurance
                    </Button>
                    <Button mode="contained" icon="leaf" style={styles.actionBtn} buttonColor="rgba(0, 230, 118, 0.2)">
                        Carbon
                    </Button>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Cage Network</Text>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="white" />
                ) : (
                    <View>
                        {cages.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Avatar.Icon icon="fish-off" size={80} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="white" />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 15 }}>No cages detected in your network.</Text>
                                <Button mode="contained" buttonColor="#0288D1" onPress={() => router.push('/farmer/cages/create')}>Deploy First Cage</Button>
                            </View>
                        ) : (
                            cages.map(renderCageCard)
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, gap: 10 },
    statCard: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    statPad: { alignItems: 'center', paddingVertical: 20 },
    actionBtn: { flex: 1 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 20, color: 'white', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
    cageCard: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardPad: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sensorRow: { flexDirection: 'row', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    sensorItem: { flex: 1, alignItems: 'center' }
});
