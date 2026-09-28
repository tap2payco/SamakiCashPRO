/**
 * Samaki Pro — API E2E Tests: Escrow & Payments
 *
 * Tests the payment simulation and escrow lifecycle:
 * initiate payment → confirm → release funds.
 */
import { test, expect } from '@playwright/test';

test.describe('Payment Simulation', () => {
    let transactionId: string;

    test('POST /payments/initiate creates a mock M-Pesa transaction', async ({ request }) => {
        const response = await request.post('/payments/initiate', {
            data: {
                amount: 120000,
                phoneNumber: '+255741234567',
                provider: 'MPESA'
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();

        expect(body.status).toBe('success');
        expect(body.transactionId).toBeTruthy();
        expect(body.simulationNote).toContain('mocked');
        transactionId = body.transactionId;
    });

    test('POST /payments/simulate-callback completes the transaction', async ({ request }) => {
        // First, initiate a payment to get a transaction ID
        const initResponse = await request.post('/payments/initiate', {
            data: {
                amount: 50000,
                phoneNumber: '+255762345678',
                provider: 'TIGOPESA'
            }
        });
        const { transactionId: txId } = await initResponse.json();

        // Simulate successful callback
        const response = await request.post('/payments/simulate-callback', {
            data: {
                transactionId: txId,
                success: true
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('COMPLETED');
    });

    test('POST /payments/simulate-callback can simulate failure', async ({ request }) => {
        const initResponse = await request.post('/payments/initiate', {
            data: {
                amount: 75000,
                phoneNumber: '+255753456789',
                provider: 'MPESA'
            }
        });
        const { transactionId: txId } = await initResponse.json();

        const response = await request.post('/payments/simulate-callback', {
            data: {
                transactionId: txId,
                success: false
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('FAILED');
    });
});

test.describe('Escrow Lifecycle', () => {
    let escrowId: string;

    test('POST /escrow/create creates an escrow record', async ({ request }) => {
        const response = await request.post('/escrow/create', {
            data: {
                orderId: `test-order-${Date.now()}`,
                buyerId: 'test-buyer-id',
                sellerId: 'test-seller-id',
                amount: 250000
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();

        expect(body.id).toBeTruthy();
        expect(body.status).toBe('AWAITING_PAYMENT');
        expect(Number(body.amount)).toBe(250000);
        escrowId = body.id;
    });

    test('POST /escrow/confirm-payment moves escrow to FUNDS_HELD', async ({ request }) => {
        // Skip if no escrow was created
        test.skip(!escrowId, 'No escrow created in previous test');

        const response = await request.post('/escrow/confirm-payment', {
            data: {
                escrowId,
                transactionId: `TX_CONFIRMED_${Date.now()}`
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('FUNDS_HELD');
    });

    test('POST /escrow/release moves escrow to RELEASED_TO_SELLER', async ({ request }) => {
        test.skip(!escrowId, 'No escrow created in previous test');

        const response = await request.post('/escrow/release', {
            data: { escrowId }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('RELEASED_TO_SELLER');
    });
});
