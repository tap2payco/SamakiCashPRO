import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useRouter, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '~/contexts/AuthContext';

export default function LandingScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        // Authenticated users skip the landing page and jump straight into the ERP
        return <Redirect href="/dashboard" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text variant="displaySmall" style={styles.title}>Samaki ERP</Text>
                        <Text variant="titleMedium" style={styles.subtitle}>Powering the Blue Economy</Text>
                    </View>
                </View>

                <View style={styles.promoSection}>
                    <BlurView intensity={30} tint="light" style={styles.promoCard}>
                        <ImageBackground 
                            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} 
                            style={styles.promoImage} 
                            imageStyle={{ opacity: 0.6 }}
                        >
                            <View style={styles.promoOverlay}>
                                <Text variant="titleLarge" style={styles.promoTitle}>Industry-Grade Aquaculture Operations</Text>
                                <Text variant="bodyMedium" style={styles.promoSubtitle}>
                                    Unifying AI Farm telemetry, Traceable B2B Commerce, and Embedded Escrow into a single enterprise platform.
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 15, marginTop: 25 }}>
                                    <Button mode="contained" buttonColor="#00E676" style={styles.promoBtn} onPress={() => router.push('/auth/register')}>
                                        Enroll Farm
                                    </Button>
                                    <Button mode="outlined" textColor="white" style={styles.promoBtnBorder} onPress={() => router.push('/auth/login')}>
                                        Operator Login
                                    </Button>
                                </View>
                            </View>
                        </ImageBackground>
                    </BlurView>
                </View>

                <Text variant="bodySmall" style={styles.footer}>Samaki Enterprise Systems © 2026</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, maxWidth: 800, alignSelf: 'center', width: '100%', paddingBottom: 50 },
    header: { marginBottom: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#FFFFFF', fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    subtitle: { color: '#B3E5FC', marginTop: 5, letterSpacing: 0.5 },
    
    promoSection: { marginBottom: 40, borderRadius: 24, overflow: 'hidden', elevation: 15, shadowColor: '#000', shadowOffset: { height: 8, width: 0 }, shadowOpacity: 0.4, shadowRadius: 10 },
    promoCard: { borderRadius: 24, overflow: 'hidden' },
    promoImage: { height: 350, justifyContent: 'flex-end' }, // taller for landing
    promoOverlay: { padding: 30, backgroundColor: 'rgba(0,25,50,0.5)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    promoTitle: { color: 'white', fontWeight: 'bold', fontSize: 26 },
    promoSubtitle: { color: '#E0F7FA', marginTop: 10, lineHeight: 22 },
    promoBtn: { borderRadius: 12, width: 160 },
    promoBtnBorder: { borderRadius: 12, width: 160, borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1 },
    
    footer: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: 20, letterSpacing: 0.5 }
});
