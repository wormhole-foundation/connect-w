'use client';

import dynamic from 'next/dynamic';
import { type config } from '@wormhole-foundation/wormhole-connect';
import {
    nttExecutorRoute,
    nttManualRoute,
    type NttRoute,
    type NttExecutorRoute,
} from '@wormhole-foundation/wormhole-connect/ntt';

// Import generated configuration (created at build time by generate-config.ts)
import generatedConfig from '@/generated/wormhole-config.json';
import { clientConfig } from '@/lib/config';

// Type the NTT config from generated JSON
const nttConfig: NttRoute.Config =
    generatedConfig.nttRoutesConfig as NttRoute.Config;
const tokensConfig: config.TokensConfig =
    generatedConfig.tokensConfig as config.TokensConfig;

// Simple dynamic import - no SSR, clean and elegant
const WormholeConnect = dynamic(
    () => import('@wormhole-foundation/wormhole-connect'),
    { ssr: false }
);

// Build routes using the type expected by WormholeConnectConfig
// Note: Type assertion via unknown required due to SDK internal version mismatch between
// wormhole-connect's bundled SDK and the NTT package's SDK types. The types are structurally
// identical at runtime but TypeScript sees them as different due to separate npm package instances.
const nttRoutes = [
    // NTT Executor route (automatic/relayed) - primary option
    nttExecutorRoute({ ntt: nttConfig } satisfies NttExecutorRoute.Config),
    // NTT Manual route - fallback option
    nttManualRoute(nttConfig),
] as unknown as config.WormholeConnectConfig['routes'];

const wormholeConfig: config.WormholeConnectConfig = {
    network: generatedConfig.network as 'Mainnet' | 'Testnet',
    chains: generatedConfig.chains as config.WormholeConnectConfig['chains'],
    tokens: generatedConfig.tokens,
    ui: {
        title: 'Wormhole NTT UI',
        defaultInputs: {
            source: { chain: 'Base' },
            destination: { chain: 'Ethereum' },
        },
        walletConnectProjectId: clientConfig.walletConnectProjectId,
    },
    routes: nttRoutes,
    tokensConfig,
};

export default function Home() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <WormholeConnect
                    config={wormholeConfig}
                    theme={{ mode: 'dark', primary: '#78c4b6' }}
                />
            </div>
        </div>
    );
}
