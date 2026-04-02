import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, ActivityIndicator, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/services/api';

export default function CreditScoreScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [creditData, setCreditData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loanRequested, setLoanRequested] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCreditScore();
        }
    }, [user]);

    const fetchCreditScore = async () => {
        try {
            const data = await api.get(`/credit/${user?.id}`);
            setCreditData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoanRequest = () => {
        setLoanRequested(true);
        setTimeout(() => setLoanRequested(false), 3000); // Mock processing
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!creditData) {
        return (
            <View style={styles.container}>
                <Text>Unable to calculate credit score at this time. Start recording batches to build your profile.</Text>
            </View>
        );
    }

    const scoreProgress = creditData.score / 1000;
    const progressColor = creditData.riskLevel === 'LOW' ? 'green' : creditData.riskLevel === 'MEDIUM' ? 'orange' : 'red';

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>Economic Identity</Text>
            
            <Card style={styles.card}>
                <Card.Content style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Text variant="titleMedium" style={{ color: '#666', marginBottom: 10 }}>Your Trust Score</Text>
                    <Text variant="displayLarge" style={{ fontWeight: 'bold', color: progressColor }}>
                        {creditData.score}
                    </Text>
                    <ProgressBar 
                        progress={scoreProgress} 
                        color={progressColor} 
                        style={{ height: 10, borderRadius: 5, width: '80%', marginVertical: 15 }} 
                    />
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: progressColor }}>
                        {creditData.riskLevel} RISK PROFILE
                    </Text>

                    <Divider style={{ width: '100%', marginVertical: 20 }} />

                    <View style={styles.row}>
                        <Text variant="bodyLarge">Pre-Approved Loan Limit</Text>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#00609C' }}>
                            {parseInt(creditData.loanLimit).toLocaleString()} TZS
                        </Text>
                    </View>
                    <Text variant="bodySmall" style={{ color: '#666', marginTop: 10, textAlign: 'center' }}>
                        This limit is calculated automatically based on your active cages, historical survival rates, and completed marketplace sales.
                    </Text>
                </Card.Content>
            </Card>

            <Text variant="titleLarge" style={[styles.header, { marginTop: 10 }]}>Available Products</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Feed & Fingerling Asset Financing</Text>
                    <Text variant="bodyMedium" style={{ marginTop: 5, color: '#444' }}>
                        Get high-quality Skretting feed or mono-sex fingerlings delivered directly to your farm. Repay automatically from your escrow at harvest time.
                    </Text>
                </Card.Content>
                <Card.Actions style={{ padding: 15 }}>
                    <Button 
                        mode="contained" 
                        onPress={handleLoanRequest} 
                        loading={loanRequested}
                        disabled={loanRequested}
                        style={{ width: '100%', backgroundColor: '#00609C' }}
                    >
                        {loanRequested ? 'Processing Application...' : 'Apply for Input Loan'}
                    </Button>
                </Card.Actions>
            </Card>

            {loanRequested && (
                <Text style={{ textAlign: 'center', color: 'green', marginTop: 10, fontWeight: 'bold' }}>
                    Application submitted successfully! Our financial partners will contact you shortly.
                </Text>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 15 },
    header: { fontWeight: 'bold', color: '#333', marginBottom: 15 },
    card: { marginBottom: 20, backgroundColor: 'white' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }
});
