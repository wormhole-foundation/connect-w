'use client';

import dynamic from 'next/dynamic';
import { type config } from '@wormhole-foundation/wormhole-connect';
import {
    nttExecutorRoute,
    nttManualRoute,
    type NttRoute,
    type NttExecutorRoute,
} from '@wormhole-foundation/wormhole-connect/ntt';

import generatedConfig from '@/generated/wormhole-config-testnet.json';
import { clientConfig } from '@/lib/config';
import { wormholeTheme } from '@/lib/theme';

const nttConfig: NttRoute.Config =
    generatedConfig.nttRoutesConfig as NttRoute.Config;
const tokensConfig: config.TokensConfig =
    generatedConfig.tokensConfig as config.TokensConfig;

const WormholeConnect = dynamic(
    () => import('@wormhole-foundation/wormhole-connect'),
    { ssr: false },
);

const nttRoutes = [
    nttExecutorRoute({ ntt: nttConfig } satisfies NttExecutorRoute.Config),
    nttManualRoute(nttConfig),
] as unknown as config.WormholeConnectConfig['routes'];

const wormholeConfig: config.WormholeConnectConfig = {
    network: generatedConfig.network as 'Mainnet' | 'Testnet',
    chains: generatedConfig.chains as config.WormholeConnectConfig['chains'],
    tokens: generatedConfig.tokens,
    ui: {
        title: 'Wormhole NTT UI - Testnet',
        defaultInputs: {
            source: { chain: 'Sepolia' },
            destination: { chain: 'Linea' },
        },
        walletConnectProjectId: clientConfig.walletConnectProjectId,
    },
    routes: nttRoutes,
    tokensConfig,
};

export default function TestnetPage() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
                background: wormholeTheme.gradients.background,
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '50%',
                    height: '50%',
                    background: `radial-gradient(circle, ${wormholeTheme.colors.primary}10 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: `radial-gradient(circle, ${wormholeTheme.colors.accent}10 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <WormholeConnect
                    config={wormholeConfig}
                    theme={{
                        mode: 'dark',
                        primary: wormholeTheme.colors.primary,
                    }}
                />
            </div>
        </div>
    );
}
