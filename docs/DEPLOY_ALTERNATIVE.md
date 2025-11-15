# Alternative Contract Deployment Methods

If you're having trouble with Polkadot.js Apps interface, here are alternative ways to deploy your contract.

## Method 1: Using cargo-contract CLI (Easiest Alternative)

This method uses command line directly - no need to navigate websites!

### Prerequisites

1. **Install subxt-cli** (for interacting with Polkadot):
   ```bash
   cargo install subxt-cli
   ```

2. **Get your account seed phrase:**
   - Open Polkadot.js extension
   - Click on your account
   - Click "..." menu → "Export account"
   - Enter password
   - Copy the seed phrase (12 or 24 words)
   - **Keep this secret!**

3. **Make sure you have Paseo tokens** in your account

### Step 1: Build Contract (Using Docker)

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry

# Build using Docker
docker run --rm \
  -v "$PWD":/build \
  -w /build \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release
```

Wait for build to complete. You should see files in `target/ink/`:
- `org_registry.wasm`
- `org_registry.json` or `metadata.json`

### Step 2: Upload Contract Code

```bash
# Upload the WASM code to Paseo
cargo contract upload \
  --suri "YOUR_SEED_PHRASE_HERE" \
  --url wss://paseo-rpc.polkadot.io \
  target/ink/org_registry.contract
```

**Replace `YOUR_SEED_PHRASE_HERE`** with your 12 or 24 word seed phrase.

**Example:**
```bash
cargo contract upload \
  --suri "word1 word2 word3 ... word12" \
  --url wss://paseo-rpc.polkadot.io \
  target/ink/org_registry.contract
```

This will:
- Upload the contract code
- Show you a code hash
- **Save this code hash!** You'll need it for instantiation

### Step 3: Instantiate (Deploy) Contract

```bash
# Instantiate the contract
cargo contract instantiate \
  --constructor new \
  --suri "YOUR_SEED_PHRASE_HERE" \
  --url wss://paseo-rpc.polkadot.io \
  --code-hash CODE_HASH_FROM_STEP_2 \
  --salt 0x00
```

**Replace:**
- `YOUR_SEED_PHRASE_HERE` with your seed phrase
- `CODE_HASH_FROM_STEP_2` with the hash from upload step

**Example:**
```bash
cargo contract instantiate \
  --constructor new \
  --suri "word1 word2 word3 ... word12" \
  --url wss://paseo-rpc.polkadot.io \
  --code-hash 0x1234567890abcdef... \
  --salt 0x00
```

This will:
- Deploy your contract
- Show you the **contract address** (starts with `5`)
- **Copy this address!** You need it for backend config

### Step 4: Configure Backend

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/backend

# Create .env file
cat > .env << EOF
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
EOF
```

Replace `YOUR_CONTRACT_ADDRESS_HERE` with the address from Step 3.

Then restart backend:
```bash
npm start
```

---

## Method 2: Using Polkadot.js CLI Tools

### Install Polkadot.js CLI

```bash
npm install -g @polkadot/api-cli
```

### Upload Contract

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry

# Upload WASM
polkadot-js-api \
  --ws wss://paseo-rpc.polkadot.io \
  tx.contracts.uploadCode \
  --seed "YOUR_SEED_PHRASE" \
  target/ink/org_registry.wasm
```

### Instantiate Contract

```bash
# Get code hash from upload, then instantiate
polkadot-js-api \
  --ws wss://paseo-rpc.polkadot.io \
  tx.contracts.instantiate \
  --seed "YOUR_SEED_PHRASE" \
  --constructor new \
  --codeHash CODE_HASH \
  --endowment 0 \
  --gasLimit 1000000000000
```

---

## Method 3: Using a Deployment Script

Create a simple deployment script:

### Create Script File

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract
```

Create file `deploy.sh`:

```bash
#!/bin/bash

# Configuration
SEED_PHRASE="YOUR_SEED_PHRASE_HERE"
RPC_URL="wss://paseo-rpc.polkadot.io"
CONTRACT_DIR="org_registry"

echo "🚀 Starting contract deployment..."

# Step 1: Build contract
echo "📦 Building contract..."
cd $CONTRACT_DIR
docker run --rm \
  -v "$PWD":/build \
  -w /build \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release

if [ ! -f "target/ink/org_registry.contract" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Upload code
echo "📤 Uploading contract code..."
CODE_HASH=$(cargo contract upload \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  target/ink/org_registry.contract 2>&1 | grep -oP 'Code hash: \K[0-9a-fx]+')

if [ -z "$CODE_HASH" ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Code uploaded! Hash: $CODE_HASH"

# Step 3: Instantiate
echo "🔨 Instantiating contract..."
CONTRACT_ADDRESS=$(cargo contract instantiate \
  --constructor new \
  --suri "$SEED_PHRASE" \
  --url "$RPC_URL" \
  --code-hash "$CODE_HASH" \
  --salt 0x00 2>&1 | grep -oP 'Contract address: \K[0-9a-zA-Z]+')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Instantiation failed!"
    exit 1
fi

echo "✅ Contract deployed!"
echo "📍 Contract Address: $CONTRACT_ADDRESS"

# Step 4: Update backend .env
echo "⚙️  Updating backend configuration..."
cd ../../backend
cat > .env << EOF
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
POLKADOT_WS_URL=$RPC_URL
PORT=3001
EOF

echo "✅ Backend configured!"
echo ""
echo "🎉 Deployment complete!"
echo "Contract Address: $CONTRACT_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && npm start"
echo "2. Verify connection in backend logs"
```

