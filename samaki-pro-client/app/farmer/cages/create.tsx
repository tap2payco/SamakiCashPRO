import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, RadioButton, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function CreateCageScreen() {
    const router = useRouter();
    const theme = useTheme();

    const [name, setName] = useState('');
    const [type, setType] = useState('circular');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!name || !capacity) {
            setError('Please fill in Name and Capacity');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/cages', {
                name,
                type,
                capacity: parseInt(capacity),
                location
            });
            router.replace('/farmer'); // Back to dashboard
        } catch (err) {
            console.error(err);
            setError('Failed to create cage. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>Add New Cage</Text>

            <View style={styles.form}>
                <TextInput
                    label="Cage Name / ID"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    placeholder="e.g. Cage A1"
                    style={styles.input}
                />

                <Text variant="bodyMedium" style={styles.label}>Cage Type</Text>
                <RadioButton.Group onValueChange={value => setType(value)} value={type}>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="Circular" value="circular" />
                        <RadioButton.Item label="Rectangular" value="rectangular" />
                    </View>
                </RadioButton.Group>

                <TextInput
                    label="Capacity (Max Fish)"
                    value={capacity}
                    onChangeText={setCapacity}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Location / GPS"
                    value={location}
                    onChangeText={setLocation}
                    mode="outlined"
                    placeholder="e.g. Zone 1, Lake Victoria"
                    style={styles.input}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleCreate}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Create Cage
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    header: { fontWeight: 'bold', marginBottom: 20, color: '#00609C' },
    form: { marginTop: 10 },
    input: { marginBottom: 15 },
    label: { marginBottom: 5, fontWeight: '500' },
    radioRow: { flexDirection: 'row', marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5 },
    error: { color: 'red', marginBottom: 10, textAlign: 'center' }
});
