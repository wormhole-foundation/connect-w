/**
 * CoinGecko API service for fetching token metadata dynamically
 * No hardcoded mappings - searches by symbol
 */

export interface CoinGeckoSearchResult {
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    large: string;
}

export interface CoinGeckoSearchResponse {
    coins: CoinGeckoSearchResult[];
}

export interface CoinGeckoCoinDetail {
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

// Chain name to CoinGecko platform mapping
const CHAIN_TO_PLATFORM: Record<string, string> = {
    Ethereum: 'ethereum',
    Base: 'base',
    Optimism: 'optimistic-ethereum',
    Arbitrum: 'arbitrum-one',
    Solana: 'solana',
    Unichain: 'unichain',
    Ink: 'ink',
    Polygon: 'polygon-pos',
    Avalanche: 'avalanche',
    Bsc: 'binance-smart-chain',
};

// Default decimals when API doesn't provide them
const DEFAULT_CHAIN_DECIMALS: Record<string, number> = {
    Solana: 6,
    Ethereum: 18,
    Base: 18,
    Optimism: 18,
    Arbitrum: 18,
    Unichain: 18,
    Ink: 18,
    Polygon: 18,
    Avalanche: 18,
    Bsc: 18,
};

/**
 * Search CoinGecko for a token by symbol
 * Returns the best matching coin ID, prioritizing exact matches and market cap
 */
export async function searchCoinBySymbol(
    symbol: string,
    apiKey?: string
): Promise<CoinGeckoSearchResult | null> {
    try {
        const headers: HeadersInit = apiKey
            ? { 'x-cg-demo-api-key': apiKey }
            : {};

        const response = await fetch(
            `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
                symbol
            )}`,
            { headers }
        );

        if (!response.ok) {
            console.warn(`CoinGecko search API error: ${response.status}`);
            return null;
        }

        const data: CoinGeckoSearchResponse = await response.json();

        if (!data.coins || data.coins.length === 0) {
            console.warn(`No coins found for symbol: ${symbol}`);
            return null;
        }

        // Find all exact symbol matches (case-insensitive)
        const exactMatches = data.coins.filter(
            (coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
        );

        if (exactMatches.length > 0) {
            // Sort by market cap rank (lower is better, null goes to end)
            const sortedMatches = exactMatches.sort((a, b) => {
                if (a.market_cap_rank === null && b.market_cap_rank === null)
                    return 0;
                if (a.market_cap_rank === null) return 1;
                if (b.market_cap_rank === null) return -1;
                return a.market_cap_rank - b.market_cap_rank;
            });
            return sortedMatches[0];
        }

        // Fall back to first result if no exact match
        console.warn(
            `No exact match for ${symbol}, using first result: ${data.coins[0].id}`
        );
        return data.coins[0];
    } catch (error) {
        console.error(`Error searching CoinGecko for ${symbol}:`, error);
        return null;
    }
}

/**
 * Get detailed coin information by ID
 */
export async function getCoinDetails(
    coinId: string,
    apiKey?: string
): Promise<CoinGeckoCoinDetail | null> {
    try {
        const headers: HeadersInit = apiKey
            ? { 'x-cg-demo-api-key': apiKey }
            : {};

        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
            { headers }
        );

        if (!response.ok) {
            console.warn(`CoinGecko coin API error: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching CoinGecko details for ${coinId}:`, error);
        return null;
    }
}

/**
 * Get token icon URL by searching for symbol
 */
export async function getTokenIcon(
    symbol: string,
    apiKey?: string
): Promise<string> {
    const searchResult = await searchCoinBySymbol(symbol, apiKey);

    if (searchResult) {
        // Use large image from search result directly
        return searchResult.large || searchResult.thumb || '';
    }

    return '';
}

/**
 * Get token decimals for specific chains
 */
export async function getTokenDecimals(
    symbol: string,
    chains: string[],
    apiKey?: string
): Promise<Record<string, number>> {
    const decimals: Record<string, number> = {};

    // Start with defaults
    for (const chain of chains) {
        decimals[chain] = DEFAULT_CHAIN_DECIMALS[chain] || 18;
    }

    // Try to get from CoinGecko
    const searchResult = await searchCoinBySymbol(symbol, apiKey);
    if (!searchResult) {
        return decimals;
    }

    const coinDetails = await getCoinDetails(searchResult.id, apiKey);
    if (!coinDetails?.detail_platforms) {
        return decimals;
    }

    // Extract decimals from detail_platforms
    for (const chain of chains) {
        const platformId = CHAIN_TO_PLATFORM[chain];
        if (platformId && coinDetails.detail_platforms[platformId]) {
            const platformData = coinDetails.detail_platforms[platformId];
            if (platformData.decimal_place !== undefined) {
                decimals[chain] = platformData.decimal_place;
            }
        }
    }

    return decimals;
}

/**
 * Fetch complete token metadata by symbol (icon + decimals)
 */
export async function fetchTokenMetadataBySymbol(
    symbol: string,
    chains: string[],
    apiKey?: string
): Promise<{
    symbol: string;
    icon: string;
    decimals: Record<string, number>;
}> {
    const searchResult = await searchCoinBySymbol(symbol, apiKey);

    if (!searchResult) {
        // Return defaults
        const decimals: Record<string, number> = {};
        for (const chain of chains) {
            decimals[chain] = DEFAULT_CHAIN_DECIMALS[chain] || 18;
        }
        return { symbol, icon: '', decimals };
    }

    // Get icon from search result
    const icon = searchResult.large || searchResult.thumb || '';

    // Get decimals from coin details
    const decimals: Record<string, number> = {};
    for (const chain of chains) {
        decimals[chain] = DEFAULT_CHAIN_DECIMALS[chain] || 18;
    }

    const coinDetails = await getCoinDetails(searchResult.id, apiKey);
    if (coinDetails?.detail_platforms) {
        for (const chain of chains) {
            const platformId = CHAIN_TO_PLATFORM[chain];
            if (platformId && coinDetails.detail_platforms[platformId]) {
                const platformData = coinDetails.detail_platforms[platformId];
                if (platformData.decimal_place !== undefined) {
                    decimals[chain] = platformData.decimal_place;
                }
            }
        }
    }

    return { symbol, icon, decimals };
}

export { CHAIN_TO_PLATFORM, DEFAULT_CHAIN_DECIMALS };
