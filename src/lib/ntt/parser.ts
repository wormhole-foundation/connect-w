import type {
    DeploymentConfig,
    NttChainConfig,
    TokensConfig,
    TokenMetadata,
    ParsedDeployment,
} from './types';
import {
    fetchTokenMetadataBySymbol,
    DEFAULT_CHAIN_DECIMALS,
} from './coingecko';

/**
 * Parse a single deployment configuration file
 */
export function parseDeploymentConfig(
    config: DeploymentConfig,
    symbol: string
): NttChainConfig[] {
    const nttConfigs: NttChainConfig[] = [];

    for (const [chainName, chainConfig] of Object.entries(config.chains)) {
        const nttConfig: NttChainConfig = {
            chain: chainName,
            manager: chainConfig.manager,
            token: chainConfig.token,
            transceiver: [
                {
                    address: chainConfig.transceivers.wormhole.address,
                    type: 'wormhole',
                },
            ],
        };

        // Add quoter if present (Solana specific)
        if (chainConfig.quoter) {
            nttConfig.quoter = chainConfig.quoter;
        }

        nttConfigs.push(nttConfig);
    }

    return nttConfigs;
}

/**
 * Build tokens config for Wormhole Connect
 */
export function buildTokensConfig(
    symbol: string,
    nttConfigs: NttChainConfig[],
    metadata: TokenMetadata
): TokensConfig {
    const tokensConfig: TokensConfig = {};

    for (const config of nttConfigs) {
        const key = `${symbol}${config.chain.toLowerCase()}`;
        tokensConfig[key] = {
            symbol,
            tokenId: {
                chain: config.chain,
                address: config.token,
            },
            icon: metadata.icon,
            decimals:
                metadata.decimals[config.chain] ||
                DEFAULT_CHAIN_DECIMALS[config.chain] ||
                18,
        };
    }

    return tokensConfig;
}

/**
 * Fetch token metadata from CoinGecko API dynamically by symbol
 * No hardcoded mappings needed
 */
export async function fetchTokenMetadata(
    symbol: string,
    chains: string[],
    apiKey?: string
): Promise<TokenMetadata> {
    return fetchTokenMetadataBySymbol(symbol, chains, apiKey);
}

/**
 * Parse a deployment file and return full configuration
 */
export async function parseDeployment(
    config: DeploymentConfig,
    symbol: string,
    apiKey?: string
): Promise<ParsedDeployment> {
    // Parse NTT configuration
    const nttConfig = parseDeploymentConfig(config, symbol);

    // Get chains from config
    const chains = Object.keys(config.chains);

    // Fetch token metadata dynamically
    const metadata = await fetchTokenMetadata(symbol, chains, apiKey);

    // Build tokens config
    const tokensConfig = buildTokensConfig(symbol, nttConfig, metadata);

    return {
        symbol,
        network: config.network,
        chains,
        nttConfig,
        tokensConfig,
    };
}

/**
 * Parse multiple deployment configs and merge them
 */
export async function parseAllDeployments(
    deployments: { config: DeploymentConfig; symbol: string }[],
    apiKey?: string
): Promise<{
    network: string;
    chains: string[];
    tokens: string[];
    nttRoutesConfig: { tokens: Record<string, NttChainConfig[]> };
    tokensConfig: TokensConfig;
}> {
    const allChains = new Set<string>();
    const allTokens: string[] = [];
    const nttTokens: Record<string, NttChainConfig[]> = {};
    const tokensConfig: TokensConfig = {};
    let network = 'Mainnet';

    for (const { config, symbol } of deployments) {
        const chains = Object.keys(config.chains);
        const parsed = await parseDeployment(config, symbol, apiKey);

        network = parsed.network;
        parsed.chains.forEach((chain) => allChains.add(chain));
        allTokens.push(symbol);

        nttTokens[symbol] = parsed.nttConfig;
        Object.assign(tokensConfig, parsed.tokensConfig);
    }

    return {
        network,
        chains: Array.from(allChains),
        tokens: allTokens,
        nttRoutesConfig: { tokens: nttTokens },
        tokensConfig,
    };
}

/**
 * Extract chain list from deployment configs
 */
export function extractChains(configs: DeploymentConfig[]): string[] {
    const chains = new Set<string>();

    for (const config of configs) {
        for (const chainName of Object.keys(config.chains)) {
            chains.add(chainName);
        }
    }

    return Array.from(chains);
}
