import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams();
    const [listing, setListing] = useState<any>(null);

    useEffect(() => {
        if (id) {
            api.get(`/marketplace/listings/${id}`).then(setListing).catch(console.error);
        }
    }, [id]);

    if (!listing) return <Text style={{ padding: 20 }}>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Card>
                <Card.Cover source={{ uri: 'https://via.placeholder.com/400x200.png?text=Fish+Image' }} />
                <Card.Content style={{ paddingTop: 20 }}>
                    <Text variant="headlineMedium" style={styles.title}>{listing.title}</Text>
                    <Text variant="titleMedium" style={styles.price}>{parseInt(listing.price).toLocaleString()} TZS</Text>

                    <View style={styles.tagContainer}>
                        <Button mode="outlined" compact style={{ marginRight: 10 }}>{listing.quantity} {listing.unit}</Button>
                        <Button mode="outlined" compact>In Stock</Button>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text variant="bodyLarge">{listing.description || 'No description provided.'}</Text>

                    <Text variant="titleSmall" style={{ marginTop: 20 }}>Seller Info</Text>
                    <Text>{listing.seller?.fullName}</Text>
                    <Text>{listing.seller?.location}</Text>
                </Card.Content>
                <Card.Actions style={{ padding: 20 }}>
                    <Button mode="contained" style={styles.buyButton} onPress={() => console.log('Buy')}>
                        Buy Now
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    title: { fontWeight: 'bold', color: '#00609C' },
    price: { color: '#FFA600', fontWeight: 'bold', marginTop: 5 },
    tagContainer: { flexDirection: 'row', marginTop: 15 },
    buyButton: { flex: 1, backgroundColor: '#00609C' }
});
