import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Animated, Easing } from 'react-native';
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

    // AI Animation Pulse
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (user) fetchCages();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
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

    const totalFish = cages.reduce((sum, cage) => sum + (cage.batches?.[0]?.currentQuantity || 0), 0);
    const cagesInUse = cages.filter(c => c.batches?.length > 0 && c.batches[0].status === 'ACTIVE').length;

    const renderAICard = () => {
        // Mock AI logic based on data
        let aiMessage = "System nominal. All telemetry parameters are within optimal ranges.";
        let aiColor = "#00E676"; // Emerald

        const cageWithHighTemp = cages.find(c => c.sensors?.[0]?.temperature > 28);
        if (cageWithHighTemp) {
            aiMessage = `ALERT: High temperature (${cageWithHighTemp.sensors[0].temperature.toFixed(1)}°C) detected in ${cageWithHighTemp.name}. Recommend activating aeration.`;
            aiColor = "#FF9100"; // Amber
        }

        return (
            <BlurView intensity={40} tint="dark" style={styles.aiCard}>
                <View style={styles.cardPad}>
                    <View style={styles.row}>
                        <View style={styles.aiHeader}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <Avatar.Icon icon="brain" size={32} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} color={aiColor} />
                            </Animated.View>
                            <Text variant="titleMedium" style={styles.aiTitle}>Samaki AI Engine</Text>
                        </View>
                        <Text style={{ color: aiColor, fontWeight: 'bold' }}>LIVE</Text>
                    </View>
                    <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 15, lineHeight: 22 }}>
                        {aiMessage}
                    </Text>
                    {cageWithHighTemp && (
                        <Button mode="contained" buttonColor={aiColor} textColor="#0F2027" style={{ marginTop: 15, borderRadius: 50 }}>
                            Auto-Adjust Aeration
                        </Button>
                    )}
                </View>
            </BlurView>
        );
    };

    const renderCageCard = (cage: any) => {
        const batch = cage.batches?.[0];
        const sensor = cage.sensors?.[0];
        const isActive = !!batch;

        return (
            <BlurView intensity={30} tint="dark" style={styles.cageCard} key={cage.id}>
                <View style={styles.cardPad}>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon 
                                icon="grid" 
                                size={44} 
                                style={{ backgroundColor: isActive ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.1)' }} 
                                color={isActive ? '#00E5FF' : 'rgba(255,255,255,0.4)'} 
                            />
                            <View style={{ marginLeft: 15 }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{cage.name}</Text>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{cage.type.toUpperCase()}</Text>
                            </View>
                        </View>
                        <IconButton icon="chevron-right" iconColor="white" onPress={() => router.push(`/production/cages/${cage.id}` as any)} />
                    </View>

                    {batch ? (
                        <View style={{ marginTop: 20 }}>
                            <View style={styles.row}>
                                <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.7)' }}>Stock: <Text style={{ color: 'white', fontWeight: 'bold' }}>{batch.species}</Text></Text>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: '#00E5FF' }}>{batch.currentQuantity} pcs</Text>
                            </View>
                            <ProgressBar progress={batch.currentQuantity / cage.capacity} color="#00E5FF" style={{ marginTop: 10, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                            <Text variant="labelSmall" style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)' }}>Est. Harvest: {batch.estimatedHarvestDate ? new Date(batch.estimatedHarvestDate).toLocaleDateString() : 'N/A'}</Text>
                        </View>
                    ) : (
                        <View style={{ marginTop: 20, padding: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                            <Text style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Awaiting Stock Deployment</Text>
                        </View>
                    )}

                    {sensor && (
                        <View style={styles.sensorRow}>
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={styles.sensorLabel}>TEMP</Text>
                                <Text variant="titleMedium" style={[styles.sensorValue, { color: sensor.temperature > 28 ? '#FF9100' : '#00E676' }]}>{sensor.temperature.toFixed(1)}°</Text>
                            </View>
                            <View style={styles.sensorDivider} />
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={styles.sensorLabel}>pH</Text>
                                <Text variant="titleMedium" style={[styles.sensorValue, { color: '#00E5FF' }]}>{sensor.ph.toFixed(1)}</Text>
                            </View>
                            <View style={styles.sensorDivider} />
                            <View style={styles.sensorItem}>
                                <Text variant="labelSmall" style={styles.sensorLabel}>OXYGEN</Text>
                                <Text variant="titleMedium" style={[styles.sensorValue, { color: '#00E676' }]}>{sensor.dissolvedOxygen.toFixed(1)} mg/L</Text>
                            </View>
                        </View>
                    )}
                </View>
            </BlurView>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00E5FF" />}
            >
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={styles.pageTitle}>Command Center</Text>
                    <Button mode="contained" buttonColor="#00E5FF" textColor="#0F2027" icon="plus" style={{ borderRadius: 50 }} onPress={() => router.push('/production/cages/create' as any)}>
                        Deploy Node
                    </Button>
                </View>

                {/* AI Insights Panel */}
                {!loading && renderAICard()}

                {/* Dashboard Stats */}
                <View style={styles.statsRow}>
                    <BlurView intensity={25} tint="dark" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#FFFFFF' }}>{cages.length}</Text>
                            <Text variant="labelMedium" style={styles.statLabel}>Active Nodes</Text>
                        </View>
                    </BlurView>
                    
                    <BlurView intensity={25} tint="dark" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#00E5FF' }}>{totalFish >= 1000 ? (totalFish/1000).toFixed(1)+'k' : totalFish}</Text>
                            <Text variant="labelMedium" style={styles.statLabel}>Biomass (pcs)</Text>
                        </View>
                    </BlurView>

                    <BlurView intensity={25} tint="dark" style={styles.statCard}>
                        <View style={styles.statPad}>
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#FF9100' }}>{cages.length - cagesInUse}</Text>
                            <Text variant="labelMedium" style={styles.statLabel}>Idle</Text>
                        </View>
                    </BlurView>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Live Telemetry</Text>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 60 }} color="#00E5FF" size="large" />
                ) : (
                    <View>
                        {cages.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Avatar.Icon icon="satellite-variant" size={80} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} color="rgba(255,255,255,0.3)" />
                                <Text style={{ color: 'rgba(255,255,255,0.5)', marginVertical: 20 }}>No IoT nodes detected in your network.</Text>
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
    container: { flexGrow: 1, padding: 25, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    pageTitle: { fontWeight: '900', color: 'white', letterSpacing: 0.5 },
    
    aiCard: { marginBottom: 30, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 230, 118, 0.3)', backgroundColor: 'rgba(0, 230, 118, 0.05)' },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    aiTitle: { fontWeight: 'bold', color: 'white', letterSpacing: 0.5 },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35, gap: 15 },
    statCard: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statPad: { alignItems: 'center', paddingVertical: 25 },
    statLabel: { color: 'rgba(255,255,255,0.5)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
    
    sectionTitle: { fontWeight: 'bold', marginBottom: 20, color: 'white', letterSpacing: 0.5 },
    
    cageCard: { marginBottom: 25, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.15)', elevation: 5, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    cardPad: { padding: 25 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    sensorRow: { flexDirection: 'row', marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', justifyContent: 'space-between' },
    sensorItem: { flex: 1, alignItems: 'center' },
    sensorDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
    sensorLabel: { color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 5 },
    sensorValue: { fontWeight: 'bold' },
    
    emptyState: { alignItems: 'center', marginTop: 60, padding: 40, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }
});
