'use client';

import dynamic from 'next/dynamic';
import { type config } from '@wormhole-foundation/wormhole-connect';
import { nttRoutes } from '@wormhole-foundation/wormhole-connect/ntt';

// Import generated configuration (created at build time by generate-config.ts)
import generatedConfig from '@/generated/wormhole-config.json';

// Simple dynamic import - no SSR, clean and elegant
const WormholeConnect = dynamic(
    () => import('@wormhole-foundation/wormhole-connect'),
    { ssr: false }
);

const wormholeConfig: config.WormholeConnectConfig = {
    network: generatedConfig.network as 'Mainnet' | 'Testnet',
    chains: generatedConfig.chains as config.WormholeConnectConfig['chains'],
    tokens: generatedConfig.tokens,
    ui: {
        title: 'Wormhole NTT UI',
        defaultInputs: {
            fromChain: 'Base',
            toChain: 'Ethereum',
        },
        // walletConnectProjectId: '',
    },
    // TODO: use a private RPC for mainnet
    // rpcs: {
    //     Solana: 'https://api.mainnet-beta.solana.com/',
    //     Ethereum: 'https://eth.llamarpc.com',
    // },
    routes: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...nttRoutes(generatedConfig.nttRoutesConfig as any),
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokensConfig: generatedConfig.tokensConfig as any,
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
