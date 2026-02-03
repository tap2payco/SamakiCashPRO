import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons, Snackbar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

export default function CreateListingScreen() {
    const router = useRouter();
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
        { value: 'kg', label: 'Kilograms' },
        { value: 'ton', label: 'Tons' },
        { value: 'pieces', label: 'Pieces' },
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
                sellerId: 'FARMER_001', // Simulated seller ID
            });

            setSnackMessage('Listing created successfully!');
            setSnackVisible(true);

            // Navigate back to marketplace after short delay
            setTimeout(() => router.back(), 1500);
        } catch (err) {
            setSnackMessage('Failed to create listing. Please try again.');
            setSnackVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', flex: 1 }}>Sell Stock</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.card} mode="elevated">
                    <Card.Content>
                        <Text variant="titleMedium" style={{ marginBottom: 20, fontWeight: 'bold', color: '#444' }}>Listing Details</Text>

                        <TextInput
                            label="Title *"
                            value={form.title}
                            onChangeText={(text) => setForm({ ...form, title: text })}
                            mode="outlined"
                            placeholder="e.g., Fresh Tilapia from Buchosa"
                            style={styles.input}
                            outlineColor="#ddd"
                            activeOutlineColor="#0288D1"
                        />

                        <TextInput
                            label="Description"
                            value={form.description}
                            onChangeText={(text) => setForm({ ...form, description: text })}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            placeholder="Describe your fish quality, grade, visuals..."
                            style={styles.input}
                            outlineColor="#ddd"
                            activeOutlineColor="#0288D1"
                        />

                        <View style={styles.row}>
                            <TextInput
                                label="Price (TZS) *"
                                value={form.price}
                                onChangeText={(text) => setForm({ ...form, price: text })}
                                mode="outlined"
                                keyboardType="numeric"
                                placeholder="e.g., 15000"
                                style={[styles.input, { flex: 1, marginRight: 10 }]}
                                outlineColor="#ddd"
                                activeOutlineColor="#0288D1"
                            />
                            <TextInput
                                label="Quantity *"
                                value={form.quantity}
                                onChangeText={(text) => setForm({ ...form, quantity: text })}
                                mode="outlined"
                                keyboardType="numeric"
                                placeholder="e.g., 50"
                                style={[styles.input, { flex: 1 }]}
                                outlineColor="#ddd"
                                activeOutlineColor="#0288D1"
                            />
                        </View>

                        <Text variant="labelMedium" style={styles.label}>Unit Measurement</Text>
                        <SegmentedButtons
                            value={form.unit}
                            onValueChange={(value) => setForm({ ...form, unit: value })}
                            buttons={units}
                            style={styles.segmented}
                            theme={{ colors: { secondaryContainer: '#E1F5FE', onSecondaryContainer: '#0277BD' } }}
                        />
                    </Card.Content>
                </Card>

                <View style={styles.actions}>
                    <Button mode="outlined" onPress={() => router.back()} disabled={loading} style={styles.button} textColor="#666">
                        Cancel
                    </Button>
                    <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button} buttonColor="#FFA000">
                        Create Listing
                    </Button>
                </View>
            </ScrollView>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={3000}
                style={{ backgroundColor: '#333' }}
            >
                {snackMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', elevation: 2 },
    scrollContent: { padding: 20 },

    card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 20 },
    input: { marginBottom: 20, backgroundColor: 'white' },
    row: { flexDirection: 'row' },
    label: { marginBottom: 10, color: '#666', fontWeight: '500' },
    segmented: { marginBottom: 10 },

    actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { flex: 0.48, borderRadius: 8, paddingVertical: 5 },
});
