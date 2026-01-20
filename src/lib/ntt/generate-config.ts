/**
 * Build script to generate NTT configuration from deployment files
 * Run this at build time to generate the config
 */

import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import {
    scanDeploymentsDirectory,
    generateConfigFromDeployments,
} from './scanner';
import { buildConfig } from '../config';

async function main() {
    const projectRoot = path.resolve(__dirname, '../../..');
    const deploymentsDir = path.join(projectRoot, 'src/deployments');
    const outputDir = path.join(projectRoot, 'src/generated');

    console.log('🔍 Scanning deployments directory...');
    const deployments = scanDeploymentsDirectory(deploymentsDir);

    if (deployments.length === 0) {
        console.error('❌ No deployment files found!');
        process.exit(1);
    }

    console.log(`📦 Found ${deployments.length} deployment(s)`);

    // Count mainnet and testnet deployments
    const mainnetCount = deployments.filter(
        (d) => d.config.network === 'Mainnet',
    ).length;
    const testnetCount = deployments.filter(
        (d) => d.config.network === 'Testnet',
    ).length;
    console.log(`   - Mainnet: ${mainnetCount}`);
    console.log(`   - Testnet: ${testnetCount}`);

    if (!buildConfig.coingeckoApiKey) {
        console.warn(
            '⚠️  No COINGECKO_API_KEY found, API calls may be rate limited',
        );
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate Mainnet config
    if (mainnetCount > 0) {
        console.log('\n🌐 Generating Mainnet configuration...');
        const mainnetConfig = await generateConfigFromDeployments(
            deployments,
            buildConfig.coingeckoApiKey,
            'Mainnet',
        );

        const mainnetPath = path.join(outputDir, 'wormhole-config.json');
        fs.writeFileSync(mainnetPath, JSON.stringify(mainnetConfig, null, 2));
        console.log(`✅ Mainnet config written to ${mainnetPath}`);
        console.log('   📊 Summary:');
        console.log(`      Tokens: ${mainnetConfig.tokens.join(', ')}`);
        console.log(`      Chains: ${mainnetConfig.chains.join(', ')}`);
    }

    // Generate Testnet config
    if (testnetCount > 0) {
        console.log('\n🧪 Generating Testnet configuration...');
        const testnetConfig = await generateConfigFromDeployments(
            deployments,
            buildConfig.coingeckoApiKey,
            'Testnet',
        );

        const testnetPath = path.join(
            outputDir,
            'wormhole-config-testnet.json',
        );
        fs.writeFileSync(testnetPath, JSON.stringify(testnetConfig, null, 2));
        console.log(`✅ Testnet config written to ${testnetPath}`);
        console.log('   📊 Summary:');
        console.log(`      Tokens: ${testnetConfig.tokens.join(', ')}`);
        console.log(`      Chains: ${testnetConfig.chains.join(', ')}`);
    }

    console.log('\n✨ All configurations generated successfully!');
}

main().catch((error) => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
