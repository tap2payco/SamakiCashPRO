import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, RadioButton, TextInput, Divider, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function CheckoutScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [paymentProvider, setPaymentProvider] = useState<string>('MPESA');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const listingId = params.listingId as string;
    const quantity = parseInt(params.quantity as string);
    const price = parseFloat(params.price as string);
    const totalAmount = price * quantity;

    const handleCheckout = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/orders', {
                buyerId: user.id, // Assuming user.id corresponds to profile.id from AuthContext
                listingId,
                quantity,
                paymentProvider,
                phoneNumber: phone
            });

            // Navigate to order history
            router.replace('/orders');
        } catch (err) {
            console.error(err);
            setError('Payment initiation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>Checkout</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Order Summary</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <View style={styles.row}>
                        <Text>{params.title}</Text>
                        <Text style={{ fontWeight: 'bold' }}>{quantity} {params.unit}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Price per unit</Text>
                        <Text>{price.toLocaleString()} TZS</Text>
                    </View>
                    <Divider style={{ marginVertical: 10 }} />
                    <View style={styles.row}>
                        <Text variant="titleMedium">Total</Text>
                        <Text variant="headlineSmall" style={{ color: '#00609C', fontWeight: 'bold' }}>
                            {totalAmount.toLocaleString()} TZS
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>Payment Method</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <RadioButton.Group onValueChange={value => setPaymentProvider(value)} value={paymentProvider}>
                        <RadioButton.Item label="M-Pesa" value="MPESA" color="#E60000" />
                        <RadioButton.Item label="Tigo Pesa" value="TIGOPESA" color="#00A8E8" />
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>Payment Details</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <TextInput
                        label="Mobile Money Number"
                        value={phone}
                        onChangeText={setPhone}
                        mode="outlined"
                        keyboardType="phone-pad"
                        placeholder="+255..."
                    />
                    <Text variant="bodySmall" style={{ marginTop: 5, color: '#666' }}>
                        You will receive a USSD prompt to approve the payment.
                    </Text>
                </Card.Content>
            </Card>

            {error ? <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text> : null}

            <Button
                mode="contained"
                onPress={handleCheckout}
                loading={loading}
                disabled={loading}
                style={styles.payButton}
                contentStyle={{ height: 50 }}
            >
                Confirm & Pay {totalAmount.toLocaleString()} TZS
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 50, backgroundColor: '#F8F9FA', flexGrow: 1 },
    header: { marginBottom: 20, fontWeight: 'bold', color: '#333' },
    card: { marginBottom: 20, backgroundColor: 'white' },
    sectionTitle: { marginBottom: 10, color: '#666', fontWeight: '500' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    payButton: { marginTop: 10, backgroundColor: '#00609C', borderRadius: 8 }
});
