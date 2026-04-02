import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://samakicashpro.onrender.com';

const getHeaders = async () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
        }
    } catch (e) {
        // ignore
    }
    return headers;
};

export const api = {
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: await getHeaders()
            });
            const textResponse = await response.text();
            let data: any;
            try { data = JSON.parse(textResponse); } catch (e) { data = { message: textResponse }; }
            
            if (!response.ok) throw new Error(data?.message || `API Error: ${response.status}`);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
    post: async (endpoint: string, bodyData: any) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: await getHeaders(),
                body: JSON.stringify(bodyData)
            });
            
            const textResponse = await response.text();
            let data: any;
            try { data = JSON.parse(textResponse); } catch (e) { data = { message: textResponse }; }
            
            if (!response.ok) throw new Error(data?.message || `API Error: ${response.status}`);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
};
