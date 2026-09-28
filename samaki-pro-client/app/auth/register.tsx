import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Animated } from 'react-native';
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

    // Entry Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleRegister = async () => {
        if (!phone || !password || !fullName) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        try {
            await register({ phone, password, fullName, role });
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
                        <IconButton icon="arrow-left" iconColor="#0B2027" style={styles.backBtn} onPress={() => router.back()} />

                        <Animated.View style={[styles.glassWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                            <BlurView intensity={70} tint="light" style={styles.glassCard}>
                                <View style={styles.contentPad}>
                                    <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
                                    <Text variant="bodyMedium" style={styles.subtitle}>Join the Samaki<Text style={styles.proAccent}>PRO</Text> Ecosystem</Text>

                                    <TextInput
                                        label="Full Name"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        mode="outlined"
                                        style={styles.input}
                                        textColor="#0B2027"
                                        outlineColor="rgba(0,0,0,0.2)"
                                        activeOutlineColor="#00B4D8"
                                        left={<TextInput.Icon icon="account" color="rgba(0,0,0,0.5)" />}
                                        theme={{ colors: { background: 'transparent', onSurfaceVariant: 'rgba(0,0,0,0.5)' } }}
                                    />

                                    <TextInput
                                        label="Phone Number"
                                        value={phone}
                                        onChangeText={setPhone}
                                        mode="outlined"
                                        keyboardType="phone-pad"
                                        style={styles.input}
                                        textColor="#0B2027"
                                        outlineColor="rgba(0,0,0,0.2)"
                                        activeOutlineColor="#00B4D8"
                                        left={<TextInput.Icon icon="phone" color="rgba(0,0,0,0.5)" />}
                                        theme={{ colors: { background: 'transparent', onSurfaceVariant: 'rgba(0,0,0,0.5)' } }}
                                    />

                                    <TextInput
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        mode="outlined"
                                        secureTextEntry
                                        style={styles.input}
                                        textColor="#0B2027"
                                        outlineColor="rgba(0,0,0,0.2)"
                                        activeOutlineColor="#00B4D8"
                                        left={<TextInput.Icon icon="lock" color="rgba(0,0,0,0.5)" />}
                                        theme={{ colors: { background: 'transparent', onSurfaceVariant: 'rgba(0,0,0,0.5)' } }}
                                    />

                                    <Text variant="labelMedium" style={styles.roleLabel}>I am registering as a:</Text>
                                    <RadioButton.Group onValueChange={newValue => setRole(newValue)} value={role}>
                                        <View style={styles.radioGroup}>
                                            <RadioButton.Item label="Farmer" value="FARMER" labelStyle={{ color: '#0B2027' }} uncheckedColor="rgba(0,0,0,0.4)" color="#00B4D8" />
                                            <RadioButton.Item label="Vendor" value="VENDOR" labelStyle={{ color: '#0B2027' }} uncheckedColor="rgba(0,0,0,0.4)" color="#00B4D8" />
                                        </View>
                                    </RadioButton.Group>

                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <Button 
                                        mode="contained" 
                                        onPress={handleRegister} 
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={styles.button}
                                        labelStyle={styles.btnLabel}
                                        buttonColor="#00B4D8"
                                        textColor="#FFFFFF"
                                    >
                                        Register 
                                    </Button>

                                    <View style={styles.footerRow}>
                                        <Text style={{ color: 'rgba(0,0,0,0.5)' }}>Already have an account?</Text>
                                        <Button mode="text" onPress={() => router.replace('/auth/login')} compact textColor="#00B4D8" labelStyle={{ fontWeight: 'bold' }}>
                                            Login
                                        </Button>
                                    </View>
                                </View>
                            </BlurView>
                        </Animated.View>
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
    glassWrapper: { 
        maxWidth: 500, 
        alignSelf: 'center', 
        width: '100%', 
        borderRadius: 30, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.75)' },
    contentPad: { padding: 40 },
    title: { textAlign: 'center', fontWeight: 'bold', color: '#0B2027' },
    proAccent: { color: '#00B4D8' },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#495057' },
    input: { marginBottom: 15, fontSize: 16 },
    roleLabel: { color: '#495057', marginTop: 10, marginBottom: 10 },
    radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12, paddingVertical: 5 },
    button: { marginTop: 15, paddingVertical: 8, borderRadius: 50 },
    btnLabel: { letterSpacing: 1, fontWeight: 'bold', fontSize: 16 },
    error: { color: '#FF5252', textAlign: 'center', marginBottom: 15, backgroundColor: 'rgba(255, 82, 82, 0.1)', padding: 10, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#FF5252' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }
});
