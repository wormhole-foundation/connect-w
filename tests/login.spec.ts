import { test, expect, TEST_PASSWORD } from './fixtures';

test.describe('Login Protection', () => {
    test('redirects to login page when not authenticated', async ({ page }) => {
        // Clear cookies to ensure we're not authenticated
        await page.context().clearCookies();

        // Try to access the homepage
        await page.goto('/');

        // Should be redirected to login
        await expect(page).toHaveURL('/login');
    });

    test('login page displays correctly', async ({ page }) => {
        await page.goto('/login');

        // Check for login UI elements
        await expect(page.getByText('Welcome Back')).toBeVisible();
        await expect(
            page.getByText('Enter password to access the bridge')
        ).toBeVisible();
        await expect(
            page.getByPlaceholder('Enter your password')
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Continue' })
        ).toBeVisible();
    });

    test('shows error for invalid password', async ({ page }) => {
        await page.goto('/login');

        // Enter wrong password and wait for button to enable
        const passwordInput = page.getByPlaceholder('Enter your password');
        const continueButton = page.getByRole('button', { name: 'Continue' });

        await passwordInput.clear();
        await passwordInput.pressSequentially('wrongpassword', { delay: 10 });
        await expect(continueButton).toBeEnabled({ timeout: 10000 });
        await continueButton.click();

        // Should show error - use filter to get the correct alert
        await expect(
            page.getByRole('alert').filter({ hasText: 'Invalid password' })
        ).toBeVisible();
    });

    test('successful login redirects to homepage', async ({ page }) => {
        await page.goto('/login');

        // Enter test password
        const passwordInput = page.getByPlaceholder('Enter your password');
        const continueButton = page.getByRole('button', { name: 'Continue' });

        await passwordInput.clear();
        await passwordInput.pressSequentially(TEST_PASSWORD, { delay: 10 });
        await expect(continueButton).toBeEnabled({ timeout: 10000 });
        await continueButton.click();

        // Should redirect to homepage
        await expect(page).toHaveURL('/');

        // Should see the Wormhole Connect UI
        await expect(page.getByText('Wormhole NTT UI')).toBeVisible({
            timeout: 30000,
        });
    });

    test('password visibility toggle works', async ({ page }) => {
        await page.goto('/login');

        const passwordInput = page.getByPlaceholder('Enter your password');
        const toggleButton = page.getByRole('button', {
            name: 'Show password',
        });

        // Initially password should be hidden
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click toggle to show password
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');

        // Click toggle to hide password
        await page.getByRole('button', { name: 'Hide password' }).click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('continue button is disabled when password is empty', async ({
        page,
    }) => {
        await page.goto('/login');

        const passwordInput = page.getByPlaceholder('Enter your password');
        const continueButton = page.getByRole('button', { name: 'Continue' });

        // Button should be disabled initially
        await expect(continueButton).toBeDisabled();

        // Type password with sequential input for reliability
        await passwordInput.clear();
        await passwordInput.pressSequentially('test', { delay: 10 });

        // Button should be enabled
        await expect(continueButton).toBeEnabled({ timeout: 10000 });
    });

    test('authenticated user can access homepage directly', async ({
        page,
    }) => {
        // First login
        await page.goto('/login');
        const passwordInput = page.getByPlaceholder('Enter your password');
        const continueButton = page.getByRole('button', { name: 'Continue' });

        await passwordInput.clear();
        await passwordInput.pressSequentially(TEST_PASSWORD, { delay: 10 });
        await expect(continueButton).toBeEnabled({ timeout: 10000 });
        await continueButton.click();
        await expect(page).toHaveURL('/');

        // Navigate away and back - should still be authenticated
        await page.goto('/login');

        // Should redirect back to homepage or allow access
        // (middleware should let authenticated users through)
        await page.goto('/');
        await expect(page).toHaveURL('/');
    });
});
