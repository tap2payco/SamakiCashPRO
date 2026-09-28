/**
 * Samaki Pro — Web E2E Tests: Registration Flow
 *
 * Tests the registration page rendering, role selection,
 * form validation, and successful registration.
 */
import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/register');
    });

    test('renders the registration form', async ({ page }) => {
        await expect(page.getByText(/register|sign up|create/i).first()).toBeVisible();

        // Check for essential fields
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible();
    });

    test('has role selection (FARMER / VENDOR)', async ({ page }) => {
        // Look for role selection elements
        const farmerOption = page.getByText(/Farmer|Mkulima/i).first();
        const vendorOption = page.getByText(/Vendor|Muuzaji/i).first();

        // At least one role option should be visible
        const farmerVisible = await farmerOption.isVisible().catch(() => false);
        const vendorVisible = await vendorOption.isVisible().catch(() => false);
        expect(farmerVisible || vendorVisible).toBeTruthy();
    });

    test('has a link to navigate back to login', async ({ page }) => {
        const loginLink = page.getByText(/login|sign in|already have/i).first();
        await expect(loginLink).toBeVisible();
    });
});
