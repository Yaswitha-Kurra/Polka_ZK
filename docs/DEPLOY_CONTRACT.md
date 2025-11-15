# Deploy Contract to Paseo Testnet

This guide will walk you through deploying the Ink! smart contract to Paseo (Polkadot's testnet) and connecting it to your backend.

## Prerequisites

1. **Rust and cargo-contract installed**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install cargo-contract
   cargo install cargo-contract --force
   ```

2. **Polkadot.js Extension** installed in your browser
   - Install from: https://polkadot.js.org/extension/

3. **Paseo Testnet Account** with tokens
   - We'll cover how to get testnet tokens below

## Step 1: Get Paseo Testnet Tokens

Paseo is Polkadot's testnet. You need testnet tokens (PASEO) to deploy contracts.

### Option A: Use Paseo Faucet (if available)
1. Visit the Paseo faucet (check Polkadot wiki for current faucet URL)
2. Connect your wallet
3. Request testnet tokens

### Option B: Use Polkadot.js Apps
1. Go to https://polkadot.js.org/apps/
2. Switch network to "Paseo" (in the top left)
3. Go to "Accounts" → "Faucet" (if available)
4. Request tokens for your account

### Option C: Use Discord/Social Media
1. Join Polkadot Discord or Telegram
2. Request testnet tokens in the testnet channels
3. Provide your Paseo address

**Your Paseo address format:** Starts with `5` (SS58 format)

## Step 2: Build the Contract

```bash
cd contract/org_registry

# Build the contract
cargo contract build --release

# This will create:
# - target/ink/org_registry.contract (deployment bundle)
# - target/ink/org_registry.wasm (WASM binary)
# - target/ink/metadata.json (contract metadata)
```

**Note:** The first build may take 10-15 minutes as it compiles all dependencies.

## Step 3: Deploy Using Polkadot.js Apps

### 3.1 Open Polkadot.js Apps

1. Go to https://polkadot.js.org/apps/
2. Click the network selector (top left)
3. Select **"Paseo"** testnet
4. Connect your wallet using the Polkadot.js extension

### 3.2 Upload Contract Code

1. Navigate to **"Developer"** → **"Contracts"** → **"Upload WASM"**
2. Click **"Add New Contract"** or **"Upload WASM"**
3. Upload the WASM file:
   - File: `target/ink/org_registry.wasm`
   - ABI/JSON: `target/ink/metadata.json`
4. Click **"Upload"** and sign the transaction
5. Wait for the upload to complete (this costs gas)

### 3.3 Instantiate the Contract

1. After uploading, you'll see your contract code
2. Click **"Instantiate"** or **"Deploy"**
3. Configure instantiation:
   - **Constructor:** Select `new()` (or the default constructor)
   - **Endowment:** Leave default (usually 0 for this contract)
   - **Gas Limit:** Use the suggested value or increase slightly
   - **Salt:** Optional, leave empty for first deployment
4. Click **"Deploy"** and sign the transaction
5. **Save the contract address** - you'll need this!

### 3.4 Verify Deployment

1. After instantiation, you should see your contract in the contracts list
2. Click on it to interact with it
3. Test a simple query (e.g., check if it's initialized)

## Step 4: Configure Backend

Once you have the contract address, configure your backend:

### 4.1 Update Backend Environment

Create or edit `backend/.env`:

```bash
# Contract address from Step 3.3
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE

# Paseo testnet WebSocket URL
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io

# Backend port (optional, defaults to 3001)
PORT=3001
```

**Example:**
```bash
CONTRACT_ADDRESS=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
```

### 4.2 Restart Backend

```bash
cd backend
npm start
```

You should now see:
```
✅ Connected to Polkadot node
Starting event listener...
```

Instead of the warning about no contract address.

## Step 5: Update Frontend (Optional)

If you want to hardcode the contract address in the frontend (not recommended for production), update `frontend/src/utils/contract.js`:

```javascript
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
```

**Better approach:** Use environment variables or fetch from backend.

## Alternative: Deploy Using CLI

If you prefer command-line deployment:

### Install subxt-cli (optional)

```bash
cargo install subxt-cli
```

### Deploy using cargo-contract

```bash
cd contract/org_registry

# Deploy to Paseo
cargo contract instantiate \
  --constructor new \
  --suri YOUR_SEED_PHRASE \
  --url wss://paseo-rpc.polkadot.io \
  --salt 0x00 \
  --skip-confirm
```

**⚠️ Security Warning:** Never use your main account seed phrase. Create a separate testnet account.

## Troubleshooting

### Error: "Insufficient balance"
- Get more Paseo testnet tokens from the faucet
- Check your account balance in Polkadot.js Apps

### Error: "Contract upload failed"
- Ensure you're on the Paseo network
- Check that the WASM file is valid
- Try increasing gas limit

### Error: "Connection timeout"
- Verify the WebSocket URL is correct: `wss://paseo-rpc.polkadot.io`
- Check your internet connection
- Try a different RPC endpoint if available

### Contract not appearing
- Refresh Polkadot.js Apps
- Check "Developer" → "Contracts" → "Contract Codes"
- Verify the transaction was successful in "Network" → "Explorer"

## Contract Address Format

Paseo uses SS58 address encoding (same as Polkadot):
- Starts with `5`
- Example: `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`

## Next Steps

After deployment:

1. ✅ Contract is deployed and address is set in backend
2. ✅ Backend is connected to Paseo testnet
3. ✅ Test the complete workflow:
   - Create ZK Badge (registers identity on-chain)
   - Join Organization (updates Merkle tree)
   - Generate Proof (creates ZK proof)
   - Verify Proof (submits verification on-chain)
   - Access Files (uses verified proof)

## Cost Estimation

- **Upload WASM:** ~1-5 PASEO tokens (one-time)
- **Instantiate Contract:** ~0.1-1 PASEO tokens (one-time)
- **Register Identity:** ~0.01-0.1 PASEO per transaction
- **Verify Proof:** ~0.01-0.1 PASEO per transaction

These are estimates - actual costs depend on network conditions.

## Production Deployment

For production deployment to Polkadot mainnet:

1. **Security Audit:** Get your contract audited
2. **Test Thoroughly:** Test on multiple testnets
3. **Mainnet Tokens:** You'll need real DOT tokens (not testnet)
4. **RPC Endpoint:** Use a reliable mainnet RPC endpoint
5. **Monitoring:** Set up monitoring and alerts

## Resources

- **Polkadot.js Apps:** https://polkadot.js.org/apps/
- **Ink! Documentation:** https://use.ink/
- **Paseo Testnet Info:** Check Polkadot wiki
- **cargo-contract Docs:** https://github.com/paritytech/cargo-contract

