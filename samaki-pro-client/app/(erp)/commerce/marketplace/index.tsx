import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAppTheme } from '~/theme';
import {
    PageHeader,
    DataTable,
    StatusBadge,
    SourceTag,
    Button,
    GlassCard,
    EmptyState,
} from '~/components/ui';

export default function MarketplaceScreen() {
    const router = useRouter();
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showBenchTable, setShowBenchTable] = useState(false);

    const isSw = language === 'sw';

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
            <GlassCard 
                key={listing.id}
                style={[
                    styles.listingCard,
                    {
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderWidth: isSunMode ? 2 : 1,
                        marginBottom: spacing.space4,
                    }
                ]}
            >
                <ImageBackground 
                    source={{ uri: listing.imageUrl || 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.imageBg}
                >
                    <View style={styles.imageOverlay}>
                        <View style={styles.badgeRow}>
                            <View 
                                style={[
                                    styles.unitBadge, 
                                    { 
                                        backgroundColor: colors.surfaceCard, 
                                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                                        borderWidth: 1,
                                        borderRadius: radii.pill,
                                    }
                                ]}
                            >
                                <Text style={[styles.unitBadgeText, { color: colors.primary }]}>
                                    {listing.unit}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.cardPad, { padding: spacing.space4 }]}>
                    <View style={styles.row}>
                        <Text style={[styles.listingTitle, { color: colors.ink }]}>{listing.title}</Text>
                        <StatusBadge status="ok" label={isSw ? 'Inapatikana' : 'Available'} size="sm" />
                    </View>

                    <Text style={[styles.listingDesc, { color: colors.inkMuted }]} numberOfLines={2}>
                        {listing.description || (isSw 
                            ? 'Samaki bora kutoka kwa wafugaji walioidhinishwa katika mfumo wa Samaki Pro.' 
                            : 'Premium farm-raised fish stock from verified farmers in the Samaki Ecosystem.')}
                    </Text>

                    <View style={[styles.priceRow, { borderTopColor: colors.border, borderTopWidth: 1, marginTop: spacing.space3, paddingTop: spacing.space3 }]}>
                        <View>
                            <Text style={[styles.priceLabel, { color: colors.inkMuted }]}>
                                {isSw ? 'BEI KWA KILO' : 'PRICE PER KG'}
                            </Text>
                            <Text style={[styles.priceVal, { color: colors.primary }]}>
                                TZS {parseInt(listing.price || '0').toLocaleString()}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.priceLabel, { color: colors.inkMuted }]}>
                                {isSw ? 'KIASI KILICHOPO' : 'AVAILABLE'}
                            </Text>
                            <Text style={[styles.qtyVal, { color: colors.ink }]}>
                                {listing.quantity} {listing.unit}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.row, { marginTop: spacing.space3, alignItems: 'center' }]}>
                        <SourceTag source="manual" timestamp="Verified" />
                        <Button 
                            variant="primary" 
                            size="md" 
                            icon="cart-plus" 
                            onPress={() => router.push(`/commerce/marketplace/${listing.id}` as any)}
                        >
                            {isSw ? 'Angalia & Nunua' : 'View Details & Buy'}
                        </Button>
                    </View>
                </View>
            </GlassCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surfacePage }]}>
            <View style={{ paddingHorizontal: spacing.space4, paddingTop: spacing.space3 }}>
                <PageHeader 
                    title={isSw ? 'Soko la Samaki B2B' : 'B2B Fish Marketplace'}
                    subtitle={isSw ? 'Mwenendo wa Bei Kirumba & Mwaloni' : 'Live Auctions & Trading'}
                    locationChip="Kirumba, Mwanza"
                    categoryChip="Market"
                />

                {/* Benchmark toggle */}
                <View style={{ marginVertical: spacing.space2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 15 }}>
                        {isSw ? 'Bei Elekezi za Soko' : 'Market Price Benchmarks'}
                    </Text>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onPress={() => setShowBenchTable(!showBenchTable)}
                    >
                        {showBenchTable ? (isSw ? 'Ficha' : 'Hide') : (isSw ? 'Onyesha Jedwali' : 'Show Table')}
                    </Button>
                </View>

                {showBenchTable && (
                    <View style={{ marginBottom: spacing.space3 }}>
                        <DataTable />
                    </View>
                )}
            </View>

            <ScrollView 
                contentContainerStyle={{ paddingHorizontal: spacing.space4, paddingBottom: 80 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
            >
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
                ) : (
                    <View>
                        {listings.length === 0 ? (
                            <EmptyState 
                                title={isSw ? 'Hakuna samaki sokoni kwa sasa' : 'No fish stock available right now'}
                                description={isSw 
                                    ? 'Wafugaji bado hawajaweka oda mpya. Bonyeza kuboresha soko.' 
                                    : 'Farmers have not posted new batches yet. Tap to refresh the market.'}
                                actionLabel={isSw ? 'Boresha Soko' : 'Refresh Market'}
                                onAction={handleRefresh}
                            />
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
    container: { flex: 1 },
    listingCard: { overflow: 'hidden' },
    imageBg: { height: 180, justifyContent: 'flex-end' },
    imageOverlay: { flex: 1, padding: 12, justifyContent: 'flex-start', backgroundColor: 'rgba(0,0,0,0.2)' },
    badgeRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    unitBadge: { paddingHorizontal: 12, paddingVertical: 4 },
    unitBadgeText: { fontWeight: '700', fontSize: 11, textTransform: 'uppercase' },
    cardPad: { width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listingTitle: { fontWeight: '800', fontSize: 18, flex: 1, marginRight: 8 },
    listingDesc: { marginTop: 6, lineHeight: 20, fontSize: 13 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    priceLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    priceVal: { fontWeight: '900', fontSize: 20 },
    qtyVal: { fontWeight: '700', fontSize: 15 }
});
