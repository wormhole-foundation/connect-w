import { describe, it, expect } from 'vitest';
import { parseDeploymentFilename } from './scanner';

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
                '/path/to/deployments/W-Wormhole.json'
            );
            expect(result.symbol).toBe('W');
            expect(result.tokenName).toBe('Wormhole');
        });

        it('should handle simple symbol with path', () => {
            const result = parseDeploymentFilename(
                '/path/to/deployments/USDC.json'
            );
            expect(result.symbol).toBe('USDC');
            expect(result.tokenName).toBeUndefined();
        });
    });
});
