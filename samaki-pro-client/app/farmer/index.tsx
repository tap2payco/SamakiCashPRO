import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, Divider, IconButton, Avatar, Button } from 'react-native-paper';
import { api } from '../../services/api';
import { useRouter } from 'expo-router';

export default function FarmerScreen() {
    const [marketData, setMarketData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get('/agents/market/prices')
            .then(data => setMarketData(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const renderMarket = (marketKey: string) => {
        const market = marketData?.markets?.[marketKey];
        if (!market) return null;

        return (
            <Card style={styles.marketCard} key={marketKey} mode="outlined">
                <Card.Title
                    title={market.name}
                    subtitle={market.location}
                    left={(props) => <Avatar.Icon {...props} icon="store" size={40} style={{ backgroundColor: '#E1F5FE' }} color="#0288D1" />}
                />
                <Card.Content>
                    {market.prices.map((p: any, i: number) => (
                        <View key={i} style={[styles.priceRow, i === market.prices.length - 1 && { borderBottomWidth: 0 }]}>
                            <View>
                                <Text variant="bodyLarge" style={{ fontWeight: '500' }}>{p.species}</Text>
                                <Text variant="labelSmall" style={{ color: '#666' }}>per {p.unit}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>
                                    {p.price.toLocaleString()} TZS
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: p.trend === 'up' ? 'green' : p.trend === 'down' ? 'red' : 'gray', fontSize: 12, marginRight: 4 }}>
                                        {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '−'} {Math.abs(p.change)}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>Farmer Dashboard</Text>
                <IconButton icon="bell-outline" onPress={() => { }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Quick Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card style={[styles.statCard, { backgroundColor: '#E8EAF6' }]}>
                        <Card.Content style={styles.statContent}>
                            <Avatar.Icon icon="fish" size={36} style={{ backgroundColor: 'white' }} color="#3F51B5" />
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', marginTop: 10, color: '#3F51B5' }}>4</Text>
                            <Text variant="bodyMedium" style={{ color: '#5C6BC0' }}>Active Cages</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#E0F2F1' }]}>
                        <Card.Content style={styles.statContent}>
                            <Avatar.Icon icon="scale" size={36} style={{ backgroundColor: 'white' }} color="#009688" />
                            <Text variant="displaySmall" style={{ fontWeight: 'bold', marginTop: 10, color: '#009688' }}>2.5k</Text>
                            <Text variant="bodyMedium" style={{ color: '#26A69A' }}>Est. Stock (kg)</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* AI Insight Section */}
                <Text variant="titleMedium" style={styles.sectionTitle}>✨ Market Insights</Text>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 20 }} />
                ) : (
                    <View>
                        {marketData?.summary && (
                            <Card style={styles.insightCard}>
                                <Card.Content>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <Avatar.Icon icon="robot" size={32} style={{ backgroundColor: '#FFF3E0', marginRight: 10 }} color="#F57C00" />
                                        <Text variant="titleSmall" style={{ color: '#EF6C00', fontWeight: 'bold' }}>AI RECOMMENDATION</Text>
                                    </View>
                                    <Text variant="bodyLarge" style={{ lineHeight: 22 }}>{marketData.summary.recommendation}</Text>
                                </Card.Content>
                            </Card>
                        )}

                        <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 20 }]}>Live Market Prices</Text>
                        {renderMarket('kirumba')}
                        {renderMarket('mwaloni')}
                    </View>
                )}

                {/* Alerts Section */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Recent Alerts</Text>
                <Card style={styles.alertCard}>
                    <Card.Title
                        title="pH Levels Stable"
                        subtitle="Cage 1 - 2 mins ago"
                        left={(props) => <Avatar.Icon {...props} icon="check" size={36} style={{ backgroundColor: '#E8F5E9' }} color="green" />}
                    />
                </Card>
                <Card style={styles.alertCard}>
                    <Card.Title
                        title="Feeding Time Approaching"
                        subtitle="Cage 3 - 15 mins left"
                        left={(props) => <Avatar.Icon {...props} icon="clock-outline" size={36} style={{ backgroundColor: '#FFF8E1' }} color="#FFA000" />}
                    />
                </Card>

            </ScrollView>

            <View style={styles.fabContainer}>
                <Button mode="contained" icon="plus" onPress={() => { }} style={styles.actionButton}>Log Harvest</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', elevation: 2 },
    scrollContent: { padding: 20, paddingBottom: 80 },

    sectionTitle: { marginBottom: 15, fontWeight: 'bold', color: '#444' },

    statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statCard: { flex: 1, borderRadius: 16, elevation: 0 },
    statContent: { alignItems: 'center', paddingVertical: 10 },

    insightCard: { backgroundColor: 'white', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#F57C00', elevation: 2 },

    marketCard: { marginBottom: 15, backgroundColor: 'white', borderRadius: 12 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },

    alertCard: { marginBottom: 10, backgroundColor: 'white', borderRadius: 12, elevation: 1 },

    fabContainer: { padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee' },
    actionButton: { borderRadius: 8, paddingVertical: 4 }
});
