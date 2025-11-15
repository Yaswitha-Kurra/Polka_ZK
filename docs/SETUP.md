# Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Rust** - [Install Rust](https://www.rust-lang.org/tools/install)
3. **cargo-contract** - Install with: `cargo install cargo-contract --force`
4. **Circom** - Install with: `npm install -g circom`
5. **Polkadot Node** - Run a local node or connect to a testnet

## Setup Steps

### 1. ZK Circuits Setup

```bash
cd zk
npm install

# Compile circuit
npm run compile

# Generate proving and verification keys
npm run setup

# Generate sample Merkle tree
npm run generate-merkle org1

# Test proof generation
npm run test-proof
```

### 2. Smart Contract Setup

```bash
cd contract/org_registry

# Build contract
cargo contract build

# Deploy contract (after starting local node)
cargo contract instantiate --constructor new --suri //Alice --skip-confirm

# Note the contract address and set it in backend/.env
```

### 3. Backend Setup

```bash
cd backend
npm install

# Copy .env.example to .env and configure
cp .env.example .env

# Edit .env with your contract address
# CONTRACT_ADDRESS=your_contract_address_here

# Start backend
npm start
```

### 4. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

## Running the Application

1. Start your Polkadot node (local or connect to testnet)
2. Start the backend: `cd backend && npm start`
3. Start the frontend: `cd frontend && npm run dev`
4. Open browser to `http://localhost:5173`
5. Install Polkadot.js extension and create/import an account
6. Connect wallet and follow the workflow

## Testing

### Test ZK Proof Generation

```bash
cd zk
npm run test-proof
```

### Test Contract Events

```bash
cd zk
node scripts/testContract.js
```

## Troubleshooting

### Circuit Compilation Issues

- Ensure Circom is installed: `circom --version`
- Check that circomlib is installed: `npm install` in zk directory

### Contract Deployment Issues

- Ensure cargo-contract is installed: `cargo contract --version`
- Check Rust version: `rustc --version` (should be 1.70+)
- Ensure local node is running: `polkadot --dev`

### Backend Connection Issues

- Check POLKADOT_WS_URL in backend/.env
- Ensure contract address is set correctly
- Check that contract is deployed and address is correct

### Frontend Wallet Issues

- Ensure Polkadot.js extension is installed
- Check that extension is enabled for the site
- Try refreshing the page after connecting wallet

