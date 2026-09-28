/**
 * Samaki Pro — API E2E Tests: AI Agents & Vision
 *
 * Tests the market insight agent, pricing algorithm,
 * and the simulated AI vision endpoint.
 */
import { test, expect } from '@playwright/test';

test.describe('Market Insight Agent', () => {
    test('GET /agents/market/prices returns price data', async ({ request }) => {
        const response = await request.get('/agents/market/prices');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body).toBeTruthy();
    });

    test('GET /agents/market/insights returns market insights', async ({ request }) => {
        const response = await request.get('/agents/market/insights');
        expect(response.ok()).toBeTruthy();
    });

    test('POST /agents/pricing/suggest returns price suggestion', async ({ request }) => {
        const response = await request.post('/agents/pricing/suggest', {
            data: {
                species: 'Tilapia',
                quantity: 100,
                quality: 'premium'
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body).toBeTruthy();
    });

    test('POST /agents/pricing/calculate returns calculated price', async ({ request }) => {
        const response = await request.post('/agents/pricing/calculate', {
            data: {
                species: 'Nile Perch',
                quantity: 50,
                quality: 'standard',
                urgency: 'normal',
                location: 'Kirumba Market'
            }
        });

        expect(response.ok()).toBeTruthy();
    });

    test('POST /agents/pricing/optimize returns optimized match', async ({ request }) => {
        const response = await request.post('/agents/pricing/optimize', {
            data: {
                sellerPrice: 15000,
                buyerBudget: 12000,
                quantity: 30
            }
        });

        expect(response.ok()).toBeTruthy();
    });
});

test.describe('AI Vision (Simulated)', () => {
    test('POST /vision/analyze returns satiety analysis', async ({ request }) => {
        const response = await request.post('/vision/analyze');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.satietyLevel).toBeGreaterThanOrEqual(60);
        expect(body.satietyLevel).toBeLessThanOrEqual(100);
        expect(body.recommendation).toBeTruthy();
        expect(['STOP_FEEDING', 'REDUCE_FEEDING', 'CONTINUE_FEEDING']).toContain(body.action);
        expect(body.confidenceScore).toBeGreaterThan(0);
        expect(body.timestamp).toBeTruthy();
    });
});

test.describe('Insurance Evaluation', () => {
    test('POST /insurance/evaluate checks all active policies', async ({ request }) => {
        const response = await request.post('/insurance/evaluate');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(typeof body.evaluated).toBe('number');
        expect(typeof body.triggered).toBe('number');
        expect(Array.isArray(body.triggeredPolicies)).toBeTruthy();
    });
});
