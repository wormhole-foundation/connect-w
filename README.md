# Wormhole NTT Connect

A standalone Wormhole Connect implementation with automatic NTT deployment configuration.

## ✨ Features

-   **Auto-config generation** – Drop `deployment.json` files, get a working bridge
-   **CoinGecko integration** – Token logos and metadata fetched automatically
-   **Password protected** – Simple auth via environment variable
-   **Executor-optimized** – Uses NTT Executor route with manual fallback

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## ⚙️ Configuration

### 1. Add NTT Deployments

Drop your NTT `deployment.json` files into `src/deployments/`:

```
src/deployments/
├── RLUSD.json
└── W-Wormhole.json
```

Config is auto-generated on build via `npm run generate-config`.

### 2. Set Password (Optional)

```bash
# .env
SITE_PASSWORD=your-password
```

Leave empty to disable password protection.

### 3. Build & Run

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── deployments/     # Drop NTT deployment.json files here
├── generated/       # Auto-generated Wormhole Connect config
├── lib/ntt/         # Parser, scanner, CoinGecko integration
└── app/             # Next.js app with login + bridge pages
```

## 🧪 Testing

```bash
npm test          # Playwright E2E tests
npm run test:unit # Vitest unit tests
```

## 📝 Notes

-   Use private RPCs for mainnet to prevent timeouts
-   Executor route requires relayer support on target chains
