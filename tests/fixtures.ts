import { test as base } from '@playwright/test';

// Test password - matches the one in playwright.config.ts
export const TEST_PASSWORD = 'e2e-test-password';

// Extend base test with authentication helper
export const test = base.extend<{ authenticate: () => Promise<void> }>({
    authenticate: async ({ page }, use) => {
        const authenticate = async () => {
            await page.goto('/login');
            const passwordInput = page.getByPlaceholder('Enter your password');
            const continueButton = page.getByRole('button', {
                name: 'Continue',
            });

            await passwordInput.clear();
            await passwordInput.pressSequentially(TEST_PASSWORD, { delay: 10 });
            await base.expect(continueButton).toBeEnabled({ timeout: 10000 });
            await continueButton.click();
            await base.expect(page).toHaveURL('/');
        };
        await use(authenticate);
    },
});

export { expect } from '@playwright/test';
