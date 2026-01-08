/**
 * Deployment scanner - reads all JSON files from deployments directory
 * and parses them into NTT configuration
 *
 * File naming convention: SYMBOL.json or SYMBOL-TOKENNAME.json
 * Examples: RLUSD.json, W-Wormhole.json
 *
 * When TOKENNAME is provided, it will be used for CoinGecko searches
 * instead of the symbol (useful for short symbols like "W")
 */

import * as fs from 'fs';
import * as path from 'path';
import type { DeploymentConfig, NttChainConfig, TokensConfig } from './types';
import { fetchTokenMetadataBySymbol } from './coingecko';

export interface ScannedDeployment {
    symbol: string;
    tokenName?: string; // Optional token name for CoinGecko search
    config: DeploymentConfig;
    filePath: string;
}

export interface GeneratedConfig {
    network: string;
    chains: string[];
    tokens: string[];
    nttRoutesConfig: {
        tokens: Record<string, NttChainConfig[]>;
    };
    tokensConfig: TokensConfig;
}

/**
 * Parse filename to extract symbol and optional token name
 * Format: SYMBOL.json or SYMBOL-TOKENNAME.json
 */
export function parseDeploymentFilename(filename: string): {
    symbol: string;
    tokenName?: string;
} {
    const basename = path.basename(filename, '.json');

    // Check for SYMBOL-TOKENNAME format
    const dashIndex = basename.indexOf('-');
    if (dashIndex > 0) {
        return {
            symbol: basename.substring(0, dashIndex),
            tokenName: basename.substring(dashIndex + 1),
        };
    }

    // Simple SYMBOL format
    return { symbol: basename };
}

/**
 * Scan deployments directory and load all JSON files
 */
export function scanDeploymentsDirectory(
    deploymentsDir: string
): ScannedDeployment[] {
    const deployments: ScannedDeployment[] = [];

    if (!fs.existsSync(deploymentsDir)) {
        console.warn(`Deployments directory not found: ${deploymentsDir}`);
        return deployments;
    }

    const files = fs.readdirSync(deploymentsDir);

    for (const file of files) {
        if (!file.endsWith('.json')) {
            continue;
        }

        const filePath = path.join(deploymentsDir, file);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const config: DeploymentConfig = JSON.parse(content);

            // Parse filename for symbol and optional token name
            const { symbol, tokenName } = parseDeploymentFilename(file);

            deployments.push({
                symbol,
                tokenName,
                config,
                filePath,
            });

            const displayName = tokenName ? `${symbol} (${tokenName})` : symbol;
            console.log(`Loaded deployment: ${displayName} from ${file}`);
        } catch (error) {
            console.error(`Error loading deployment file ${file}:`, error);
        }
    }

    return deployments;
}

/**
 * Parse a single deployment config into NTT chain configs
 */
export function parseDeploymentToNttConfig(
    config: DeploymentConfig
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
 * Build tokens config for a single token
 */
export function buildTokensConfigForToken(
    symbol: string,
    nttConfigs: NttChainConfig[],
    icon: string,
    decimals: Record<string, number>
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
            icon,
            decimals: decimals[config.chain] || 18,
        };
    }

    return tokensConfig;
}

/**
 * Generate complete configuration from scanned deployments
 * Fetches metadata from CoinGecko dynamically
 * Uses tokenName for search if provided (useful for short symbols)
 */
export async function generateConfigFromDeployments(
    deployments: ScannedDeployment[],
    apiKey?: string
): Promise<GeneratedConfig> {
    const allChains = new Set<string>();
    const allTokens: string[] = [];
    const nttTokens: Record<string, NttChainConfig[]> = {};
    const tokensConfig: TokensConfig = {};
    let network = 'Mainnet';

    for (const { symbol, tokenName, config } of deployments) {
        network = config.network;

        // Get chains for this deployment
        const chains = Object.keys(config.chains);
        chains.forEach((chain) => allChains.add(chain));
        allTokens.push(symbol);

        // Parse NTT config
        const nttConfig = parseDeploymentToNttConfig(config);
        nttTokens[symbol] = nttConfig;

        // Use tokenName for search if provided, otherwise use symbol
        const searchTerm = tokenName || symbol;
        console.log(
            `Fetching metadata for ${symbol} (searching: ${searchTerm})...`
        );
        const metadata = await fetchTokenMetadataBySymbol(
            searchTerm,
            chains,
            apiKey
        );

        // Build tokens config
        const tokenConfig = buildTokensConfigForToken(
            symbol,
            nttConfig,
            metadata.icon,
            metadata.decimals
        );
        Object.assign(tokensConfig, tokenConfig);
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
 * Extract all unique chains from deployment configs
 */
export function extractChainsFromDeployments(
    deployments: ScannedDeployment[]
): string[] {
    const chains = new Set<string>();

    for (const { config } of deployments) {
        for (const chainName of Object.keys(config.chains)) {
            chains.add(chainName);
        }
    }

    return Array.from(chains);
}
