import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '~/services/api';
import { useAppTheme } from '~/theme';
import {
    PageHeader,
    Input,
    SegmentedControl,
    GlassCard,
    StatusBadge,
    SourceTag,
    EmptyState,
    Button,
} from '~/components/ui';

export default function CageListScreen() {
    const router = useRouter();
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();
    const [cages, setCages] = useState<any[]>([]);
    const [filteredCages, setFilteredCages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, EMPTY

    const isSw = language === 'sw';

    useEffect(() => {
        fetchCages();
    }, []);

    useEffect(() => {
        filterCages();
    }, [cages, searchQuery, filter]);

    const fetchCages = async () => {
        try {
            const data = await api.get('/cages');
            setCages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCages();
    };

    const filterCages = () => {
        let result = cages;

        if (searchQuery) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (filter === 'ACTIVE') {
            result = result.filter(c => c.batches?.length > 0 && c.batches[0].status === 'ACTIVE');
        } else if (filter === 'EMPTY') {
            result = result.filter(c => !c.batches?.length || c.batches[0].status !== 'ACTIVE');
        }

        setFilteredCages(result);
    };

    const renderItem = ({ item }: { item: any }) => {
        const batch = item.batches?.[0];
        const sensor = item.sensors?.[0];
        const isActive = !!batch;

        return (
            <GlassCard 
                key={item.id}
                style={[
                    styles.card,
                    {
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderWidth: isSunMode ? 2 : 1,
                        marginBottom: spacing.space3,
                    }
                ]}
            >
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.cageName, { color: colors.ink }]}>{item.name}</Text>
                        <Text style={[styles.cageType, { color: colors.inkMuted }]}>
                            {item.type} • {isSw ? 'Uwezo:' : 'Capacity:'} {item.capacity?.toLocaleString()}
                        </Text>
                    </View>
                    <StatusBadge status={isActive ? 'ok' : 'no-reading'} size="sm" />
                </View>

                <View style={[styles.detailBox, { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 12, paddingTop: 10 }]}>
                    {batch ? (
                        <View style={styles.row}>
                            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>
                                {batch.species}
                            </Text>
                            <Text style={{ color: colors.ink, fontWeight: '800', fontSize: 14 }}>
                                {batch.currentQuantity?.toLocaleString()} {isSw ? 'samaki' : 'fish'}
                            </Text>
                        </View>
                    ) : (
                        <Text style={{ color: colors.inkMuted, fontStyle: 'italic', fontSize: 13 }}>
                            {isSw ? 'Hakuna kundi lililowekwa' : 'No active batch'}
                        </Text>
                    )}
                </View>

                <View style={[styles.row, { marginTop: 10, alignItems: 'center' }]}>
                    <SourceTag source={sensor ? 'sensor' : 'manual'} timestamp={sensor ? '14:30' : undefined} />
                    <Button
                        variant="secondary"
                        size="sm"
                        icon="chevron-right"
                        onPress={() => router.push(`/production/cages/${item.id}` as any)}
                    >
                        {isSw ? 'Angalia' : 'View'}
                    </Button>
                </View>
            </GlassCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surfacePage }]}>
            <View style={{ paddingHorizontal: spacing.space4, paddingTop: spacing.space3 }}>
                <PageHeader 
                    title={isSw ? 'Orodha ya Vizimba' : 'Cage Inventory'}
                    subtitle={isSw ? 'Usimamizi wa Vizimba vya Majini' : 'Lake Victoria Aquaculture Production'}
                    locationChip="Mwanza Gulf"
                    categoryChip="Cages"
                />

                <Input
                    placeholder={isSw ? 'Tafuta vizimba...' : 'Search cages...'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    containerStyle={{ marginVertical: 8 }}
                />

                <SegmentedControl 
                    options={[
                        { value: 'ALL', label: isSw ? 'Vyote' : 'All' },
                        { value: 'ACTIVE', label: isSw ? 'Vilivyo Hai' : 'Active' },
                        { value: 'EMPTY', label: isSw ? 'Visivyo na Samaki' : 'Empty' },
                    ]}
                    selectedValue={filter}
                    onSelect={setFilter}
                    style={{ marginBottom: 12 }}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
            ) : (
                <FlatList
                    data={filteredCages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={[styles.list, { paddingHorizontal: spacing.space4, paddingBottom: 80 }]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        <EmptyState 
                            title={isSw ? 'Hakuna vizimba vilivyopatikana' : 'No cages found'}
                            description={isSw ? 'Ongeza kizimba kipya kuanza uzalishaji.' : 'Deploy your first cage to begin production.'}
                            actionLabel={isSw ? 'Ongeza Kizimba' : 'Deploy Cage'}
                            onAction={() => router.push('/production/cages/create' as any)}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { paddingTop: 6 },
    card: { padding: 14 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cageName: { fontWeight: '700', fontSize: 16 },
    cageType: { fontSize: 12, marginTop: 2 },
    detailBox: { width: '100%' }
});
