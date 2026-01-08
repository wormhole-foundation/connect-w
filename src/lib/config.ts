/**
 * Centralized configuration loaded from environment variables
 *
 * For build-time scripts (generate-config.ts), dotenv loads these from .env
 * For client-side (page.tsx), Next.js exposes NEXT_PUBLIC_* vars
 */

// Build-time config (used by generate-config.ts)
export const buildConfig = {
    /** CoinGecko API key for fetching token metadata */
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
};

// Client-side config (must use NEXT_PUBLIC_ prefix for Next.js)
export const clientConfig = {
    /** WalletConnect project ID - get one at https://cloud.walletconnect.com */
    walletConnectProjectId:
        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
};
