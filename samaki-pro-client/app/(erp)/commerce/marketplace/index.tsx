import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Avatar, TouchableRipple } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { BlurView } from 'expo-blur';

export default function MarketplaceScreen() {
    const router = useRouter();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchListings(); }, []);

    const fetchListings = async () => {
        try {
            const data = await api.get('/marketplace/listings');
            setListings(data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchListings();
    };

    const renderListing = (listing: any) => {
        return (
            <BlurView intensity={30} tint="dark" style={styles.listingCard} key={listing.id}>
                <ImageBackground 
                    source={{ uri: listing.imageUrl || 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.imageBg}
                >
                    <View style={styles.imageOverlay}>
                        <View style={styles.badgeRow}>
                            <BlurView intensity={50} tint="dark" style={styles.badge}>
                                <Text style={styles.badgeText}>{listing.unit}</Text>
                            </BlurView>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.cardPad}>
                    <Text variant="titleLarge" style={styles.listingTitle}>{listing.title}</Text>
                    <Text variant="bodySmall" style={styles.listingDesc} numberOfLines={2}>
                        {listing.description || 'Premium farm-raised fish stock from verified farmers in the Samaki Ecosystem.'}
                    </Text>

                    <View style={styles.priceRow}>
                        <View>
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Price</Text>
                            <Text variant="headlineSmall" style={{ fontWeight: '900', color: '#00E676' }}>TZS {parseInt(listing.price).toLocaleString()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Available</Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{listing.quantity} {listing.unit}</Text>
                        </View>
                    </View>

                    <Button 
                        mode="contained" 
                        buttonColor="#00E5FF" 
                        textColor="#0F2027"
                        icon="cart-plus" 
                        style={styles.buyBtn}
                        onPress={() => router.push(`/commerce/marketplace/${listing.id}` as any)}
                    >
                        View Details & Purchase
                    </Button>
                </View>
            </BlurView>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => router.back()} />
                <Text variant="headlineSmall" style={{ fontWeight: '900', color: 'white', flex: 1, letterSpacing: 1 }}>Live Market</Text>
                <IconButton icon="filter-variant" iconColor="#00E5FF" />
            </View>

            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00E5FF" />}
            >
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="#00E5FF" />
                ) : (
                    <View>
                        {listings.length === 0 ? (
                            <BlurView intensity={20} tint="dark" style={styles.emptyCard}>
                                <View style={{ alignItems: 'center', padding: 40 }}>
                                    <Avatar.Icon icon="store-off" size={80} style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }} color="#00E5FF" />
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 20, fontSize: 16 }}>No fish stock available right now.</Text>
                                    <Button mode="outlined" textColor="#00E5FF" style={{ borderColor: '#00E5FF' }} onPress={handleRefresh}>Refresh Market</Button>
                                </View>
                            </BlurView>
                        ) : (
                            listings.map(renderListing)
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    listingCard: { borderRadius: 30, overflow: 'hidden', marginBottom: 35, borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.2)', elevation: 10, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15 },
    imageBg: { height: 220, justifyContent: 'flex-end' },
    imageOverlay: { flex: 1, padding: 15, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)' },
    badgeRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    badge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.3)' },
    badgeText: { color: '#00E5FF', fontWeight: 'bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    cardPad: { padding: 25 },
    listingTitle: { color: 'white', fontWeight: '900', fontSize: 22 },
    listingDesc: { color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 20 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25, marginBottom: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    buyBtn: { borderRadius: 50, paddingVertical: 6 },
    emptyCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.2)', marginTop: 40 }
});
