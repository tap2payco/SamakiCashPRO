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
            const data = await api.get('/marketplace');
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
            <BlurView intensity={30} tint="light" style={styles.listingCard} key={listing.id}>
                <ImageBackground 
                    source={{ uri: listing.imageUrl || 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.imageBg}
                >
                    <View style={styles.imageOverlay}>
                        <View style={styles.badgeRow}>
                            <BlurView intensity={40} tint="dark" style={styles.badge}>
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
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Price</Text>
                            <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#00E676' }}>TZS {parseInt(listing.price).toLocaleString()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Available</Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}>{listing.quantity} {listing.unit}</Text>
                        </View>
                    </View>

                    <Button 
                        mode="contained" 
                        buttonColor="#0288D1" 
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
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'white', flex: 1 }}>Live Market</Text>
                <IconButton icon="filter-variant" iconColor="white" />
            </View>

            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="white" />}
            >
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="white" />
                ) : (
                    <View>
                        {listings.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 60 }}>
                                <Avatar.Icon icon="store-off" size={100} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} color="white" />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 20, fontSize: 16 }}>No fish stock available right now.</Text>
                                <Button mode="contained" buttonColor="#00E676" onPress={handleRefresh}>Refresh Market</Button>
                            </View>
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
    container: { padding: 20, paddingBottom: 50,  },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.2)' },
    listingCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    imageBg: { height: 180, justifyContent: 'flex-end' },
    imageOverlay: { flex: 1, padding: 15, justifyContent: 'space-between' },
    badgeRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, overflow: 'hidden' },
    badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    cardPad: { padding: 20 },
    listingTitle: { color: 'white', fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
    listingDesc: { color: '#B3E5FC', marginTop: 5, lineHeight: 18 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    buyBtn: { borderRadius: 12, paddingVertical: 4 }
});
