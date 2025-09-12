'use client';

import dynamic from 'next/dynamic';
import { type config } from '@wormhole-foundation/wormhole-connect';
import { nttRoutes } from '@wormhole-foundation/wormhole-connect/ntt';

// Simple dynamic import - no SSR, clean and elegant
const WormholeConnect = dynamic(
    () => import('@wormhole-foundation/wormhole-connect'),
    { ssr: false }
);

const wormholeConfig: config.WormholeConnectConfig = {
    network: 'Mainnet',
    chains: ['Solana', 'Ethereum'],
    tokens: ['W'],
    ui: {
        title: 'Wormhole NTT UI',
        defaultInputs: {
            fromChain: 'Solana',
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
        ...nttRoutes({
            tokens: {
                W: [
                    {
                        chain: 'Solana',
                        manager: 'NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK',
                        token: '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ',
                        transceiver: [
                            {
                                address:
                                    'NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK',
                                type: 'wormhole',
                            },
                        ],
                        quoter: 'Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ',
                    },
                    {
                        chain: 'Ethereum',
                        manager: '0xc072B1AEf336eDde59A049699Ef4e8Fa9D594A48',
                        token: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
                        transceiver: [
                            {
                                address:
                                    '0xDb55492d7190D1baE8ACbE03911C4E3E7426870c',
                                type: 'wormhole',
                            },
                        ],
                    },
                    {
                        chain: 'Arbitrum',
                        manager: '0x5333d0AcA64a450Add6FeF76D6D1375F726CB484',
                        token: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
                        transceiver: [
                            {
                                address:
                                    '0xD1a8AB69e00266e8B791a15BC47514153A5045a6',
                                type: 'wormhole',
                            },
                        ],
                    },
                    {
                        chain: 'Optimism',
                        manager: '0x1a4F1a790f23Ffb9772966cB6F36dCd658033e13',
                        token: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
                        transceiver: [
                            {
                                address:
                                    '0x9bD8b7b527CA4e6738cBDaBdF51C22466756073d',
                                type: 'wormhole',
                            },
                        ],
                    },
                    {
                        chain: 'Base',
                        manager: '0x5333d0AcA64a450Add6FeF76D6D1375F726CB484',
                        token: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
                        transceiver: [
                            {
                                address:
                                    '0xD1a8AB69e00266e8B791a15BC47514153A5045a6',
                                type: 'wormhole',
                            },
                        ],
                    },
                ],
            },
        }),
    ],
    tokensConfig: {
        Wsolana: {
            symbol: 'W',
            tokenId: {
                chain: 'Solana',
                address: '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ',
            },
            icon: 'https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954',
            decimals: 6,
        },
        Wethereum: {
            symbol: 'W',
            tokenId: {
                chain: 'Ethereum',
                address: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
            },
            icon: 'https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954',
            decimals: 18,
        },
        Warbitrum: {
            symbol: 'W',
            tokenId: {
                chain: 'Arbitrum',
                address: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
            },
            icon: 'https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954',
            decimals: 18,
        },
        Woptimism: {
            symbol: 'W',
            tokenId: {
                chain: 'Optimism',
                address: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
            },
            icon: 'https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954',
            decimals: 18,
        },
        Wbase: {
            symbol: 'W',
            tokenId: {
                chain: 'Base',
                address: '0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91',
            },
            icon: 'https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954',
            decimals: 18,
        },
    },
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
