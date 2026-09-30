import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Animated, Easing, TouchableOpacity } from 'react-native';
import { Text, Avatar, ActivityIndicator, IconButton, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { useAppTheme } from '~/theme';
import {
    PageHeader,
    SyncBar,
    MetricCard,
    AlertItem,
    StatusBadge,
    SourceTag,
    Button,
    GlassCard,
} from '~/components/ui';

export default function FarmerDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();
    const [cages, setCages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertAcknowledged, setAlertAcknowledged] = useState(false);

    const isSw = language === 'sw';

    // AI Animation Pulse
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (user) fetchCages();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.25, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
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
    const cageWithHighTemp = cages.find(c => c.sensors?.[0]?.temperature > 28);

    const renderAICard = () => {
        let aiMessage = isSw
            ? "Mifumo yote ya data iko katika hali salama na viwango vinavyokubalika."
            : "System nominal. All telemetry parameters are within optimal ranges.";

        if (cageWithHighTemp) {
            aiMessage = isSw
                ? `TAHADHARI: Joto la maji limepanda (${cageWithHighTemp.sensors[0].temperature.toFixed(1)}°C) katika ${cageWithHighTemp.name}. Inashauriwa kuwezesha hewa (aeration).`
                : `ALERT: High temperature (${cageWithHighTemp.sensors[0].temperature.toFixed(1)}°C) detected in ${cageWithHighTemp.name}. Recommend activating aeration.`;
        }

        return (
            <GlassCard 
                style={[
                    styles.aiCard, 
                    { 
                        borderColor: isSunMode ? colors.borderStrong : (cageWithHighTemp ? colors.watchFill : colors.primary),
                        borderWidth: isSunMode ? 2 : 1,
                        backgroundColor: colors.surfaceCard,
                    }
                ]}
            >
                <View style={styles.row}>
                    <View style={styles.aiHeader}>
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <Avatar.Icon 
                                icon="brain" 
                                size={32} 
                                style={{ backgroundColor: cageWithHighTemp ? colors.watchWash : colors.primaryWash }} 
                                color={cageWithHighTemp ? colors.watch : colors.primary} 
                            />
                        </Animated.View>
                        <Text style={[styles.aiTitle, { color: colors.ink }]}>
                            {isSw ? 'Injini ya Samaki AI' : 'Samaki AI Intelligence Engine'}
                        </Text>
                    </View>
                    <StatusBadge status={cageWithHighTemp ? 'watch' : 'ok'} size="sm" />
                </View>

                <Text style={[styles.aiText, { color: colors.inkMuted }]}>
                    {aiMessage}
                </Text>

                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <SourceTag source="sensor" timestamp="Live" />
                    {cageWithHighTemp && (
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onPress={() => {}}
                        >
                            {isSw ? 'Washa Hewa' : 'Auto-Adjust Aeration'}
                        </Button>
                    )}
                </View>
            </GlassCard>
        );
    };

    const renderCageCard = (cage: any) => {
        const batch = cage.batches?.[0];
        const sensor = cage.sensors?.[0];
        const isActive = !!batch;

        return (
            <GlassCard 
                key={cage.id}
                style={[
                    styles.cageCard,
                    {
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderWidth: isSunMode ? 2 : 1,
                        marginBottom: spacing.space3,
                    }
                ]}
            >
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar.Icon 
                            icon="grid" 
                            size={40} 
                            style={{ backgroundColor: isActive ? colors.primaryWash : colors.surfaceSunken }} 
                            color={isActive ? colors.primary : colors.inkMuted} 
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.cageName, { color: colors.ink }]}>{cage.name}</Text>
                            <Text style={[styles.cageType, { color: colors.inkMuted }]}>{cage.type}</Text>
                        </View>
                    </View>
                    <StatusBadge status={isActive ? 'ok' : 'no-reading'} size="sm" />
                </View>

                {batch ? (
                    <View style={{ marginTop: 14 }}>
                        <View style={styles.row}>
                            <Text style={{ color: colors.inkMuted, fontSize: 13 }}>
                                {isSw ? 'Samaki:' : 'Stock:'} <Text style={{ color: colors.ink, fontWeight: '700' }}>{batch.species}</Text>
                            </Text>
                            <Text style={{ fontWeight: '800', color: colors.primary, fontSize: 14 }}>
                                {batch.currentQuantity?.toLocaleString()} pcs
                            </Text>
                        </View>
                        <ProgressBar 
                            progress={batch.currentQuantity / cage.capacity} 
                            color={colors.primary} 
                            style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: colors.surfaceSunken }} 
                        />
                    </View>
                ) : (
                    <View style={[styles.awaitingBox, { backgroundColor: colors.surfaceSunken, borderRadius: radii.sm }]}>
                        <Text style={{ color: colors.inkMuted, fontSize: 13, fontStyle: 'italic', textAlign: 'center' }}>
                            {isSw ? 'Inasubiri kuwekwa vifaranga' : 'Awaiting stock deployment'}
                        </Text>
                    </View>
                )}

                {sensor && (
                    <View style={[styles.sensorRow, { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 14, paddingTop: 12 }]}>
                        <View style={styles.sensorItem}>
                            <Text style={[styles.sensorLabel, { color: colors.inkMuted }]}>{isSw ? 'JOTO' : 'TEMP'}</Text>
                            <Text style={[styles.sensorVal, { color: sensor.temperature > 28 ? colors.watch : colors.ok }]}>
                                {sensor.temperature.toFixed(1)}°C
                            </Text>
                        </View>
                        <View style={[styles.sensorDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.sensorItem}>
                            <Text style={[styles.sensorLabel, { color: colors.inkMuted }]}>pH</Text>
                            <Text style={[styles.sensorVal, { color: colors.ink }]}>
                                {sensor.ph.toFixed(1)}
                            </Text>
                        </View>
                        <View style={[styles.sensorDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.sensorItem}>
                            <Text style={[styles.sensorLabel, { color: colors.inkMuted }]}>{isSw ? 'OKSIJENI' : 'OXYGEN'}</Text>
                            <Text style={[styles.sensorVal, { color: colors.ok }]}>
                                {sensor.dissolvedOxygen.toFixed(1)} mg/L
                            </Text>
                        </View>
                    </View>
                )}
            </GlassCard>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
            <ScrollView 
                contentContainerStyle={[styles.container, { padding: spacing.space4, paddingBottom: 60 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
            >
                {/* Design System Page Header */}
                <PageHeader 
                    title={isSw ? 'Kituo cha Uendeshaji' : 'Command Center'}
                    subtitle={isSw ? 'Hali ya Vizimba Ziwa Victoria' : 'Lake Victoria Cage Telemetry'}
                    locationChip="Mwanza Gulf"
                    categoryChip="Cages"
                />

                {/* Live Sync Bar */}
                <View style={{ marginVertical: spacing.space2 }}>
                    <SyncBar state="synced" time="14:32" />
                </View>

                {/* Critical Alert Item if temperature is high */}
                {cageWithHighTemp && !alertAcknowledged && (
                    <View style={{ marginVertical: spacing.space2 }}>
                        <AlertItem 
                            status="watch"
                            title={isSw ? `Joto la maji linapanda katika ${cageWithHighTemp.name}` : `Water temperature is rising in ${cageWithHighTemp.name}`}
                            description={isSw 
                                ? `${cageWithHighTemp.sensors[0].temperature.toFixed(1)}°C iliyorekodiwa. Sitisha chakula au washa hewa kuzuia upungufu wa oksijeni.` 
                                : `${cageWithHighTemp.sensors[0].temperature.toFixed(1)}°C recorded. Pause feeding or activate aeration to prevent oxygen depletion.`}
                            source="sensor"
                            sourceTimestamp="2 min ago"
                            onAcknowledge={() => setAlertAcknowledged(true)}
                        />
                    </View>
                )}

                {/* AI Intelligence Panel */}
                {!loading && renderAICard()}

                {/* Key Performance Indicators (MetricCards) */}
                <Text style={[styles.sectionTitle, { color: colors.ink, marginTop: spacing.space3, marginBottom: spacing.space2 }]}>
                    {isSw ? 'Muhtasari wa Uzalishaji' : 'Operational Metrics'}
                </Text>
                
                <View style={styles.metricsGrid}>
                    <MetricCard 
                        label={isSw ? 'Vizimba Vilivyo Hai' : 'Active Cages'}
                        value={cages.length}
                        status="ok"
                        source="sensor"
                    />
                    <MetricCard 
                        label={isSw ? 'Kiasi cha Samaki' : 'Live Biomass'}
                        value={totalFish >= 1000 ? `${(totalFish / 1000).toFixed(1)}k` : totalFish}
                        unit="pcs"
                        status="ok"
                        source="sensor"
                    />
                </View>

                <View style={[styles.metricsGrid, { marginTop: spacing.space3 }]}>
                    <MetricCard 
                        label={isSw ? 'Mapato ya Mwezi' : 'Revenue this month'}
                        value="8,300,000"
                        currencyPrefix="TZS"
                        trend={{ direction: 'up', percent: 8, comparisonText: isSw ? 'ongezeko' : 'vs last mo' }}
                        source="demo"
                    />
                    <MetricCard 
                        label={isSw ? 'Vizimba Visivyotumika' : 'Idle Nodes'}
                        value={cages.length - cagesInUse}
                        status={cages.length - cagesInUse > 0 ? 'watch' : 'ok'}
                        source="manual"
                    />
                </View>

                {/* Telemetry Section Header with Action */}
                <View style={[styles.row, { marginTop: spacing.space4, marginBottom: spacing.space3 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.ink }]}>
                        {isSw ? 'Ufuatiliaji wa Moja kwa Moja' : 'Live Telemetry & Sensors'}
                    </Text>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        icon="plus" 
                        onPress={() => router.push('/production/cages/create' as any)}
                    >
                        {isSw ? 'Ongeza Kizimba' : 'Deploy Node'}
                    </Button>
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
                ) : (
                    <View>
                        {cages.length === 0 ? (
                            <View style={[styles.emptyWrap, { backgroundColor: colors.surfaceCard, borderColor: colors.border, borderRadius: radii.lg }]}>
                                <Avatar.Icon 
                                    icon="satellite-variant" 
                                    size={64} 
                                    style={{ backgroundColor: colors.surfaceSunken }} 
                                    color={colors.inkMuted} 
                                />
                                <Text style={{ color: colors.inkMuted, marginVertical: 14, textAlign: 'center' }}>
                                    {isSw ? 'Hakuna vihisi vya IoT vilivyopatikana kwenye mtandao wako.' : 'No IoT nodes detected in your network.'}
                                </Text>
                                <Button 
                                    variant="primary" 
                                    size="md" 
                                    icon="plus" 
                                    onPress={() => router.push('/production/cages/create' as any)}
                                >
                                    {isSw ? 'Ongeza Kizimba cha Kwanza' : 'Deploy First Node'}
                                </Button>
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
    container: { flexGrow: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    aiCard: { padding: 16, marginBottom: 16 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    aiTitle: { fontWeight: '700', fontSize: 15 },
    aiText: { marginTop: 10, lineHeight: 20, fontSize: 14 },
    sectionTitle: { fontWeight: '800', fontSize: 18, letterSpacing: -0.2 },
    metricsGrid: { flexDirection: 'row', gap: 12 },
    cageCard: { padding: 16 },
    cageName: { fontWeight: '700', fontSize: 16 },
    cageType: { fontSize: 12, marginTop: 2 },
    awaitingBox: { padding: 12, marginTop: 12 },
    sensorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sensorItem: { flex: 1, alignItems: 'center' },
    sensorDivider: { width: 1, height: 28 },
    sensorLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    sensorVal: { fontWeight: '800', fontSize: 15 },
    emptyWrap: { alignItems: 'center', padding: 32, borderWidth: 1 }
});
