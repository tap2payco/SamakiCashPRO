import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        setError('');
        try {
            await login(phone, password);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.content}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} style={styles.logo} />
                <Text variant="displaySmall" style={styles.title}>Welcome Back</Text>

                <TextInput
                    label="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                    placeholder="+255..."
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                />

                {error ? <HelperText type="error">{error}</HelperText> : null}

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.button}
                >
                    Login
                </Button>

                <View style={styles.footer}>
                    <Text variant="bodyMedium">Don't have an account? </Text>
                    <Link href="/auth/register" asChild>
                        <Button mode="text">Sign Up</Button>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    content: { flex: 1, padding: 20, justifyContent: 'center', maxWidth: 500, alignSelf: 'center', width: '100%' },
    logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20, borderRadius: 50 },
    title: { textAlign: 'center', marginBottom: 30, fontWeight: 'bold', color: '#00609C' },
    input: { marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5, backgroundColor: '#00609C' },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }
});