### Make Script Executable

```bash
chmod +x deploy.sh
```

### Edit Script with Your Seed Phrase

```bash
nano deploy.sh
```

Find the line:
```bash
SEED_PHRASE="YOUR_SEED_PHRASE_HERE"
```

Replace `YOUR_SEED_PHRASE_HERE` with your actual seed phrase (12 or 24 words).

### Run Script

```bash
./deploy.sh
```

The script will:
1. Build the contract
2. Upload it
3. Deploy it
4. Configure backend automatically

---

## Method 4: Using Polkadot.js Apps (Simplified Navigation)

If you want to try the website again, here's exactly where to click:

### Step 1: Open Website
- Go to: **https://polkadot.js.org/apps/**
- Wait for page to load

### Step 2: Switch Network
- Look at **TOP LEFT** corner
- You'll see text like "Polkadot" or "Westend"
- **Click on that text**
- A menu drops down
- Scroll and find **"Paseo"**
- **Click "Paseo"**

### Step 3: Connect Wallet
- Look at **TOP RIGHT** corner
- Click the icon (looks like a person or account)
- Click **"Add account"** or **"Import from extension"**
- Select your account
- Enter password

### Step 4: Find Contracts
- Look at the **TOP MENU BAR** (horizontal menu)
- Find **"Developer"** (might be in a dropdown)
- **Hover or click "Developer"**
- Click **"Contracts"** from the dropdown

### Step 5: Upload
- You should see a page with contract options
- Look for a big button: **"Upload WASM"** or **"Add New Contract"**
- Click it
- Follow the file upload prompts

---

## Method 5: Using Polkadot Portal (Alternative Interface)

Polkadot Portal is another interface that might be easier:

1. Go to: **https://portal.polkadot.io/**
2. Connect wallet
3. Switch to Paseo network
4. Navigate to Contracts section
5. Upload and deploy

---

## Quick Comparison

| Method | Difficulty | Requires | Best For |
|--------|-----------|----------|----------|
| cargo-contract CLI | Easy | Seed phrase | Command-line users |
| Deployment Script | Easiest | Seed phrase, Docker | Automated deployment |
| Polkadot.js CLI | Medium | npm, seed phrase | Advanced users |
| Polkadot.js Apps | Medium | Browser navigation | Visual interface users |
| Polkadot Portal | Easy | Browser | Alternative interface |

---

## Recommended: Use Method 1 (cargo-contract CLI)

**Why?**
- ✅ No website navigation needed
- ✅ Clear command-line output
- ✅ Step-by-step process
- ✅ Works reliably

**Quick Start:**

1. Install subxt-cli:
   ```bash
   cargo install subxt-cli
   ```

2. Build contract (Docker):
   ```bash
   cd contract/org_registry
   docker run --rm -v "$PWD":/build -w /build \
     paritytech/contracts-ci-linux:production \
     cargo contract build --release
   ```

3. Upload:
   ```bash
   cargo contract upload \
     --suri "your seed phrase here" \
     --url wss://paseo-rpc.polkadot.io \
     target/ink/org_registry.contract
   ```

4. Instantiate:
   ```bash
   cargo contract instantiate \
     --constructor new \
     --suri "your seed phrase here" \
     --url wss://paseo-rpc.polkadot.io \
     --code-hash CODE_HASH_FROM_UPLOAD \
     --salt 0x00
   ```

5. Configure backend with the contract address

---

## Troubleshooting

### "Command not found: cargo contract"
**Solution:** The upload/instantiate commands might need different syntax. Try:
```bash
cargo contract --help
```
to see available commands.

### "Invalid seed phrase"
**Solution:** 
- Make sure seed phrase is 12 or 24 words
- No extra spaces
- Exact words (check spelling)

### "Insufficient balance"
**Solution:** Get more Paseo testnet tokens

### "Connection failed"
**Solution:** 
- Check internet connection
- Verify RPC URL: `wss://paseo-rpc.polkadot.io`
- Try again

---

## Security Note

⚠️ **IMPORTANT:** Never share your seed phrase with anyone!
- Only use it in secure environments
- Don't commit it to git
- Don't share screenshots with seed phrase visible

---

## Need Help?

If you're stuck on any method:
1. Check the error message
2. Verify you have Paseo tokens
3. Make sure network is Paseo (not mainnet)
4. Try a different method from the list above

