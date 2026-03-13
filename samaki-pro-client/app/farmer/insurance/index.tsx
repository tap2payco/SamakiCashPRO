import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';

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
            <Card style={[styles.card, isTriggered && styles.triggeredCard]}>
                <Card.Content>
                    <View style={styles.row}>
                        <View>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{cage.name}</Text>
                            <Text variant="bodySmall" style={{ color: '#666' }}>Cover: {parseInt(policy.coverageLimit).toLocaleString()} TZS</Text>
                        </View>
                        <Chip 
                            icon={isTriggered ? 'alert' : 'shield-check'}
                            style={{ backgroundColor: isTriggered ? '#FFEBEE' : '#E8F5E9' }}
                            textStyle={{ color: isTriggered ? '#D32F2F' : '#2E7D32' }}
                        >
                            {policy.status}
                        </Chip>
                    </View>

                    <Divider style={{ marginVertical: 12 }} />

                    {isTriggered ? (
                        <View style={{ backgroundColor: '#FFF3E0', padding: 10, borderRadius: 8 }}>
                            <Text variant="titleSmall" style={{ color: '#E65100', fontWeight: 'bold', marginBottom: 5 }}>
                                Adverse Condition Triggered!
                            </Text>
                            <Text variant="bodySmall" style={{ color: '#E65100' }}>
                                A severe drop in dissolved oxygen or a lethal temperature spike was detected by your sensors. Our adjusters have been notified to process an automatic payout to your account.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.row}>
                            <View>
                                <Text variant="labelSmall" style={{ color: '#999' }}>Valid Until</Text>
                                <Text variant="bodySmall">{new Date(policy.endDate).toLocaleDateString()}</Text>
                            </View>
                            <View>
                                <Text variant="labelSmall" style={{ color: '#999' }}>Annual Premium</Text>
                                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>{parseInt(policy.premiumAmount).toLocaleString()} TZS</Text>
                            </View>
                        </View>
                    )}
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>Parametric Insurance</Text>
                <IconButton icon="refresh" onPress={fetchData} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.description}>
                    Samaki PRO actively monitors your cage sensors. If fatal water conditions occur (Oxygen &lt; 3.0 mg/L or Temp &gt; 32°C), your policy is automatically triggered without paperwork.
                </Text>

                <FlatList
                    data={cages}
                    renderItem={renderPolicyCard}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No active cages to insure.</Text>}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', elevation: 2 },
    scroll: { padding: 15, paddingBottom: 50 },
    description: { color: '#666', marginBottom: 20, fontStyle: 'italic', lineHeight: 20 },
    card: { marginBottom: 15, backgroundColor: 'white', borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
    triggeredCard: { borderLeftColor: '#F44336' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
