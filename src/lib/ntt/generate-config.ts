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
    const outputPath = path.join(
        projectRoot,
        'src/generated/wormhole-config.json'
    );

    console.log('🔍 Scanning deployments directory...');
    const deployments = scanDeploymentsDirectory(deploymentsDir);

    if (deployments.length === 0) {
        console.error('❌ No deployment files found!');
        process.exit(1);
    }

    console.log(`📦 Found ${deployments.length} deployment(s)`);

    if (!buildConfig.coingeckoApiKey) {
        console.warn(
            '⚠️  No COINGECKO_API_KEY found, API calls may be rate limited'
        );
    }

    console.log('🌐 Fetching token metadata from CoinGecko...');
    const generatedConfig = await generateConfigFromDeployments(
        deployments,
        buildConfig.coingeckoApiKey
    );

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write generated config
    fs.writeFileSync(outputPath, JSON.stringify(generatedConfig, null, 2));
    console.log(`✅ Generated config written to ${outputPath}`);

    // Log summary
    console.log('\n📊 Summary:');
    console.log(`   Network: ${generatedConfig.network}`);
    console.log(`   Tokens: ${generatedConfig.tokens.join(', ')}`);
    console.log(`   Chains: ${generatedConfig.chains.join(', ')}`);
}

main().catch((error) => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
