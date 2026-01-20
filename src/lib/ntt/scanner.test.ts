import { describe, it, expect } from 'vitest';
import {
    parseDeploymentFilename,
    generateConfigFromDeployments,
    type ScannedDeployment,
} from './scanner';
import type { DeploymentConfig } from './types';

describe('Deployment Scanner', () => {
    describe('parseDeploymentFilename', () => {
        it('should parse simple SYMBOL.json format', () => {
            const result = parseDeploymentFilename('RLUSD.json');
            expect(result.symbol).toBe('RLUSD');
            expect(result.tokenName).toBeUndefined();
        });

        it('should parse SYMBOL-TOKENNAME.json format', () => {
            const result = parseDeploymentFilename('W-Wormhole.json');
            expect(result.symbol).toBe('W');
            expect(result.tokenName).toBe('Wormhole');
        });

        it('should handle multiple dashes in token name', () => {
            const result = parseDeploymentFilename('ABC-Some-Long-Name.json');
            expect(result.symbol).toBe('ABC');
            expect(result.tokenName).toBe('Some-Long-Name');
        });

        it('should handle path with directory', () => {
            const result = parseDeploymentFilename(
                '/path/to/deployments/W-Wormhole.json',
            );
            expect(result.symbol).toBe('W');
            expect(result.tokenName).toBe('Wormhole');
        });

        it('should handle simple symbol with path', () => {
            const result = parseDeploymentFilename(
                '/path/to/deployments/USDC.json',
            );
            expect(result.symbol).toBe('USDC');
            expect(result.tokenName).toBeUndefined();
        });
    });

    describe('generateConfigFromDeployments', () => {
        const mockMainnetDeployment: ScannedDeployment = {
            symbol: 'MAIN',
            config: {
                network: 'Mainnet',
                chains: {
                    Ethereum: {
                        version: '1.0.0',
                        mode: 'burning',
                        paused: false,
                        manager: '0x123',
                        token: '0x456',
                        transceivers: {
                            threshold: 1,
                            wormhole: { address: '0x789' },
                        },
                    },
                },
            } as DeploymentConfig,
            filePath: '/test/MAIN.json',
        };

        const mockTestnetDeployment: ScannedDeployment = {
            symbol: 'TEST',
            config: {
                network: 'Testnet',
                chains: {
                    Sepolia: {
                        version: '1.0.0',
                        mode: 'burning',
                        paused: false,
                        manager: '0xabc',
                        token: '0xdef',
                        transceivers: {
                            threshold: 1,
                            wormhole: { address: '0xghi' },
                        },
                    },
                },
            } as DeploymentConfig,
            filePath: '/test/TEST.json',
        };

        it('should filter mainnet deployments correctly', async () => {
            const deployments = [mockMainnetDeployment, mockTestnetDeployment];
            const config = await generateConfigFromDeployments(
                deployments,
                undefined,
                'Mainnet',
            );

            expect(config.network).toBe('Mainnet');
            expect(config.tokens).toEqual(['MAIN']);
            expect(config.tokens).not.toContain('TEST');
        });

        it('should filter testnet deployments correctly', async () => {
            const deployments = [mockMainnetDeployment, mockTestnetDeployment];
            const config = await generateConfigFromDeployments(
                deployments,
                undefined,
                'Testnet',
            );

            expect(config.network).toBe('Testnet');
            expect(config.tokens).toEqual(['TEST']);
            expect(config.tokens).not.toContain('MAIN');
        });

        it('should return empty config when no matching network deployments found', async () => {
            const deployments = [mockMainnetDeployment];
            const config = await generateConfigFromDeployments(
                deployments,
                undefined,
                'Testnet',
            );

            expect(config.network).toBe('Testnet');
            expect(config.tokens).toEqual([]);
            expect(config.chains).toEqual([]);
        });
    });
});
