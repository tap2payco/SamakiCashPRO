import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import QRCode from 'react-native-qrcode-svg';

export default function ExportPassportScreen() {
    const { batchId } = useLocalSearchParams<{ batchId: string }>();
    const router = useRouter();
    const { user } = useAuth();
    
    const [passport, setPassport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (batchId) {
            checkExistingPassport();
        }
    }, [batchId]);

    const checkExistingPassport = async () => {
        try {
            const data = await api.get(`/traceability/${batchId}`);
            if (data) {
                setPassport(data);
            }
        } catch (err) {
            // Not generated yet
            console.log('No passport found, user must generate one');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const data = await api.post('/traceability/generate', {
                farmerId: user?.id,
                batchId
            });
            setPassport(data);
        } catch (err) {
            console.error('Failed to generate passport', err);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Export Passport</Text>
            </View>

            <Text style={styles.description}>
                Samaki PRO uses the Solana blockchain to cryptographically verify that your harvested fish was farmed under safe, sustainable conditions.
            </Text>

            {!passport ? (
                <Card style={styles.card}>
                    <Card.Content style={{ alignItems: 'center', paddingVertical: 30 }}>
                        <IconButton icon="certificate" size={50} iconColor="#999" style={{ backgroundColor: '#F0F0F0' }} />
                        <Text variant="titleMedium" style={{ marginTop: 10, textAlign: 'center' }}>
                            No Certificate Found
                        </Text>
                        <Text variant="bodyMedium" style={{ color: '#666', textAlign: 'center', marginVertical: 15 }}>
                            Generate an Export Passport to prove your harvest meets international standards. This analyzes your cage's historical sensor data to verify sustainable practices.
                        </Text>
                        <Button 
                            mode="contained" 
                            onPress={handleGenerate} 
                            loading={generating} 
                            disabled={generating}
                            style={{ backgroundColor: '#00609C', width: '100%' }}
                            icon="creation"
                        >
                            Generate Passport
                        </Button>
                    </Card.Content>
                </Card>
            ) : (
                <Card style={styles.card}>
                    <Card.Content style={{ alignItems: 'center' }}>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#1B5E20' }}>
                            Certificate of Origin
                        </Text>
                        <Text variant="labelMedium" style={{ color: '#666', marginBottom: 20 }}>
                            Issued: {new Date(passport.issueDate).toLocaleDateString()}
                        </Text>

                        <Surface style={styles.qrContainer} elevation={1}>
                            <QRCode
                                value={`https://samaki.pro/verify/${passport.hashData}`}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        </Surface>
                        
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text variant="labelSmall" style={{ color: '#666' }}>Water Quality Standard</Text>
                                <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: passport.waterQuality === 'Pass' ? '#2E7D32' : '#D32F2F' }}>
                                    {passport.waterQuality}
                                </Text>
                            </View>
                        </View>

                        <Divider style={{ width: '100%', marginVertical: 15 }} />

                        <View style={{ width: '100%' }}>
                            <Text variant="labelSmall" style={{ color: '#999', marginBottom: 5 }}>Cryptographic Ledger Hash</Text>
                            <View style={styles.hashBox}>
                                <Text variant="bodySmall" style={{ fontFamily: 'monospace', color: '#333' }} numberOfLines={2}>
                                    {passport.hashData}
                                </Text>
                            </View>
                        </View>

                    </Card.Content>
                    <Card.Actions style={{ justifyContent: 'center', paddingBottom: 15 }}>
                        <Button mode="outlined" icon="share-variant" onPress={() => {}}>Share QR</Button>
                        <Button mode="contained" icon="download" onPress={() => {}}>Download PDF</Button>
                    </Card.Actions>
                </Card>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: 5 },
    description: { paddingHorizontal: 20, color: '#666', fontStyle: 'italic', marginBottom: 20, lineHeight: 20 },
    card: { marginHorizontal: 20, marginBottom: 20, backgroundColor: 'white', borderRadius: 16 },
    qrContainer: { padding: 15, backgroundColor: 'white', borderRadius: 12, marginBottom: 20 },
    statsRow: { width: '100%', flexDirection: 'row', justifyContent: 'center' },
    statBox: { alignItems: 'center', padding: 10, backgroundColor: '#F5F5F5', borderRadius: 8, width: '100%' },
    hashBox: { backgroundColor: '#E3F2FD', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#BBDEFB' }
});
