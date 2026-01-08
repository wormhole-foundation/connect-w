import { test, expect } from '@playwright/test';

test('has title and Wormhole NTT UI text', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Wormhole|Connect|NTT/);

    // Wait for the page to load and check for the Wormhole NTT UI text
    // Since the component is dynamically loaded, we need to wait for it
    await expect(page.getByText('Wormhole NTT UI')).toBeVisible({
        timeout: 30000,
    });
});

test('loads wormhole connect component', async ({ page }) => {
    await page.goto('/');

    // Wait for the dynamic component to load
    // Look for common Wormhole Connect elements that should appear
    await page.waitForTimeout(5000); // Give time for dynamic import

    // Check that the page has loaded without errors by verifying no error text
    const errorMessages = page.locator('text=Error');
    await expect(errorMessages).toHaveCount(0);

    // Verify the body is visible and page loaded successfully
    await expect(page.locator('body')).toBeVisible();
});
