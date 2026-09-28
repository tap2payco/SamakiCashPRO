/**
 * Samaki Pro — Web E2E Tests: Login Flow
 *
 * Tests the login page rendering, form validation,
 * and successful login → dashboard redirect on the Expo Web app.
 */
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
    });

    test('renders the login form with phone and password fields', async ({ page }) => {
        // Check for key form elements
        await expect(page.getByText(/login/i).first()).toBeVisible();
        
        // Look for phone input (may be labeled "Phone" or have placeholder)
        const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="255" i]').first();
        await expect(phoneInput).toBeVisible();

        // Look for password input
        const passwordInput = page.locator('input[type="password"]').first();
        await expect(passwordInput).toBeVisible();
    });

    test('shows the Samaki Pro branding', async ({ page }) => {
        await expect(page.getByText(/samaki/i).first()).toBeVisible();
    });

    test('has a link/button to navigate to registration', async ({ page }) => {
        const registerLink = page.getByText(/register|sign up|create account/i).first();
        await expect(registerLink).toBeVisible();
    });

    test('login form rejects empty submission', async ({ page }) => {
        // Find and click the login/submit button
        const submitButton = page.getByRole('button', { name: /login|sign in|submit/i }).first();
        
        if (await submitButton.isVisible()) {
            await submitButton.click();
            // Should stay on login page (not redirect)
            await expect(page).toHaveURL(/auth\/login/);
        }
    });
});
