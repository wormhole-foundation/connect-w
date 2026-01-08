/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // Disable source maps in development to reduce console noise
    productionBrowserSourceMaps: false,
    // Turbopack config (default in Next.js 16)
    turbopack: {
        root: __dirname,
    },
    // Transpile Wormhole packages
    transpilePackages: [
        '@wormhole-foundation/wormhole-connect',
        '@wormhole-foundation/sdk',
        '@mui/material',
        '@mui/system',
        '@emotion/react',
        '@emotion/styled',
    ],
    // Reduce console output
    logging: {
        fetches: {
            fullUrl: false,
        },
    },
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
};

module.exports = nextConfig;
