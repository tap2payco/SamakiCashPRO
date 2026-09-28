import { defineConfig, devices } from '@playwright/test';

/**
 * Samaki Pro — E2E Test Configuration
 * 
 * Tests both the backend API (Bun/Elysia on :3000) and the
 * client web app (Expo Web on :8081) together.
 * 
 * Uses the system-installed Chrome to avoid Playwright CDN downloads.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { open: 'never' }],
        ['list']
    ],
    
    use: {
        /* Use system Chrome instead of downloading Playwright's bundled browser */
        channel: 'chrome',
        
        /* Collect trace on first retry for debugging */
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        /* ── API Tests ─────────────────────────────────────────── */
        {
            name: 'api',
            testDir: './tests/api',
            use: {
                baseURL: 'http://localhost:3000',
            },
        },

        /* ── Web UI Tests (Desktop Chrome) ─────────────────────── */
        {
            name: 'web-desktop',
            testDir: './tests/web',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
                baseURL: 'http://localhost:8081',
            },
        },

        /* ── Web UI Tests (Mobile Chrome - Samsung Galaxy) ──────── */
        {
            name: 'web-mobile',
            testDir: './tests/web',
            use: {
                ...devices['Galaxy S9+'],
                baseURL: 'http://localhost:8081',
            },
        },
    ],

    // /* ── Start both servers before running tests ──────────────── */
    // webServer: [
    //     {
    //         command: 'bun run dev',
    //         cwd: '../samaki-pro-backend',
    //         url: 'http://localhost:3000/health',
    //         reuseExistingServer: !process.env.CI,
    //         timeout: 30_000,
    //         env: {
    //             PORT: '3000',
    //             SKIP_AUTH: 'true',           // Bypass Supabase auth for E2E
    //             DATABASE_URL: 'file:../prisma/dev.db',
    //         },
    //     },
    //     {
    //         command: 'npx expo start --web --port 8081',
    //         cwd: '../samaki-pro-client',
    //         url: 'http://localhost:8081',
    //         reuseExistingServer: !process.env.CI,
    //         timeout: 60_000,
    //     },
    // ],
});
