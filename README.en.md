# SyntheKaia Frontend: LINE Mini DApp

This repository contains the source code for the SyntheKaia frontend, a Next.js application designed to run as a LINE Mini DApp. It provides a user-friendly interface for interacting with the SyntheKaia delta-neutral vault on the Kaia network.

## About SyntheKaia

SyntheKaia is a decentralized finance (DeFi) vault on the Kaia network that implements a delta-neutral investment strategy. It accepts USDT deposits and automatically executes a dual-strategy approach to generate stable yield while maintaining market neutrality through strategic hedging.

### Core Strategy
- **Liquid Staking (50%)**: Half of the deposited USDT is swapped to **stKAIA** to generate staking rewards.
- **Perpetual Short Position (50%)**: The other half is used as margin for a 2x leveraged short position on **KAIA**, hedging against price volatility.

This allows users, especially mainstream users via the LINE app, to access stable DeFi yields as if they were using a simple savings account.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **LINE Integration**: [LIFF (LINE Front-end Framework)](https://developers.line.biz/en/docs/liff/)
- **Styling**: [CSS Modules](https://github.com/css-modules/css-modules)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Deployment**: [Vercel](https://vercel.com/)

## Features

- **Seamless LINE Integration**: Authenticate and interact with the service directly within the LINE app.
- **Wallet Connection**: Connect to Kaia ecosystem wallets.
- **USDT Deposit**: Easily deposit USDT into the SyntheKaia vault.
- **Portfolio Management**: View your vault balance, share tokens, and performance metrics.
- **Faucet**: A developer-focused faucet to get testnet USDT for trial purposes.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en) (version specified in `.nvmrc`)
- [pnpm](https://pnpm.io/installation)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Jeongseup/2025-kaia-hackathon-synthekaia-frontend.git
    cd 2025-kaia-hackathon-synthekaia-frontend
    ```

2.  Install the dependencies:
    ```bash
    pnpm install
    ```

### Configuration

Create a `.env.local` file in the project root and add the necessary environment variables. You can copy the example below.

```dotenv
# .env.local

# LIFF ID for your LINE Mini DApp
NEXT_PUBLIC_LIFF_ID="YOUR_LIFF_ID"

# Kaia Network Configuration
NEXT_PUBLIC_KAIYA_RPC_URL="https://your-kaia-rpc-provider.com"
NEXT_PUBLIC_MOCK_USDT_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS="0x..."

```

### Running the Development Server

Once the dependencies are installed and the configuration is set, you can run the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`. To test the full LIFF integration, you will need to run it within the LINE app or use the LIFF browser simulator.

## Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/). Simply connect your Vercel account to your Git repository and Vercel will automatically build and deploy the application.

The `vercel.json` file contains the necessary configuration for serverless functions and routing.

## Project Structure

```
.
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # Backend API routes for faucet, payment, etc.
│   │   └── page.tsx        # Main application entry point
│   ├── components/         # Reusable React components
│   │   ├── MainApp/        # Core application UI (Tabs, Header)
│   │   ├── SignIn/         # Sign-in page component
│   │   └── Wallet/         # Wallet connection and management components
│   ├── constants/          # ABI definitions for smart contracts
│   └── utils/              # Utility functions (LIFF SDK, formatting)
├── public/                 # Static assets (images, logos)
├── next.config.ts          # Next.js configuration
├── vercel.json             # Vercel deployment configuration
└── package.json            # Project dependencies and scripts
```
