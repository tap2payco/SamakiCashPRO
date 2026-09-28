import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
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
                        <IconButton icon="arrow-left" iconColor="#0B2027" style={styles.backBtn} onPress={() => router.back()} />
                        
                        <Animated.View style={[styles.glassWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                            <BlurView intensity={70} tint="light" style={styles.glassCard}>
                                <View style={styles.contentPad}>
                                    <Avatar.Icon icon="shield-lock-outline" size={80} style={styles.logo} color="#00B4D8" />
                                    <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
                                    <Text variant="bodyMedium" style={styles.subtitle}>Sign in to your Samaki<Text style={styles.proAccent}>PRO</Text> account</Text>
                                    
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

                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <Button 
                                        mode="contained" 
                                        onPress={handleLogin} 
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={styles.button}
                                        labelStyle={styles.btnLabel}
                                        buttonColor="#00B4D8"
                                        textColor="#FFFFFF"
                                    >
                                        Login
                                    </Button>

                                    <View style={styles.footerRow}>
                                        <Text style={{ color: 'rgba(0,0,0,0.5)' }}>Don't have an account?</Text>
                                        <Button mode="text" onPress={() => router.push('/auth/register')} compact textColor="#00B4D8" labelStyle={{ fontWeight: 'bold' }}>
                                            Register
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
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    backBtn: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
    glassWrapper: { 
        maxWidth: 450, 
        alignSelf: 'center', 
        width: '100%', 
        borderRadius: 30, 
        overflow: 'hidden',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.75)' },
    contentPad: { padding: 40 },
    logo: { backgroundColor: 'rgba(0, 180, 216, 0.1)', alignSelf: 'center', marginBottom: 25 },
    title: { textAlign: 'center', fontWeight: 'bold', color: '#0B2027' },
    proAccent: { color: '#00B4D8' },
    subtitle: { textAlign: 'center', marginBottom: 35, color: '#495057' },
    input: { marginBottom: 20, fontSize: 16 },
    button: { marginTop: 15, paddingVertical: 8, borderRadius: 50 },
    btnLabel: { letterSpacing: 1, fontWeight: 'bold', fontSize: 16 },
    error: { color: '#FF5252', textAlign: 'center', marginBottom: 15, backgroundColor: 'rgba(255, 82, 82, 0.1)', padding: 10, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#FF5252' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }
});
