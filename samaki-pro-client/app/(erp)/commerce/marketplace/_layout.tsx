import { Stack } from 'expo-router';

export default function MarketplaceLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Marketplace' }} />
            <Stack.Screen name="create" options={{ title: 'Create Listing' }} />
            <Stack.Screen name="[id]" options={{ title: 'Listing Details' }} />
        </Stack>
    );
}
