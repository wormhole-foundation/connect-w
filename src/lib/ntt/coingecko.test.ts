import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    searchCoinBySymbol,
    getCoinDetails,
    getTokenIcon,
    fetchTokenMetadataBySymbol,
} from './coingecko';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('CoinGecko API Service', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('searchCoinBySymbol', () => {
        it('should find Bitcoin by symbol BTC', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    coins: [
                        {
                            id: 'bitcoin',
                            name: 'Bitcoin',
                            api_symbol: 'btc',
                            symbol: 'BTC',
                            market_cap_rank: 1,
                            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
                            large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                        },
                    ],
                }),
            });

            const result = await searchCoinBySymbol('BTC');

            expect(result).not.toBeNull();
            expect(result?.id).toBe('bitcoin');
            expect(result?.symbol).toBe('BTC');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.coingecko.com/api/v3/search?query=BTC',
                { headers: {} }
            );
        });

        it('should find exact symbol match case-insensitively', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    coins: [
                        {
                            id: 'wrapped-bitcoin',
                            symbol: 'WBTC',
                            name: 'Wrapped Bitcoin',
                        },
                        {
                            id: 'bitcoin',
                            symbol: 'btc',
                            name: 'Bitcoin',
                        },
                    ],
                }),
            });

            const result = await searchCoinBySymbol('btc');

            expect(result?.id).toBe('bitcoin');
        });

        it('should return null when no coins found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ coins: [] }),
            });

            const result = await searchCoinBySymbol('NONEXISTENT');

            expect(result).toBeNull();
        });

        it('should handle API errors gracefully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 429,
            });

            const result = await searchCoinBySymbol('BTC');

            expect(result).toBeNull();
        });

        it('should include API key in headers when provided', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ coins: [] }),
            });

            await searchCoinBySymbol('BTC', 'test-api-key');

            expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
                headers: { 'x-cg-demo-api-key': 'test-api-key' },
            });
        });
    });

    describe('getCoinDetails', () => {
        it('should fetch coin details by ID', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: 'bitcoin',
                    symbol: 'btc',
                    name: 'Bitcoin',
                    image: {
                        large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                    },
                    detail_platforms: {
                        ethereum: {
                            decimal_place: 8,
                            contract_address: '0x...',
                        },
                    },
                }),
            });

            const result = await getCoinDetails('bitcoin');

            expect(result).not.toBeNull();
            expect(result?.id).toBe('bitcoin');
            expect(result?.image?.large).toContain('bitcoin.png');
        });

        it('should return null on API error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            const result = await getCoinDetails('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('getTokenIcon', () => {
        it('should return icon URL from search result', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    coins: [
                        {
                            id: 'bitcoin',
                            symbol: 'BTC',
                            large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
                        },
                    ],
                }),
            });

            const icon = await getTokenIcon('BTC');

            expect(icon).toBe(
                'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
            );
        });

        it('should return empty string when no coin found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ coins: [] }),
            });

            const icon = await getTokenIcon('NONEXISTENT');

            expect(icon).toBe('');
        });
    });

    describe('fetchTokenMetadataBySymbol', () => {
        it('should fetch complete metadata for a token', async () => {
            // Mock search
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    coins: [
                        {
                            id: 'bitcoin',
                            symbol: 'BTC',
                            large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                        },
                    ],
                }),
            });

            // Mock coin details
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: 'bitcoin',
                    symbol: 'btc',
                    detail_platforms: {
                        ethereum: {
                            decimal_place: 8,
                            contract_address: '0x...',
                        },
                    },
                }),
            });

            const metadata = await fetchTokenMetadataBySymbol('BTC', [
                'Ethereum',
                'Solana',
            ]);

            expect(metadata.symbol).toBe('BTC');
            expect(metadata.icon).toContain('bitcoin.png');
            expect(metadata.decimals.Ethereum).toBe(8);
            expect(metadata.decimals.Solana).toBe(6); // Default for Solana
        });

        it('should return defaults when coin not found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ coins: [] }),
            });

            const metadata = await fetchTokenMetadataBySymbol('UNKNOWN', [
                'Ethereum',
            ]);

            expect(metadata.symbol).toBe('UNKNOWN');
            expect(metadata.icon).toBe('');
            expect(metadata.decimals.Ethereum).toBe(18);
        });
    });
});
