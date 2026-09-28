# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\register.spec.ts >> Registration Page >> renders the registration form
- Location: tests\web\register.spec.ts:14:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[placeholder*="name" i], input[placeholder*="jina" i]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('input[placeholder*="name" i], input[placeholder*="jina" i]').first() with timeout 5000ms
  - waiting for locator('input[placeholder*="name" i], input[placeholder*="jina" i]').first()

```

```yaml
- button:
  - img: 󰁍
- text: Create Account Join the SamakiPRO Ecosystem Full Name Full Name
- textbox
- button:
  - img: 󰀄
- text: Phone Number Phone Number
- textbox
- button:
  - img: 󰏲
- text: Password Password
- textbox
- button:
  - img: 󰌾
- text: "I am registering as a:"
- radiogroup:
  - radio "Farmer":
    - text: Farmer
    - radio
  - radio "Vendor":
    - text: Vendor
    - radio
- button "Register"
- text: Already have an account?
- button "Login"
```

# Test source

```ts
  1  | /**
  2  |  * Samaki Pro — Web E2E Tests: Registration Flow
  3  |  *
  4  |  * Tests the registration page rendering, role selection,
  5  |  * form validation, and successful registration.
  6  |  */
  7  | import { test, expect } from '@playwright/test';
  8  | 
  9  | test.describe('Registration Page', () => {
  10 |     test.beforeEach(async ({ page }) => {
  11 |         await page.goto('/auth/register');
  12 |     });
  13 | 
  14 |     test('renders the registration form', async ({ page }) => {
  15 |         await expect(page.getByText(/register|sign up|create/i).first()).toBeVisible();
  16 | 
  17 |         // Check for essential fields
  18 |         const nameInput = page.locator('input[placeholder*="name" i], input[placeholder*="jina" i]').first();
> 19 |         await expect(nameInput).toBeVisible();
     |                                 ^ Error: expect(locator).toBeVisible() failed
  20 |     });
  21 | 
  22 |     test('has role selection (FARMER / VENDOR)', async ({ page }) => {
  23 |         // Look for role selection elements
  24 |         const farmerOption = page.getByText(/farmer|mkulima/i).first();
  25 |         const vendorOption = page.getByText(/vendor|muuzaji/i).first();
  26 | 
  27 |         // At least one role option should be visible
  28 |         const farmerVisible = await farmerOption.isVisible().catch(() => false);
  29 |         const vendorVisible = await vendorOption.isVisible().catch(() => false);
  30 |         expect(farmerVisible || vendorVisible).toBeTruthy();
  31 |     });
  32 | 
  33 |     test('has a link to navigate back to login', async ({ page }) => {
  34 |         const loginLink = page.getByText(/login|sign in|already have/i).first();
  35 |         await expect(loginLink).toBeVisible();
  36 |     });
  37 | });
  38 | 
```