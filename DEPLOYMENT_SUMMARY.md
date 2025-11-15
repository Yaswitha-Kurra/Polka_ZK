# Quick Deployment Summary

## 🚀 Deploy Contract to Paseo Testnet

### Step 1: Install Prerequisites

```bash
# Install cargo-contract (if not already installed)
cargo install cargo-contract --force
```

### Step 2: Get Paseo Testnet Tokens

1. Install Polkadot.js extension in your browser
2. Create a new account (or use existing)
3. Get testnet tokens:
   - Visit https://polkadot.js.org/apps/
   - Switch to **Paseo** network
   - Use faucet or request tokens in Polkadot Discord/Telegram
   - You need ~5-10 PASEO tokens for deployment

### Step 3: Build Contract

```bash
cd contract/org_registry
cargo contract build --release
```

This creates:
- `target/ink/org_registry.wasm` (WASM binary)
- `target/ink/metadata.json` (contract metadata)

### Step 4: Deploy via Polkadot.js Apps

1. **Open Polkadot.js Apps:**
   - Go to https://polkadot.js.org/apps/
   - Switch network to **Paseo** (top left)
   - Connect your wallet

2. **Upload Contract:**
   - Navigate to **Developer** → **Contracts** → **Upload WASM**
   - Upload `target/ink/org_registry.wasm`
   - Upload `target/ink/metadata.json`
   - Sign transaction

3. **Instantiate Contract:**
   - Click **Instantiate** on your uploaded contract
   - Use default constructor `new()`
   - Sign transaction
   - **Copy the contract address** (starts with `5`)

### Step 5: Configure Backend

Create `backend/.env`:

```bash
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
```

Restart backend:

```bash
cd backend
npm start
```

You should see: `✅ Connected to Polkadot node`

## 📚 Full Documentation

- **⭐ Step-by-Step Guide (START HERE):** [docs/DEPLOY_STEP_BY_STEP.md](./docs/DEPLOY_STEP_BY_STEP.md) - **Most detailed, beginner-friendly**
- **Detailed Guide:** [docs/DEPLOY_CONTRACT.md](./docs/DEPLOY_CONTRACT.md)
- **Checklist:** [contract/DEPLOY_CHECKLIST.md](./contract/DEPLOY_CHECKLIST.md)

## ✅ Verification

After deployment, test:
1. Create ZK Badge → Should register on-chain
2. Join Organization → Should update Merkle tree
3. Generate Proof → Should create ZK proof
4. Verify Proof → Should submit on-chain verification
5. Access Files → Should work with verified proof

## 🆘 Troubleshooting

- **"Insufficient balance"** → Get more Paseo tokens
- **"Connection timeout"** → Check WebSocket URL
- **"Contract not found"** → Verify contract address in backend/.env

