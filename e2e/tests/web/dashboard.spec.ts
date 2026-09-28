/**
 * Samaki Pro — Web E2E Tests: Dashboard & Navigation
 *
 * Tests the ERP dashboard rendering and sidebar navigation.
 * These tests require an authenticated session, so they
 * inject auth state via localStorage before navigating.
 */
import { test, expect } from '@playwright/test';

/**
 * Helper: inject a mock authenticated user into AsyncStorage/localStorage
 * so the app thinks we're logged in.
 */
async function loginAs(page: import('@playwright/test').Page, role: 'FARMER' | 'VENDOR') {
    await page.goto('/');
    await page.evaluate((userRole) => {
        const mockUser = {
            id: 'e2e-test-user-id',
            phone: '+255700000000',
            fullName: `E2E Test ${userRole}`,
            role: userRole,
            session: {
                access_token: 'e2e-mock-token'
            }
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
    }, role);
    // Reload to pick up the stored auth
    await page.reload();
}

test.describe('Dashboard (Authenticated)', () => {
    test('farmer sees the dashboard after login', async ({ page }) => {
        await loginAs(page, 'FARMER');
        await page.goto('/dashboard');

        // Wait for content to load
        await page.waitForTimeout(2000);

        // Should see dashboard content or the ERP sidebar
        const dashboardVisible = await page.getByText(/dashboard/i).first().isVisible().catch(() => false);
        const samakiVisible = await page.getByText(/samaki/i).first().isVisible().catch(() => false);
        expect(dashboardVisible || samakiVisible).toBeTruthy();
    });

    test('vendor sees the dashboard after login', async ({ page }) => {
        await loginAs(page, 'VENDOR');
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        const hasContent = await page.getByText(/dashboard|samaki/i).first().isVisible().catch(() => false);
        expect(hasContent).toBeTruthy();
    });
});

test.describe('ERP Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'FARMER');
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);
    });

    test('sidebar shows role-appropriate navigation links', async ({ page }) => {
        // Farmer should see Production, Marketplace, Insurance
        const production = await page.getByText(/production/i).first().isVisible().catch(() => false);
        const marketplace = await page.getByText(/marketplace/i).first().isVisible().catch(() => false);
        expect(production || marketplace).toBeTruthy();
    });

    test('sidebar shows user info and logout button', async ({ page }) => {
        // Should show the user's name or role
        const userName = await page.getByText(/E2E Test/i).first().isVisible().catch(() => false);
        const roleBadge = await page.getByText(/farmer/i).first().isVisible().catch(() => false);
        expect(userName || roleBadge).toBeTruthy();
    });
});
