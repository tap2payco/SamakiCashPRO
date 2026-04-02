import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!phone || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        try {
            await login(phone, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Check your credentials.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <IconButton icon="arrow-left" iconColor="white" style={styles.backBtn} onPress={() => router.back()} />
                        
                        <View style={styles.glassWrapper}>
                            <BlurView intensity={25} tint="light" style={styles.glassCard}>
                                <View style={styles.contentPad}>
                                    <Avatar.Icon icon="shield-lock" size={80} style={styles.logo} color="#003366" />
                                    <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
                                    <Text variant="bodyMedium" style={styles.subtitle}>Sign in to your Samaki PRO account</Text>
                                    
                                    <TextInput
                                        label="Phone Number"
                                        value={phone}
                                        onChangeText={setPhone}
                                        mode="flat"
                                        keyboardType="phone-pad"
                                        style={styles.input}
                                        underlineColor="transparent"
                                        activeUnderlineColor="#003366"
                                        left={<TextInput.Icon icon="phone" color="#003366" />}
                                    />
                                    
                                    <TextInput
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        mode="flat"
                                        secureTextEntry
                                        style={styles.input}
                                        underlineColor="transparent"
                                        activeUnderlineColor="#003366"
                                        left={<TextInput.Icon icon="lock" color="#003366" />}
                                    />

                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <Button 
                                        mode="contained" 
                                        onPress={handleLogin} 
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={styles.button}
                                        labelStyle={{ letterSpacing: 1, fontWeight: 'bold' }}
                                        buttonColor="#0288D1"
                                    >
                                        Login
                                    </Button>

                                    <View style={styles.footerRow}>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Don't have an account?</Text>
                                        <Button mode="text" onPress={() => router.push('/auth/register')} compact textColor="#64B5F6">
                                            Register
                                        </Button>
                                    </View>
                                </View>
                            </BlurView>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    backBtn: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
    glassWrapper: { maxWidth: 450, alignSelf: 'center', width: '100%', borderRadius: 24, overflow: 'hidden' },
    glassCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    contentPad: { padding: 30 },
    logo: { backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', marginBottom: 20, elevation: 5 },
    title: { textAlign: 'center', fontWeight: 'bold', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#B3E5FC' },
    input: { marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
    button: { marginTop: 10, paddingVertical: 6, borderRadius: 12 },
    error: { color: '#ff5252', textAlign: 'center', marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 5, overflow: 'hidden' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }
});
