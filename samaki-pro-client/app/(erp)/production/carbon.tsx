import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Surface, Avatar, Title, Paragraph, Dialog, Portal, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';

export default function BlueCarbonScreen() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [balanceData, setBalanceData] = useState<{ available: number, sold: number, transactions: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [sellModal, setSellModal] = useState(false);
    const [sellAmount, setSellAmount] = useState('');
    const [selling, setSelling] = useState(false);
    const [sellResult, setSellResult] = useState<any>(null);

    const fetchBalance = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get(`/carbon/${user.id}/balance`);
            setBalanceData(data);
        } catch (err) {
            console.error('Failed to fetch carbon balance', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => { fetchBalance(); }, [fetchBalance]);

    const onRefresh = () => { setRefreshing(true); fetchBalance(); };

    const handleSell = async () => {
        const amount = parseInt(sellAmount);
        if (isNaN(amount) || amount <= 0 || amount > (balanceData?.available || 0)) return;

        setSelling(true);
        try {
            const data = await api.post('/carbon/sell', {
                farmerId: user?.id,
                amount
            });
            setSellResult(data);
            fetchBalance();
        } catch (err) {
            console.error('Failed to sell credits', err);
        } finally {
            setSelling(false);
            setSellModal(false);
        }
    };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#1B5E20' }}>Blue Carbon</Text>
                <Avatar.Icon icon="leaf" style={{ backgroundColor: '#E8F5E9' }} color="#2E7D32" size={40} />
            </View>

            <Text style={styles.introText}>
                Samaki PRO tracks your farm's sustainability metrics. Earn Blue Carbon credits for clean harvests and sell them to voluntary corporate buyers.
            </Text>

            <Surface style={styles.balanceCard} elevation={2}>
                <View style={styles.balanceHeader}>
                    <Text variant="labelLarge" style={{ color: '#E8F5E9' }}>Available Tokens</Text>
                    {loading ? <Text style={{ color: 'white' }}>...</Text> : (
                        <Text variant="displayMedium" style={{ fontWeight: 'bold', color: 'white' }}>
                            {balanceData?.available || 0}
                        </Text>
                    )}
                    <Text variant="bodySmall" style={{ color: '#C8E6C9', marginTop: 5 }}>
                        ≈ {( (balanceData?.available || 0) * 12500 ).toLocaleString()} TZS Value
                    </Text>
                </View>
                <View style={styles.actionRow}>
                    <Button 
                        mode="contained" 
                        icon="currency-usd" 
                        buttonColor="white" 
                        textColor="#2E7D32"
                        onPress={() => setSellModal(true)}
                        disabled={!balanceData?.available || balanceData.available === 0}
                    >
                        Sell on Market
                    </Button>
                </View>
            </Surface>

            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text variant="labelSmall" style={{ color: '#666' }}>Total Sold</Text>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#333' }}>{balanceData?.sold || 0}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text variant="labelSmall" style={{ color: '#666' }}>Current Price</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#2E7D32' }}>12,500 TZS</Text>
                    </Card.Content>
                </Card>
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>Transaction History</Text>
            {balanceData?.transactions?.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ color: '#999' }}>No green transactions yet.</Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>Harvest a batch successfully to earn tokens.</Text>
                </View>
            ) : (
                balanceData?.transactions?.map((t: any) => (
                    <Card key={t.id} style={styles.historyCard}>
                        <Card.Content style={styles.historyRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Avatar.Icon 
                                    icon={t.status === 'AVAILABLE' ? 'plus' : 'minus'} 
                                    size={32} 
                                    style={{ backgroundColor: t.status === 'AVAILABLE' ? '#E8F5E9' : '#FFF3E0' }} 
                                    color={t.status === 'AVAILABLE' ? '#2E7D32' : '#E65100'} 
                                />
                                <View style={{ marginLeft: 12 }}>
                                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                                        {t.status === 'AVAILABLE' ? 'Token Yield' : 'Market Sale'}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: '#666' }}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Text variant="titleMedium" style={{ 
                                fontWeight: 'bold', 
                                color: t.status === 'AVAILABLE' ? '#2E7D32' : '#E65100' 
                            }}>
                                {t.status === 'AVAILABLE' ? '+' : '-'}{t.tokensEarned} CT
                            </Text>
                        </Card.Content>
                    </Card>
                ))
            )}

            {/* Sell Modal */}
            <Portal>
                <Dialog visible={sellModal} onDismiss={() => setSellModal(false)} style={{ backgroundColor: 'white' }}>
                    <Dialog.Title>Sell Carbon Tokens</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{ marginBottom: 15 }}>
                            Enter the amount of tokens you wish to liquidate. Corporate buyers are currently bidding at 12,500 TZS per token.
                        </Paragraph>
                        <TextInput
                            label={`Amount (Max: ${balanceData?.available || 0})`}
                            value={sellAmount}
                            onChangeText={setSellAmount}
                            keyboardType="numeric"
                            mode="outlined"
                        />
                        {sellAmount && !isNaN(parseInt(sellAmount)) && (
                            <Text style={{ marginTop: 10, color: '#2E7D32', fontWeight: 'bold' }}>
                                Estimated Payout: {(parseInt(sellAmount) * 12500).toLocaleString()} TZS
                            </Text>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSellModal(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleSell} loading={selling} disabled={selling || !sellAmount}>Confirm Sale</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Success Dialog */}
                <Dialog visible={!!sellResult} onDismiss={() => setSellResult(null)} style={{ backgroundColor: 'white' }}>
                    <Dialog.Title style={{ color: '#2E7D32' }}>Sale Successful</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>You successfully sold {sellResult?.sold} tokens.</Paragraph>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: 10 }}>
                            {sellResult?.estimatedPayoutTZS?.toLocaleString()} TZS has been deposited to your escrow wallet.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSellResult(null)}>Close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    introText: { paddingHorizontal: 20, color: '#666', marginBottom: 20 },
    balanceCard: { 
        marginHorizontal: 20, 
        backgroundColor: '#2E7D32',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20
    },
    balanceHeader: { padding: 30, alignItems: 'center' },
    actionRow: { backgroundColor: '#1B5E20', padding: 15, alignItems: 'center' },
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '48%', backgroundColor: 'white' },
    sectionTitle: { paddingHorizontal: 20, fontWeight: 'bold', marginBottom: 15 },
    historyCard: { marginHorizontal: 20, marginBottom: 10, backgroundColor: 'white' },
    historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
