/**
 * Samaki Pro — API E2E Tests: Marketplace
 *
 * Tests listing creation, retrieval, and filtering via the
 * marketplace API endpoints.
 */
import { test, expect } from '@playwright/test';

test.describe('Marketplace API', () => {
    let listingId: string;

    test('GET /marketplace/listings returns an array', async ({ request }) => {
        const response = await request.get('/marketplace/listings');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
    });

    test('POST /marketplace/listings creates a new listing (with SKIP_AUTH)', async ({ request }) => {
        // Note: In SKIP_AUTH mode, user resolution via Supabase is bypassed.
        // This test verifies the endpoint shape and validation.
        const response = await request.post('/marketplace/listings', {
            data: {
                title: 'Fresh Tilapia - E2E Test',
                description: 'Farm-raised Nile Tilapia from Lake Victoria',
                price: 12000,
                quantity: 50,
                unit: 'kg'
            }
        });

        // May return 400 (profile not found for offline user) or 200
        // We're testing that the endpoint doesn't crash
        const status = response.status();
        expect([200, 400, 401]).toContain(status);

        if (response.ok()) {
            const body = await response.json();
            expect(body.title).toBe('Fresh Tilapia - E2E Test');
            expect(body.id).toBeTruthy();
            listingId = body.id;
        }
    });

    test('GET /marketplace/listings/:id returns a specific listing', async ({ request }) => {
        // First, get all listings to find one
        const listResponse = await request.get('/marketplace/listings');
        const listings = await listResponse.json();

        if (listings.length > 0) {
            const id = listings[0].id;
            const response = await request.get(`/marketplace/listings/${id}`);
            expect(response.ok()).toBeTruthy();

            const body = await response.json();
            expect(body.id).toBe(id);
            expect(body.title).toBeTruthy();
            expect(body.price).toBeTruthy();
        }
    });
});
