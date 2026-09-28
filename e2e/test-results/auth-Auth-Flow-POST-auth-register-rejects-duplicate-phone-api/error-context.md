# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\auth.spec.ts >> Auth Flow >> POST /auth/register rejects duplicate phone
- Location: tests\api\auth.spec.ts:56:9

# Error details

```
Error: expect(received).toBeFalsy()

Received: true
```

# Test source

```ts
  1  | /**
  2  |  * Samaki Pro — API E2E Tests: Health & Auth
  3  |  *
  4  |  * Tests the backend API server health endpoint and the
  5  |  * register → login authentication flow.
  6  |  */
  7  | import { test, expect } from '@playwright/test';
  8  | 
  9  | test.describe('Health Check', () => {
  10 |     test('GET /health returns 200 with status ok', async ({ request }) => {
  11 |         const response = await request.get('/health');
  12 |         expect(response.ok()).toBeTruthy();
  13 | 
  14 |         const body = await response.json();
  15 |         expect(body.status).toBe('ok');
  16 |         expect(body.timestamp).toBeTruthy();
  17 |     });
  18 | 
  19 |     test('GET / returns welcome message', async ({ request }) => {
  20 |         const response = await request.get('/');
  21 |         expect(response.ok()).toBeTruthy();
  22 | 
  23 |         const text = await response.text();
  24 |         expect(text).toContain('Samaki');
  25 |     });
  26 | });
  27 | 
  28 | test.describe('Auth Flow', () => {
  29 |     const testPhone = `+255${Date.now().toString().slice(-9)}`;
  30 |     const testPassword = 'TestPass123!';
  31 |     let authToken: string;
  32 | 
  33 |     test('POST /auth/register creates a new farmer account', async ({ request }) => {
  34 |         const response = await request.post('/auth/register', {
  35 |             data: {
  36 |                 phone: testPhone,
  37 |                 password: testPassword,
  38 |                 fullName: 'E2E Test Farmer',
  39 |                 role: 'FARMER'
  40 |             }
  41 |         });
  42 | 
  43 |         expect(response.ok()).toBeTruthy();
  44 |         const body = await response.json();
  45 | 
  46 |         expect(body.profile).toBeTruthy();
  47 |         expect(body.profile.phone).toBe(testPhone);
  48 |         expect(body.profile.fullName).toBe('E2E Test Farmer');
  49 |         expect(body.profile.role).toBe('FARMER');
  50 |         expect(body.token).toBeTruthy();
  51 |         expect(body.session?.access_token).toBeTruthy();
  52 | 
  53 |         authToken = body.token;
  54 |     });
  55 | 
  56 |     test('POST /auth/register rejects duplicate phone', async ({ request }) => {
  57 |         const response = await request.post('/auth/register', {
  58 |             data: {
  59 |                 phone: testPhone,
  60 |                 password: testPassword,
  61 |                 fullName: 'Duplicate User',
  62 |                 role: 'FARMER'
  63 |             }
  64 |         });
  65 | 
  66 |         // Should fail — phone already registered
> 67 |         expect(response.ok()).toBeFalsy();
     |                               ^ Error: expect(received).toBeFalsy()
  68 |     });
  69 | 
  70 |     test('POST /auth/login returns a valid session', async ({ request }) => {
  71 |         const response = await request.post('/auth/login', {
  72 |             data: {
  73 |                 phone: testPhone,
  74 |                 password: testPassword
  75 |             }
  76 |         });
  77 | 
  78 |         expect(response.ok()).toBeTruthy();
  79 |         const body = await response.json();
  80 | 
  81 |         expect(body.profile.phone).toBe(testPhone);
  82 |         expect(body.token).toBeTruthy();
  83 |         expect(body.session?.access_token).toBeTruthy();
  84 |     });
  85 | 
  86 |     test('POST /auth/login rejects wrong password', async ({ request }) => {
  87 |         const response = await request.post('/auth/login', {
  88 |             data: {
  89 |                 phone: testPhone,
  90 |                 password: 'WrongPassword!'
  91 |             }
  92 |         });
  93 | 
  94 |         expect(response.ok()).toBeFalsy();
  95 |     });
  96 | });
  97 | 
```