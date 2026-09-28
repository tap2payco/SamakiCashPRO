import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Divider, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/services/api';
import { BlurView } from 'expo-blur';

export default function InsuranceDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [cages, setCages] = useState<any[]>([]);
    const [policies, setPolicies] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // First get farmer's cages
            const cageData = await api.get(`/cages/farmer/${user?.id}`);
            setCages(cageData);

            // Fetch policy for each cage
            const policyPromises = cageData.map(async (cage: any) => {
                const policy = await api.get(`/insurance/${cage.id}/farmer/${user?.id}`);
                return { cageId: cage.id, policy };
            });

            const results = await Promise.all(policyPromises);
            const policyMap: any = {};
            results.forEach(res => {
                policyMap[res.cageId] = res.policy;
            });
            
            setPolicies(policyMap);
        } catch (err) {
            console.error('Failed to fetch insurance data', err);
        } finally {
            setLoading(false);
        }
    };

    const renderPolicyCard = ({ item: cage }: { item: any }) => {
        const policy = policies[cage.id];
        if (!policy) return null;

        const isTriggered = policy.status === 'TRIGGERED' || policy.status === 'PAID_OUT';

        return (
            <BlurView intensity={30} tint="dark" style={[styles.card, isTriggered && styles.triggeredCard]}>
                <View style={styles.cardPad}>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon icon={isTriggered ? 'shield-alert-outline' : 'shield-check-outline'} size={48} style={{ backgroundColor: isTriggered ? 'rgba(255, 82, 82, 0.1)' : 'rgba(0, 230, 118, 0.1)' }} color={isTriggered ? '#FF5252' : '#00E676'} />
                            <View style={{ marginLeft: 15 }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>{cage.name}</Text>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: 1 }}>COVER: {parseInt(policy.coverageLimit).toLocaleString()} TZS</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { borderColor: isTriggered ? '#FF5252' : '#00E676', backgroundColor: isTriggered ? 'rgba(255,82,82,0.2)' : 'rgba(0,230,118,0.2)' }]}>
                            <Text style={[styles.statusText, { color: isTriggered ? '#FF5252' : '#00E676' }]}>{policy.status}</Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    {isTriggered ? (
                        <View style={styles.alertBox}>
                            <Text variant="titleSmall" style={{ color: '#FF5252', fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 }}>
                                ADVERSE CONDITION TRIGGERED!
                            </Text>
                            <Text variant="bodySmall" style={{ color: 'rgba(255,82,82,0.8)', lineHeight: 20 }}>
                                A severe drop in dissolved oxygen or a lethal temperature spike was detected by your sensors. Our adjusters have been notified to process an automatic payout to your account.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.row}>
                            <View>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Valid Until</Text>
                                <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: 'white' }}>{new Date(policy.endDate).toLocaleDateString()}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Annual Premium</Text>
                                <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: '#00E5FF' }}>{parseInt(policy.premiumAmount).toLocaleString()} TZS</Text>
                            </View>
                        </View>
                    )}
                </View>
            </BlurView>
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} color="#00E5FF" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: '900', flex: 1, color: 'white', letterSpacing: 1 }}>Parametric Insurance</Text>
                <IconButton icon="refresh" iconColor="#00E5FF" onPress={fetchData} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <BlurView intensity={20} tint="dark" style={styles.infoBox}>
                    <Text style={styles.description}>
                        Samaki AI actively monitors your cage telemetry. If fatal water conditions occur (Oxygen &lt; 3.0 mg/L or Temp &gt; 32°C), your policy is automatically triggered without paperwork.
                    </Text>
                </BlurView>

                <FlatList
                    data={cages}
                    renderItem={renderPolicyCard}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 40, padding: 20 }}>
                            <Avatar.Icon icon="shield-off-outline" size={80} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="white" />
                            <Text style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.7)' }}>No active cages to insure.</Text>
                        </View>
                    }
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    scroll: { padding: 25, paddingBottom: 50 },
    infoBox: { padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.2)' },
    description: { color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
    card: { marginBottom: 25, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 230, 118, 0.3)', elevation: 10, shadowColor: '#00E676', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15 },
    triggeredCard: { borderColor: '#FF5252', shadowColor: '#FF5252' },
    cardPad: { padding: 25 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontWeight: 'bold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
    alertBox: { backgroundColor: 'rgba(255, 82, 82, 0.1)', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 82, 82, 0.3)' }
});
