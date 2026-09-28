# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\dashboard.spec.ts >> ERP Sidebar Navigation >> sidebar shows role-appropriate navigation links
- Location: tests\web\dashboard.spec.ts:63:9

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Page snapshot

```yaml
- generic [ref=f2e11]:
  - generic [ref=f2e12]:
    - generic [ref=f2e13]: Samaki ERP
    - generic [ref=f2e17]:
      - generic [ref=f2e19] [cursor=pointer]:
        - generic [ref=f2e20]:
          - button [disabled]:
            - img: 󰕮
        - generic [ref=f2e21]: Dashboard
      - generic [ref=f2e23] [cursor=pointer]:
        - generic [ref=f2e24]:
          - button [disabled]:
            - img: 󰖌
        - generic [ref=f2e25]: Production Inventory
      - generic [ref=f2e27] [cursor=pointer]:
        - generic [ref=f2e28]:
          - button [disabled]:
            - img: 󰓜
        - generic [ref=f2e29]: B2B Marketplace
      - generic [ref=f2e31] [cursor=pointer]:
        - generic [ref=f2e32]:
          - button [disabled]:
            - img: 󰞈
        - generic [ref=f2e33]: Escrow Logistics
      - generic [ref=f2e35] [cursor=pointer]:
        - generic [ref=f2e36]:
          - button [disabled]:
            - img: 󰕥
        - generic [ref=f2e37]: Micro-Insurance
    - generic [ref=f2e38]:
      - generic [ref=f2e39]:
        - img: 󰀄
      - generic [ref=f2e40]:
        - generic [ref=f2e41]: E2E Test FARMER
        - generic [ref=f2e42]: FARMER
      - button [ref=f2e44] [cursor=pointer]:
        - img: 󰍃
  - generic [ref=f2e49]:
    - generic [ref=f2e50]:
      - generic [ref=f2e51]: Command Center
      - button "Deploy Node" [ref=f2e53] [cursor=pointer]:
        - generic [ref=f2e54]:
          - generic [ref=f2e55]:
            - img: 󰐕
          - generic [ref=f2e56]: Deploy Node
    - generic [ref=f2e57]:
      - generic [ref=f2e59]:
        - generic [ref=f2e60]: "0"
        - generic [ref=f2e61]: Active Nodes
      - generic [ref=f2e63]:
        - generic [ref=f2e64]: "0"
        - generic [ref=f2e65]: Biomass (pcs)
      - generic [ref=f2e67]:
        - generic [ref=f2e68]: "0"
        - generic [ref=f2e69]: Idle
    - generic [ref=f2e70]: Live Telemetry
    - progressbar [ref=f2e71]
```

# Test source

```ts
  1  | /**
  2  |  * Samaki Pro — Web E2E Tests: Dashboard & Navigation
  3  |  *
  4  |  * Tests the ERP dashboard rendering and sidebar navigation.
  5  |  * These tests require an authenticated session, so they
  6  |  * inject auth state via localStorage before navigating.
  7  |  */
  8  | import { test, expect } from '@playwright/test';
  9  | 
  10 | /**
  11 |  * Helper: inject a mock authenticated user into AsyncStorage/localStorage
  12 |  * so the app thinks we're logged in.
  13 |  */
  14 | async function loginAs(page: import('@playwright/test').Page, role: 'FARMER' | 'VENDOR') {
  15 |     await page.goto('/');
  16 |     await page.evaluate((userRole) => {
  17 |         const mockUser = {
  18 |             id: 'e2e-test-user-id',
  19 |             phone: '+255700000000',
  20 |             fullName: `E2E Test ${userRole}`,
  21 |             role: userRole,
  22 |             session: {
  23 |                 access_token: 'e2e-mock-token'
  24 |             }
  25 |         };
  26 |         localStorage.setItem('user', JSON.stringify(mockUser));
  27 |     }, role);
  28 |     // Reload to pick up the stored auth
  29 |     await page.reload();
  30 | }
  31 | 
  32 | test.describe('Dashboard (Authenticated)', () => {
  33 |     test('farmer sees the dashboard after login', async ({ page }) => {
  34 |         await loginAs(page, 'FARMER');
  35 |         await page.goto('/dashboard');
  36 | 
  37 |         // Wait for content to load
  38 |         await page.waitForTimeout(2000);
  39 | 
  40 |         // Should see dashboard content or the ERP sidebar
  41 |         const dashboardVisible = await page.getByText(/dashboard/i).first().isVisible().catch(() => false);
  42 |         const samakiVisible = await page.getByText(/samaki/i).first().isVisible().catch(() => false);
  43 |         expect(dashboardVisible || samakiVisible).toBeTruthy();
  44 |     });
  45 | 
  46 |     test('vendor sees the dashboard after login', async ({ page }) => {
  47 |         await loginAs(page, 'VENDOR');
  48 |         await page.goto('/dashboard');
  49 |         await page.waitForTimeout(2000);
  50 | 
  51 |         const hasContent = await page.getByText(/dashboard|samaki/i).first().isVisible().catch(() => false);
  52 |         expect(hasContent).toBeTruthy();
  53 |     });
  54 | });
  55 | 
  56 | test.describe('ERP Sidebar Navigation', () => {
> 57 |     test.beforeEach(async ({ page }) => {
     |          ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  58 |         await loginAs(page, 'FARMER');
  59 |         await page.goto('/dashboard');
  60 |         await page.waitForTimeout(2000);
  61 |     });
  62 | 
  63 |     test('sidebar shows role-appropriate navigation links', async ({ page }) => {
  64 |         // Farmer should see Production, Marketplace, Insurance
  65 |         const production = await page.getByText(/production/i).first().isVisible().catch(() => false);
  66 |         const marketplace = await page.getByText(/marketplace/i).first().isVisible().catch(() => false);
  67 |         expect(production || marketplace).toBeTruthy();
  68 |     });
  69 | 
  70 |     test('sidebar shows user info and logout button', async ({ page }) => {
  71 |         // Should show the user's name or role
  72 |         const userName = await page.getByText(/E2E Test/i).first().isVisible().catch(() => false);
  73 |         const roleBadge = await page.getByText(/farmer/i).first().isVisible().catch(() => false);
  74 |         expect(userName || roleBadge).toBeTruthy();
  75 |     });
  76 | });
  77 | 
```