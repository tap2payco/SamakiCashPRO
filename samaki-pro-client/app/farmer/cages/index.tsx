import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Searchbar, Chip, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function CageListScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [cages, setCages] = useState<any[]>([]);
    const [filteredCages, setFilteredCages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, EMPTY

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
        }
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
        return (
            <Card style={styles.card} onPress={() => router.push(`/farmer/cages/${item.id}`)}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Chip textStyle={{ fontSize: 10, height: 12, lineHeight: 12 }} style={{ height: 24 }}>{item.type}</Chip>
                    </View>
                    <Text variant="bodySmall" style={{ color: '#666', marginTop: 4 }}>Example Location • Capacity: {item.capacity}</Text>

                    <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEE' }}>
                        {batch ? (
                            <View style={styles.row}>
                                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{batch.species}</Text>
                                <Text>{batch.currentQuantity} fish</Text>
                            </View>
                        ) : (
                            <Text style={{ color: '#999', fontStyle: 'italic' }}>No active batch</Text>
                        )}
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search cages..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.search}
            />

            <View style={styles.filters}>
                <Chip selected={filter === 'ALL'} onPress={() => setFilter('ALL')} style={styles.chip}>All</Chip>
                <Chip selected={filter === 'ACTIVE'} onPress={() => setFilter('ACTIVE')} style={styles.chip}>Active</Chip>
                <Chip selected={filter === 'EMPTY'} onPress={() => setFilter('EMPTY')} style={styles.chip}>Empty</Chip>
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredCages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30, color: '#999' }}>No cages found</Text>}
                />
            )}

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="white"
                onPress={() => router.push('/farmer/cages/create')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    search: { margin: 15, elevation: 2, backgroundColor: 'white' },
    filters: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 10 },
    chip: { marginRight: 8 },
    list: { paddingHorizontal: 15, paddingBottom: 80 },
    card: { marginBottom: 10, backgroundColor: 'white' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});
