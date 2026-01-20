import { test, expect } from './fixtures';

test('testnet route has title and Wormhole NTT UI - Testnet text', async ({
    page,
    authenticate,
}) => {
    await authenticate();

    await page.goto('/testnet');

    await expect(page).toHaveTitle(/Wormhole|Connect|NTT/);

    await expect(page.getByText('Wormhole NTT UI - Testnet')).toBeVisible({
        timeout: 30000,
    });
});

test('testnet route loads wormhole connect component', async ({
    page,
    authenticate,
}) => {
    await authenticate();

    await page.goto('/testnet');

    await page.waitForTimeout(5000);

    const errorMessages = page.locator('text=Error');
    await expect(errorMessages).toHaveCount(0);

    await expect(page.locator('body')).toBeVisible();
});
