import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, IconButton, Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '~/services/api';
import { BlurView } from 'expo-blur';

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [listing, setListing] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.get(`/marketplace/listings/${id}`)
               .then(setListing)
               .catch(console.error)
               .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.center}>
                    <ActivityIndicator color="white" size="large" />
                </View>
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.center}>
                    <Text style={{ color: 'white' }}>Listing not found.</Text>
                    <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 20 }}>Go Back</Button>
                </View>
            </View>
        );
    }


    const renderContent = () => {
        if (!listing) return null;
        return (
            <BlurView intensity={30} tint="dark" style={styles.glassCard}>
                <ImageBackground 
                    source={{ uri: listing.imageUrl || 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.imageBg}
                >
                    <View style={styles.imageOverlay} />
                </ImageBackground>

                <View style={styles.cardPad}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                            <Text variant="headlineMedium" style={styles.title}>{listing.title}</Text>
                            <Text variant="titleLarge" style={styles.price}>{parseInt(listing.price).toLocaleString()} TZS / {listing.unit}</Text>
                        </View>
                    </View>

                    <View style={styles.tagContainer}>
                        <BlurView intensity={40} tint="dark" style={styles.tagBadge}>
                            <Text style={styles.tagText}>{listing.quantity} {listing.unit} Available</Text>
                        </BlurView>
                        <BlurView intensity={40} tint="dark" style={[styles.tagBadge, { backgroundColor: 'rgba(0, 229, 255, 0.1)', borderColor: '#00E5FF', borderWidth: 1 }]}>
                            <Text style={[styles.tagText, { color: '#00E5FF' }]}>Verified Seller</Text>
                        </BlurView>
                    </View>

                    <Divider style={{ marginVertical: 25, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginBottom: 15, letterSpacing: 1 }}>SPECIFICATIONS</Text>
                    <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 24 }}>
                        {listing.description || 'Premium farm-raised fish stock from verified farmers in the Samaki Ecosystem. Quality guaranteed.'}
                    </Text>

                    <Divider style={{ marginVertical: 25, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginBottom: 15, letterSpacing: 1 }}>VENDOR IDENTITY</Text>
                    <View style={styles.sellerBox}>
                        <Avatar.Icon icon="account-circle" size={48} style={{ backgroundColor: 'rgba(0, 229, 255, 0.15)', marginRight: 15 }} color="#00E5FF" />
                        <View>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{listing.seller?.fullName || 'Verified Farmer'}</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{listing.seller?.location || 'Lake Victoria Zone'}</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.actionFooter}>
                    <View style={styles.quantityRow}>
                        <Text variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', letterSpacing: 1 }}>QUANTITY</Text>
                        <View style={styles.stepper}>
                            <IconButton icon="minus" iconColor="#00E5FF" size={20} style={styles.stepBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, width: 40, textAlign: 'center' }}>{quantity}</Text>
                            <IconButton icon="plus" iconColor="#00E5FF" size={20} style={styles.stepBtn} onPress={() => setQuantity(Math.min(listing.quantity, quantity + 1))} />
                        </View>
                    </View>
                    <Button
                        mode="contained"
                        buttonColor="#00E5FF"
                        textColor="#0F2027"
                        icon="shield-lock"
                        style={styles.buyButton}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold', paddingVertical: 4 }}
                        onPress={() => router.push({
                            pathname: '/commerce/checkout' as any,
                            params: {
                                listingId: listing.id,
                                title: listing.title,
                                price: listing.price,
                                unit: listing.unit,
                                quantity: quantity
                            }
                        })}
                    >
                        Secure Escrow Checkout
                    </Button>
                </View>
            </BlurView>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollPad}>
                {renderContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRow: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
    container: { flex: 1 },
    scrollPad: { padding: 25, paddingTop: 60, paddingBottom: 50 },
    
    glassCard: { borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.2)', elevation: 10, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15 },
    imageBg: { height: 300, justifyContent: 'flex-end' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    cardPad: { padding: 30 },
    
    title: { fontWeight: '900', color: 'white', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    price: { color: '#00E676', fontWeight: 'bold', marginTop: 8 },
    
    tagContainer: { flexDirection: 'row', marginTop: 25, gap: 12 },
    tagBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
    tagText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    
    sellerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    
    actionFooter: { backgroundColor: 'rgba(0, 229, 255, 0.05)', padding: 30, borderTopWidth: 1, borderTopColor: 'rgba(0, 229, 255, 0.1)' },
    quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    stepBtn: { margin: 0 },
    buyButton: { borderRadius: 50 }
});
