import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        password: '',
        role: 'FARMER'
    });
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!form.phone || !form.password || !form.fullName) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await register(form);
        } catch (err) {
            setError('Registration failed. Please check your inputs.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Join the blue economy revolution</Text>

            <TextInput
                label="Full Name"
                value={form.fullName}
                onChangeText={(text) => setForm({ ...form, fullName: text })}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Phone Number"
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
                mode="outlined"
                keyboardType="phone-pad"
                placeholder="+255..."
                style={styles.input}
            />

            <TextInput
                label="Password"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            <Text variant="labelLarge" style={styles.label}>I am a:</Text>
            <SegmentedButtons
                value={form.role}
                onValueChange={(val) => setForm({ ...form, role: val })}
                buttons={[
                    { value: 'FARMER', label: 'Fish Farmer', icon: 'fish' },
                    { value: 'VENDOR', label: 'Vendor/Buyer', icon: 'store' },
                ]}
                style={styles.segment}
            />

            {error ? <HelperText type="error">{error}</HelperText> : null}

            <Button
                mode="contained"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
            >
                Register
            </Button>

            <Button mode="text" onPress={() => router.back()} style={{ marginTop: 10 }}>
                Already have an account? Login
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: 'white', maxWidth: 500, alignSelf: 'center', width: '100%' },
    title: { fontWeight: 'bold', color: '#00609C', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
    input: { marginBottom: 15 },
    label: { marginBottom: 10, marginTop: 5 },
    segment: { marginBottom: 20 },
    button: { paddingVertical: 5, backgroundColor: '#00609C' }
});
