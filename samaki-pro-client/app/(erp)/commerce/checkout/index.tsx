import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput, IconButton, Snackbar, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

export default function CheckoutScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    
    const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [snackVisible, setSnackVisible] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const listingId = params.listingId as string;
    const title = params.title as string;
    const price = parseFloat(params.price as string || '0');
    const quantity = parseInt(params.quantity as string || '1');
    const unit = params.unit as string;
    const totalAmount = price * quantity;
    const platformFee = totalAmount * 0.02; // 2% Escrow Fee
    const finalAmount = totalAmount + platformFee;

    const handlePayment = async () => {
        if (!phoneNumber) {
            setSnackMessage('Please provide a mobile money number.');
            setSnackVisible(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/orders', {
                buyerId: user?.id || 'GUEST',
                listingId,
                quantity,
                paymentProvider: 'MPESA',
                phoneNumber
            });

            setSnackMessage('Escrow funded successfully! Order placed.');
            setSnackVisible(true);
            
            setTimeout(() => {
                router.replace('/orders');
            }, 1500);
            
        } catch (err: any) {
            setSnackMessage(err.message || 'Payment failed.');
            setSnackVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>Secure Escrow</Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    <BlurView intensity={25} tint="light" style={styles.glassCard}>
                        <View style={styles.cardPad}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#00E676', textAlign: 'center', marginBottom: 10 }}>100% Funds Protection</Text>
                            <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 25, lineHeight: 20 }}>
                                Your funds are held securely in the Samaki M-PESA escrow account. The seller is only paid after you confirm delivery.
                            </Text>

                            <View style={styles.summaryBox}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginBottom: 15 }}>Order Summary</Text>
                                
                                <View style={styles.summaryRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.summaryLabel}>Item</Text>
                                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 2 }}>{title}</Text>
                                    </View>
                                </View>
                                
                                <Divider style={styles.divider} />
                                
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Quantity</Text>
                                    <Text style={{ color: 'white', fontWeight: '600' }}>{quantity} {unit}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Unit Price</Text>
                                    <Text style={{ color: 'white' }}>TZS {price.toLocaleString()}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={{ color: 'white' }}>TZS {totalAmount.toLocaleString()}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Escrow Protection Fee (2%)</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)' }}>TZS {platformFee.toLocaleString()}</Text>
                                </View>
                                
                                <Divider style={styles.divider} />
                                
                                <View style={styles.summaryRow}>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>Total to Fund</Text>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#00E676' }}>TZS {finalAmount.toLocaleString()}</Text>
                                </View>
                            </View>

                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginTop: 20, marginBottom: 15 }}>Payment Method</Text>

                            <View style={styles.paymentMethod}>
                                <IconButton icon="cellphone" iconColor="#4CAF50" style={{ margin: 0, backgroundColor: 'rgba(76, 175, 80, 0.2)' }} />
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>M-PESA Push</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>You will receive a prompt to enter PIN</Text>
                                </View>
                            </View>

                            <TextInput
                                label="Mobile Money Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                mode="flat"
                                keyboardType="phone-pad"
                                style={styles.input}
                                underlineColor="transparent"
                                activeUnderlineColor="#0288D1"
                            />
                        </View>
                        
                        <View style={styles.actionFooter}>
                            <Button 
                                mode="contained" 
                                onPress={handlePayment} 
                                loading={loading} 
                                disabled={loading} 
                                style={styles.payBtn}
                                buttonColor="#00E676"
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                icon="shield-check"
                            >
                                Secure TZS {finalAmount.toLocaleString()}
                            </Button>
                        </View>
                    </BlurView>

                </ScrollView>
            </KeyboardAvoidingView>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={3000}
                style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                action={{ label: 'OK', onPress: () => setSnackVisible(false) }}
            >
                {snackMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.2)' },
    scrollContent: { padding: 20, paddingBottom: 50 },

    glassCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    cardPad: { padding: 25 },
    
    summaryBox: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { color: 'rgba(255,255,255,0.7)' },
    divider: { backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
    
    paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 16, marginBottom: 20 },
    
    input: { marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
    
    actionFooter: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    payBtn: { borderRadius: 16, paddingVertical: 6 }
});
