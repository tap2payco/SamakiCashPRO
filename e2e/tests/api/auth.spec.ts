/**
 * Samaki Pro — API E2E Tests: Health & Auth
 *
 * Tests the backend API server health endpoint and the
 * register → login authentication flow.
 */
import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {
    test('GET /health returns 200 with status ok', async ({ request }) => {
        const response = await request.get('/health');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.status).toBe('ok');
        expect(body.timestamp).toBeTruthy();
    });

    test('GET / returns welcome message', async ({ request }) => {
        const response = await request.get('/');
        expect(response.ok()).toBeTruthy();

        const text = await response.text();
        expect(text).toContain('Samaki');
    });
});

test.describe('Auth Flow', () => {
    const testPhone = `+255${Date.now().toString().slice(-9)}`;
    const testPassword = 'TestPass123!';
    let authToken: string;

    test('POST /auth/register creates a new farmer account', async ({ request }) => {
        const response = await request.post('/auth/register', {
            data: {
                phone: testPhone,
                password: testPassword,
                fullName: 'E2E Test Farmer',
                role: 'FARMER'
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();

        expect(body.profile).toBeTruthy();
        expect(body.profile.phone).toBe(testPhone);
        expect(body.profile.fullName).toBe('E2E Test Farmer');
        expect(body.profile.role).toBe('FARMER');
        expect(body.token).toBeTruthy();
        expect(body.session?.access_token).toBeTruthy();

        authToken = body.token;
    });

    test('POST /auth/register rejects duplicate phone', async ({ request }) => {
        const response = await request.post('/auth/register', {
            data: {
                phone: testPhone,
                password: testPassword,
                fullName: 'Duplicate User',
                role: 'FARMER'
            }
        });

        // Should fail — phone already registered
        expect(response.ok()).toBeFalsy();
    });

    test('POST /auth/login returns a valid session', async ({ request }) => {
        const response = await request.post('/auth/login', {
            data: {
                phone: testPhone,
                password: testPassword
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();

        expect(body.profile.phone).toBe(testPhone);
        expect(body.token).toBeTruthy();
        expect(body.session?.access_token).toBeTruthy();
    });

    test('POST /auth/login rejects wrong password', async ({ request }) => {
        const response = await request.post('/auth/login', {
            data: {
                phone: testPhone,
                password: 'WrongPassword!'
            }
        });

        expect(response.ok()).toBeFalsy();
    });
});
