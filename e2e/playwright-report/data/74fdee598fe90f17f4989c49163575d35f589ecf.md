# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\register.spec.ts >> Registration Page >> has role selection (FARMER / VENDOR)
- Location: tests\web\register.spec.ts:22:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e14]:
  - button [ref=e16] [cursor=pointer]:
    - img: 󰁍
  - generic [ref=e19]:
    - generic [ref=e20]: Create Account
    - generic [ref=e21]: Join the SamakiPRO Ecosystem
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic:
          - generic:
            - generic:
              - generic: Full Name
              - generic: Full Name
        - textbox [ref=e24]
      - button [ref=e27] [cursor=pointer]:
        - img: 󰀄
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic:
          - generic:
            - generic:
              - generic: Phone Number
              - generic: Phone Number
        - textbox [ref=e30]
      - button [ref=e33] [cursor=pointer]:
        - img: 󰏲
    - generic [ref=e34]:
      - generic [ref=e35]:
        - generic:
          - generic:
            - generic:
              - generic: Password
              - generic: Password
        - textbox [ref=e36]
      - button [ref=e39] [cursor=pointer]:
        - img: 󰌾
    - generic [ref=e40]: "I am registering as a:"
    - radiogroup [ref=e41]:
      - generic [ref=e42]:
        - radio "Farmer" [ref=e43] [cursor=pointer]:
          - generic:
            - generic: Farmer
            - radio
        - radio "Vendor" [ref=e44] [cursor=pointer]:
          - generic:
            - generic: Vendor
            - radio
    - button "Register" [ref=e46] [cursor=pointer]
    - generic [ref=e49]:
      - generic [ref=e50]: Already have an account?
      - button "Login" [ref=e52] [cursor=pointer]
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
  19 |         await expect(nameInput).toBeVisible();
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
> 30 |         expect(farmerVisible || vendorVisible).toBeTruthy();
     |                                                ^ Error: expect(received).toBeTruthy()
  31 |     });
  32 | 
  33 |     test('has a link to navigate back to login', async ({ page }) => {
  34 |         const loginLink = page.getByText(/login|sign in|already have/i).first();
  35 |         await expect(loginLink).toBeVisible();
  36 |     });
  37 | });
  38 | 
```