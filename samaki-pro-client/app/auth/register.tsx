import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button, RadioButton, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuth();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('FARMER');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!phone || !password || !fullName) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        try {
            await register({
                phone,
                password,
                fullName,
                role
            });
        } catch (err: any) {
            setError(err.message || 'Registration failed. Try again.');
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
                                    <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
                                    <Text variant="bodyMedium" style={styles.subtitle}>Join the Samaki PRO Ecosystem</Text>

                                    <TextInput
                                        label="Full Name"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        mode="flat"
                                        style={styles.input}
                                        underlineColor="transparent"
                                        activeUnderlineColor="#003366"
                                        left={<TextInput.Icon icon="account" color="#003366" />}
                                    />

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

                                    <Text variant="labelMedium" style={styles.roleLabel}>I am registering as a:</Text>
                                    <RadioButton.Group onValueChange={newValue => setRole(newValue)} value={role}>
                                        <View style={styles.radioGroup}>
                                            <RadioButton.Item label="Farmer" value="FARMER" labelStyle={{ color: 'white' }} uncheckedColor="rgba(255,255,255,0.5)" color="#64B5F6" />
                                            <RadioButton.Item label="Buyer / Vendor" value="VENDOR" labelStyle={{ color: 'white' }} uncheckedColor="rgba(255,255,255,0.5)" color="#64B5F6" />
                                        </View>
                                    </RadioButton.Group>

                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <Button 
                                        mode="contained" 
                                        onPress={handleRegister} 
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={styles.button}
                                        labelStyle={{ letterSpacing: 1, fontWeight: 'bold' }}
                                        buttonColor="#0288D1"
                                    >
                                        Register 
                                    </Button>

                                    <View style={styles.footerRow}>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Already have an account?</Text>
                                        <Button mode="text" onPress={() => router.replace('/auth/login')} compact textColor="#64B5F6">
                                            Login
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
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    backBtn: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
    glassWrapper: { maxWidth: 500, alignSelf: 'center', width: '100%', borderRadius: 24, overflow: 'hidden' },
    glassCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    contentPad: { padding: 30 },
    title: { textAlign: 'center', fontWeight: 'bold', color: '#FFFFFF' },
    subtitle: { textAlign: 'center', marginBottom: 25, color: '#B3E5FC' },
    input: { marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
    roleLabel: { color: 'white', marginTop: 10, marginBottom: 5 },
    radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingVertical: 5 },
    button: { marginTop: 10, paddingVertical: 6, borderRadius: 12 },
    error: { color: '#ff5252', textAlign: 'center', marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 5, overflow: 'hidden' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }
});
