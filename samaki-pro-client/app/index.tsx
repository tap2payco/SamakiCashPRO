import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Animated } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '~/contexts/AuthContext';

export default function LandingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    
    // Entry Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    if (loading) return null;
    if (user) return <Redirect href="/dashboard" />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                        <Text variant="displayMedium" style={styles.title}>Samaki<Text style={styles.proAccent}>PRO</Text></Text>
                        <Text variant="titleMedium" style={styles.subtitle}>Powering the Blue Economy</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.promoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <BlurView intensity={70} tint="light" style={styles.promoCard}>
                        <ImageBackground 
                            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }} 
                            style={styles.promoImage} 
                            imageStyle={{ opacity: 0.15 }}
                        >
                            <View style={styles.promoOverlay}>
                                <Text variant="headlineMedium" style={styles.promoTitle}>Industry-Grade Aquaculture</Text>
                                <Text variant="bodyLarge" style={styles.promoSubtitle}>
                                    Unifying AI Farm telemetry, Traceable B2B Commerce, and Embedded Escrow into a single enterprise platform.
                                </Text>
                                <View style={styles.btnRow}>
                                    <Button 
                                        mode="contained" 
                                        buttonColor="#00B4D8" 
                                        textColor="#FFFFFF"
                                        style={styles.promoBtn} 
                                        labelStyle={styles.btnLabel}
                                        onPress={() => router.push('/auth/register')}
                                    >
                                        Enroll Farm
                                    </Button>
                                    <Button 
                                        mode="outlined" 
                                        textColor="#00B4D8" 
                                        style={styles.promoBtnBorder} 
                                        labelStyle={styles.btnLabel}
                                        onPress={() => router.push('/auth/login')}
                                    >
                                        Operator Login
                                    </Button>
                                </View>
                            </View>
                        </ImageBackground>
                    </BlurView>
                </Animated.View>

                <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
                    Samaki Enterprise Systems © 2026
                </Animated.Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, maxWidth: 900, alignSelf: 'center', width: '100%', paddingBottom: 50 },
    header: { marginBottom: 50 },
    title: { color: '#0B2027', fontWeight: '900', letterSpacing: 1 },
    proAccent: { color: '#00B4D8' }, // Ocean Teal Accent
    subtitle: { color: '#495057', marginTop: 10, letterSpacing: 2, textTransform: 'uppercase', fontSize: 14 },
    
    promoSection: { 
        marginBottom: 40, 
        borderRadius: 30, 
        overflow: 'hidden', 
        elevation: 10, 
        shadowColor: '#000000', 
        shadowOffset: { height: 10, width: 0 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)'
    },
    promoCard: { borderRadius: 30, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)' },
    promoImage: { height: 450, justifyContent: 'flex-end' }, 
    promoOverlay: { 
        padding: 40, 
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30 
    },
    promoTitle: { color: '#0B2027', fontWeight: 'bold', marginBottom: 15 },
    promoSubtitle: { color: '#495057', lineHeight: 26, marginBottom: 35 },
    
    btnRow: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
    promoBtn: { borderRadius: 50, paddingVertical: 8, flex: 1, minWidth: 160 },
    promoBtnBorder: { borderRadius: 50, paddingVertical: 8, flex: 1, minWidth: 160, borderColor: '#00B4D8', borderWidth: 1.5 },
    btnLabel: { letterSpacing: 1, fontWeight: 'bold', fontSize: 16 },
    
    footer: { textAlign: 'center', color: 'rgba(0,0,0,0.4)', marginTop: 30, letterSpacing: 1, fontSize: 12 }
});
