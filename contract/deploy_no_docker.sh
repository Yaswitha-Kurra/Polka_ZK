#!/bin/bash

# Deployment script WITHOUT Docker
# This version tries to use cargo-contract directly

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

RPC_URL="wss://paseo-rpc.polkadot.io"
CONTRACT_DIR="org_registry"

echo -e "${GREEN}🚀 Starting contract deployment (no Docker)...${NC}"
echo ""

# Check if seed phrase is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Seed phrase required!${NC}"
    echo ""
    echo "Usage: ./deploy_no_docker.sh 'your seed phrase here'"
    exit 1
fi

SEED_PHRASE="$1"

# Step 1: Check cargo-contract
echo -e "${YELLOW}📦 Step 1: Checking cargo-contract...${NC}"
if ! command -v cargo-contract &> /dev/null; then
    echo -e "${RED}❌ cargo-contract not found!${NC}"
    echo ""
    echo "Installing cargo-contract..."
    cargo install cargo-contract --version 4.0.0 --force
else
    echo -e "${GREEN}✅ cargo-contract found${NC}"
    cargo contract --version
fi

# Step 2: Build contract
echo ""
echo -e "${YELLOW}📦 Step 2: Building contract...${NC}"
cd "$CONTRACT_DIR"

# Try building
if cargo contract build --release 2>&1 | tee /tmp/build.log; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    echo ""
    echo "The cargo-contract tool has a known bug. Try:"
    echo "1. Install different version: cargo install cargo-contract --version 4.0.0 --force"
    echo "2. Or use GitHub Codespaces (see docs/DEPLOY_WITHOUT_DOCKER.md)"
    echo "3. Or install Docker (recommended - see docs/DEPLOY_WITHOUT_DOCKER.md)"
    exit 1
fi

# Check if files exist
if [ ! -f "target/ink/org_registry.contract" ]; then
    echo -e "${RED}❌ Contract file not found!${NC}"
    echo "Build may have failed. Check the error messages above."
    exit 1
fi

echo -e "${GREEN}✅ Build files created!${NC}"
echo ""

# Step 3: Upload code
echo -e "${YELLOW}📤 Step 3: Uploading contract code...${NC}"
echo "This will cost some PASEO tokens..."

UPLOAD_OUTPUT=$(cargo contract upload \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  target/ink/org_registry.contract 2>&1) || {
    echo -e "${RED}❌ Upload failed!${NC}"
    echo "Error:"
    echo "$UPLOAD_OUTPUT"
    exit 1
}

# Extract code hash
CODE_HASH=$(echo "$UPLOAD_OUTPUT" | grep -i "code hash" | grep -oE '0x[0-9a-fA-F]+' | head -1)

if [ -z "$CODE_HASH" ]; then
    CODE_HASH=$(echo "$UPLOAD_OUTPUT" | grep -oE '[0-9a-fA-F]{64}' | head -1)
    if [ ! -z "$CODE_HASH" ]; then
        CODE_HASH="0x$CODE_HASH"
    fi
fi

if [ -z "$CODE_HASH" ]; then
    echo -e "${YELLOW}⚠️  Could not extract code hash automatically.${NC}"
    echo "Upload output:"
    echo "$UPLOAD_OUTPUT"
    echo ""
    read -p "Please enter the code hash manually: " CODE_HASH
fi

echo -e "${GREEN}✅ Code uploaded!${NC}"
echo "Code Hash: $CODE_HASH"
echo ""

# Step 4: Instantiate contract
echo -e "${YELLOW}🔨 Step 4: Instantiating contract...${NC}"

INSTANTIATE_OUTPUT=$(cargo contract instantiate \
  --constructor new \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  --code-hash "$CODE_HASH" \
  --salt 0x00 2>&1) || {
    echo -e "${RED}❌ Instantiation failed!${NC}"
    echo "Error:"
    echo "$INSTANTIATE_OUTPUT"
    exit 1
}

# Extract contract address
CONTRACT_ADDRESS=$(echo "$INSTANTIATE_OUTPUT" | grep -i "contract" | grep -oE '5[0-9A-HJ-NP-Za-km-z]{47}' | head -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
    CONTRACT_ADDRESS=$(echo "$INSTANTIATE_OUTPUT" | grep -oE '5[A-Za-z0-9]{47}' | head -1)
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  Could not extract contract address automatically.${NC}"
    echo "Instantiate output:"
    echo "$INSTANTIATE_OUTPUT"
    echo ""
    read -p "Please enter the contract address manually: " CONTRACT_ADDRESS
fi

echo -e "${GREEN}✅ Contract deployed!${NC}"
echo ""

# Step 5: Update backend .env
echo -e "${YELLOW}⚙️  Step 5: Configuring backend...${NC}"
cd ../../backend

if [ -f ".env" ]; then
    cp .env .env.backup
fi

cat > .env << EOF
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
POLKADOT_WS_URL=$RPC_URL
PORT=3001
EOF

echo -e "${GREEN}✅ Backend configured!${NC}"
echo ""

# Summary
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Contract Address:${NC}"
echo "$CONTRACT_ADDRESS"
echo ""
echo -e "${GREEN}Code Hash:${NC}"
echo "$CODE_HASH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && npm start"
echo "2. Look for: '✅ Connected to Polkadot node'"
echo ""

