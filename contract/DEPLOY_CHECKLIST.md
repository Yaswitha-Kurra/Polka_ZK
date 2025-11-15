# Contract Deployment Checklist

Quick checklist for deploying to Paseo testnet.

## Pre-Deployment

- [ ] Rust installed (`rustc --version`)
- [ ] cargo-contract installed (`cargo contract --version`)
- [ ] Polkadot.js extension installed in browser
- [ ] Paseo testnet account created
- [ ] Paseo testnet tokens obtained (at least 5-10 PASEO)

## Build Contract

```bash
cd contract/org_registry
cargo contract build --release
```

- [ ] Build completed successfully
- [ ] Files created:
  - [ ] `target/ink/org_registry.contract`
  - [ ] `target/ink/org_registry.wasm`
  - [ ] `target/ink/metadata.json`

## Deploy to Paseo

1. [ ] Open https://polkadot.js.org/apps/
2. [ ] Switch network to **Paseo**
3. [ ] Connect wallet (Polkadot.js extension)
4. [ ] Navigate to **Developer** → **Contracts** → **Upload WASM**
5. [ ] Upload WASM file: `target/ink/org_registry.wasm`
6. [ ] Upload metadata: `target/ink/metadata.json`
7. [ ] Sign and submit transaction
8. [ ] Wait for upload confirmation
9. [ ] Click **Instantiate** on your contract code
10. [ ] Configure instantiation (use default constructor)
11. [ ] Sign and submit instantiation
12. [ ] **Copy contract address** (starts with `5`)

## Configure Backend

1. [ ] Create/update `backend/.env`:
   ```bash
   CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
   POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
   ```

2. [ ] Restart backend:
   ```bash
   cd backend
   npm start
   ```

3. [ ] Verify connection:
   - Should see: `✅ Connected to Polkadot node`
   - Should NOT see: `⚠️ No CONTRACT_ADDRESS set`

## Test Deployment

- [ ] Backend starts without errors
- [ ] Can create ZK Badge (registers on-chain)
- [ ] Can join organization
- [ ] Can generate proof
- [ ] Can verify proof on-chain

## Troubleshooting

If deployment fails:
- [ ] Check account has enough PASEO tokens
- [ ] Verify you're on Paseo network (not mainnet!)
- [ ] Check WASM file size (should be reasonable)
- [ ] Try increasing gas limit
- [ ] Check transaction in explorer for error details

## Contract Address

Your contract address: `_________________________________`

Save this address - you'll need it for the backend configuration!

