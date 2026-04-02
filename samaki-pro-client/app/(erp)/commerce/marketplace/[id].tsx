import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, IconButton, Divider, ActivityIndicator } from 'react-native-paper';
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

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollPad}>
                <BlurView intensity={25} tint="light" style={styles.glassCard}>
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
                            <BlurView intensity={40} tint="dark" style={[styles.tagBadge, { backgroundColor: 'rgba(0, 230, 118, 0.2)' }]}>
                                <Text style={[styles.tagText, { color: '#00E676' }]}>In Stock</Text>
                            </BlurView>
                        </View>

                        <Divider style={{ marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Description</Text>
                        <Text variant="bodyMedium" style={{ color: '#B3E5FC', lineHeight: 22 }}>
                            {listing.description || 'No description provided for this premium fish stock.'}
                        </Text>

                        <Divider style={{ marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Seller Info</Text>
                        <View style={styles.sellerBox}>
                            <IconButton icon="account-circle" iconColor="white" size={32} style={{ margin: 0, marginRight: 10 }} />
                            <View>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{listing.seller?.fullName || 'Verified Farmer'}</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{listing.seller?.location || 'Lake Victoria Zone'}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.actionFooter}>
                        <View style={styles.quantityRow}>
                            <Text variant="bodyLarge" style={{ color: 'white', fontWeight: 'bold' }}>Qty:</Text>
                            <View style={styles.stepper}>
                                <IconButton icon="minus" iconColor="white" size={16} style={styles.stepBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{quantity}</Text>
                                <IconButton icon="plus" iconColor="white" size={16} style={styles.stepBtn} onPress={() => setQuantity(Math.min(listing.quantity, quantity + 1))} />
                            </View>
                        </View>
                        <Button
                            mode="contained"
                            buttonColor="#00E676"
                            icon="cart-check"
                            style={styles.buyButton}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
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
                            Buy via Escrow
                        </Button>
                    </View>
                </BlurView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRow: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
    container: { flex: 1 },
    scrollPad: { padding: 20, paddingTop: 60, paddingBottom: 50 },
    
    glassCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    imageBg: { height: 250, justifyContent: 'flex-end' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
    cardPad: { padding: 25 },
    
    title: { fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
    price: { color: '#00E676', fontWeight: 'bold', marginTop: 5 },
    
    tagContainer: { flexDirection: 'row', marginTop: 20, gap: 10 },
    tagBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, overflow: 'hidden' },
    tagText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    
    sellerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 16 },
    
    actionFooter: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    stepBtn: { margin: 0, backgroundColor: 'rgba(255,255,255,0.1)' },
    buyButton: { borderRadius: 16, paddingVertical: 8 }
});
