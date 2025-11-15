#!/bin/bash

# Contract Deployment Script
# This script automates the deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RPC_URL="wss://paseo-rpc.polkadot.io"
CONTRACT_DIR="org_registry"

echo -e "${GREEN}🚀 Starting contract deployment...${NC}"
echo ""

# Check if seed phrase is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Seed phrase required!${NC}"
    echo ""
    echo "Usage: ./deploy.sh 'your seed phrase here'"
    echo ""
    echo "Example:"
    echo "  ./deploy.sh 'word1 word2 word3 ... word12'"
    echo ""
    echo "⚠️  Security: This script will use your seed phrase to sign transactions."
    echo "   Make sure you're in a secure environment."
    exit 1
fi

SEED_PHRASE="$1"

# Step 1: Build contract
echo -e "${YELLOW}📦 Step 1: Building contract...${NC}"
cd "$CONTRACT_DIR"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

echo "Building with Docker (this may take a few minutes)..."
docker run --rm \
  -v "$PWD":/build \
  -w /build \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release

if [ ! -f "target/ink/org_registry.contract" ]; then
    echo -e "${RED}❌ Build failed! Check the error messages above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 2: Upload code
echo -e "${YELLOW}📤 Step 2: Uploading contract code to Paseo...${NC}"
echo "This will cost some PASEO tokens..."

# Try to extract code hash from upload output
UPLOAD_OUTPUT=$(cargo contract upload \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  target/ink/org_registry.contract 2>&1) || {
    echo -e "${RED}❌ Upload failed!${NC}"
    echo "Error output:"
    echo "$UPLOAD_OUTPUT"
    exit 1
}

# Extract code hash (try different patterns)
CODE_HASH=$(echo "$UPLOAD_OUTPUT" | grep -i "code hash" | grep -oE '0x[0-9a-fA-F]+' | head -1)

if [ -z "$CODE_HASH" ]; then
    # Try alternative extraction
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

# Step 3: Instantiate contract
echo -e "${YELLOW}🔨 Step 3: Instantiating (deploying) contract...${NC}"
echo "This will create the contract instance..."

INSTANTIATE_OUTPUT=$(cargo contract instantiate \
  --constructor new \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  --code-hash "$CODE_HASH" \
  --salt 0x00 2>&1) || {
    echo -e "${RED}❌ Instantiation failed!${NC}"
    echo "Error output:"
    echo "$INSTANTIATE_OUTPUT"
    exit 1
}

# Extract contract address
CONTRACT_ADDRESS=$(echo "$INSTANTIATE_OUTPUT" | grep -i "contract" | grep -oE '5[0-9A-HJ-NP-Za-km-z]{47}' | head -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
    # Try alternative extraction
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

# Step 4: Update backend .env
echo -e "${YELLOW}⚙️  Step 4: Configuring backend...${NC}"
cd ../../backend

# Backup existing .env if it exists
if [ -f ".env" ]; then
    cp .env .env.backup
    echo "Backed up existing .env to .env.backup"
fi

# Create new .env
cat > .env << EOF
# Contract configuration
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
echo ""
echo -e "${GREEN}Backend Configuration:${NC}"
echo "File: backend/.env"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && npm start"
echo "2. Look for: '✅ Connected to Polkadot node'"
echo "3. Test the contract in your frontend"
echo ""
echo -e "${YELLOW}⚠️  Important: Save the contract address above!${NC}"

