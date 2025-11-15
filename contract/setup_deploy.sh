#!/bin/bash

# Setup script for contract deployment
# This script helps set up the environment for deploying to Paseo testnet

set -e

echo "🔧 Setting up contract deployment environment..."
echo ""

# Check Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
else
    echo "✅ Rust installed: $(rustc --version)"
fi

# Check cargo-contract
if ! command -v cargo-contract &> /dev/null; then
    echo "📦 Installing cargo-contract..."
    cargo install cargo-contract --force
    echo "✅ cargo-contract installed"
else
    echo "✅ cargo-contract installed: $(cargo contract --version)"
fi

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "❌ Error: Cargo.toml not found. Run this script from contract/org_registry directory"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get Paseo testnet tokens (see docs/DEPLOY_CONTRACT.md)"
echo "2. Build the contract: cargo contract build --release"
echo "3. Deploy using Polkadot.js Apps (see docs/DEPLOY_CONTRACT.md)"
echo ""

