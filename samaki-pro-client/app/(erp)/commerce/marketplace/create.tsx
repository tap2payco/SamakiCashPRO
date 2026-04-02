import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Snackbar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAuth } from '~/contexts/AuthContext';
import { BlurView } from 'expo-blur';

export default function CreateListingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [snackVisible, setSnackVisible] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        unit: 'kg',
    });

    const units = [
        { value: 'kg', label: 'Kilograms', checkedColor: 'white', uncheckedColor: 'rgba(255,255,255,0.6)' },
        { value: 'ton', label: 'Tons', checkedColor: 'white', uncheckedColor: 'rgba(255,255,255,0.6)' },
        { value: 'pieces', label: 'Pieces', checkedColor: 'white', uncheckedColor: 'rgba(255,255,255,0.6)' },
    ];

    const handleSubmit = async () => {
        if (!form.title || !form.price || !form.quantity) {
            setSnackMessage('Please fill in all required fields');
            setSnackVisible(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/marketplace/listings', {
                title: form.title,
                description: form.description,
                price: parseFloat(form.price),
                quantity: parseInt(form.quantity),
                unit: form.unit,
                sellerId: user?.id || 'FARMER_001', 
            });

            setSnackMessage('Listing created successfully!');
            setSnackVisible(true);

            setTimeout(() => router.back(), 1500);
        } catch (err) {
            setSnackMessage('Failed to create listing. Please try again.');
            setSnackVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>Sell Stock</Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    <BlurView intensity={25} tint="light" style={styles.glassCard}>
                        <View style={styles.cardPad}>
                            <Text variant="titleMedium" style={{ marginBottom: 25, fontWeight: 'bold', color: 'white' }}>Listing Details</Text>

                            <TextInput
                                label="Title *"
                                value={form.title}
                                onChangeText={(text) => setForm({ ...form, title: text })}
                                mode="flat"
                                placeholder="e.g., Fresh Tilapia from Buchosa"
                                style={styles.input}
                                underlineColor="transparent"
                                activeUnderlineColor="#0288D1"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                            />

                            <TextInput
                                label="Description"
                                value={form.description}
                                onChangeText={(text) => setForm({ ...form, description: text })}
                                mode="flat"
                                multiline
                                numberOfLines={3}
                                placeholder="Describe your fish quality, grade, visuals..."
                                style={styles.input}
                                underlineColor="transparent"
                                activeUnderlineColor="#0288D1"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                            />

                            <View style={styles.row}>
                                <TextInput
                                    label="Price (TZS) *"
                                    value={form.price}
                                    onChangeText={(text) => setForm({ ...form, price: text })}
                                    mode="flat"
                                    keyboardType="numeric"
                                    placeholder="e.g., 15000"
                                    style={[styles.input, { flex: 1, marginRight: 15 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="#0288D1"
                                />
                                <TextInput
                                    label="Quantity *"
                                    value={form.quantity}
                                    onChangeText={(text) => setForm({ ...form, quantity: text })}
                                    mode="flat"
                                    keyboardType="numeric"
                                    placeholder="e.g., 50"
                                    style={[styles.input, { flex: 1 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="#0288D1"
                                />
                            </View>

                            <Text variant="labelMedium" style={styles.label}>Unit Measurement</Text>
                            <SegmentedButtons
                                value={form.unit}
                                onValueChange={(value) => setForm({ ...form, unit: value })}
                                buttons={units}
                                style={styles.segmented}
                                theme={{ colors: { secondaryContainer: 'rgba(255,255,255,0.3)', onSecondaryContainer: 'white' } }}
                            />
                        </View>
                    </BlurView>

                    <View style={styles.actions}>
                        <Button mode="outlined" onPress={() => router.back()} disabled={loading} style={styles.cancelBtn} textColor="white">
                            Cancel
                        </Button>
                        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitBtn} buttonColor="#00E676">
                            Create Listing
                        </Button>
                    </View>
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

    glassCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 25 },
    cardPad: { padding: 25 },
    input: { marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
    row: { flexDirection: 'row' },
    label: { marginBottom: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' },
    segmented: { marginBottom: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 24 },

    actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    cancelBtn: { flex: 0.48, borderRadius: 16, borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1 },
    submitBtn: { flex: 0.48, borderRadius: 16 },
});
