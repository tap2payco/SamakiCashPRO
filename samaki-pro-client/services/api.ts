import { Platform } from 'react-native';
import Constants from 'expo-constants';

// For Android Emulator, localhost is 10.0.2.2
// For Web, it's localhost
// For physical device, retrieve standard private IP (requires config) or use Tunnel URL (ngrok)
const getBaseUrl = () => {
    if (Platform.OS === 'web') return 'http://localhost:3000';
    if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
    return 'http://localhost:3000'; // Fallback
};

export const API_URL = getBaseUrl();

export const api = {
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
    post: async (endpoint: string, data: any) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
};
