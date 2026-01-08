/**
 * Type definitions for NTT deployment configuration files
 */

export interface WormholeTransceiver {
    address: string;
    pauser?: string;
}

export interface Transceivers {
    threshold: number;
    wormhole: WormholeTransceiver;
}

export interface InboundLimits {
    [chain: string]: string;
}

export interface Limits {
    outbound: string;
    inbound: InboundLimits;
}

export interface ChainDeployment {
    version: string;
    mode: 'burning' | 'locking';
    paused: boolean;
    owner?: string;
    manager: string;
    token: string;
    transceivers: Transceivers;
    limits?: Limits;
    pauser?: string;
    quoter?: string; // Solana specific
}

export interface DeploymentConfig {
    network: 'Mainnet' | 'Testnet';
    chains: {
        [chainName: string]: ChainDeployment;
    };
}

/**
 * NTT Route types for Wormhole Connect
 */
export interface NttTransceiver {
    address: string;
    type: 'wormhole';
}

export interface NttChainConfig {
    chain: string;
    manager: string;
    token: string;
    transceiver: NttTransceiver[];
    quoter?: string;
}

export interface NttRoutesConfig {
    tokens: {
        [symbol: string]: NttChainConfig[];
    };
}

/**
 * Token configuration types for Wormhole Connect
 */
export interface TokenId {
    chain: string;
    address: string;
}

export interface TokenConfig {
    symbol: string;
    tokenId: TokenId;
    icon: string;
    decimals: number;
}

export interface TokensConfig {
    [key: string]: TokenConfig;
}

/**
 * CoinGecko API response types
 */
export interface CoinGeckoToken {
    id: string;
    symbol: string;
    name: string;
    image?: {
        large?: string;
        small?: string;
        thumb?: string;
    };
    detail_platforms?: {
        [platform: string]: {
            decimal_place: number;
            contract_address: string;
        };
    };
}

/**
 * Token metadata fetched from various sources
 */
export interface TokenMetadata {
    symbol: string;
    icon: string;
    decimals: {
        [chain: string]: number;
    };
}

/**
 * Parsed deployment result
 */
export interface ParsedDeployment {
    symbol: string;
    network: string;
    chains: string[];
    nttConfig: NttChainConfig[];
    tokensConfig: TokensConfig;
}
