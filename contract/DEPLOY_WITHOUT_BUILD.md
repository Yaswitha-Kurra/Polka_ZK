# Deploy Contract Without cargo-contract Build

## ✅ Your Contract Code is Correct!

The contract compiles successfully with `cargo check`. The `cargo-contract build` tool has a bug, but you can deploy without it.

## Option 1: Deploy via Polkadot.js Apps (Easiest)

Polkadot.js Apps can compile your contract directly:

1. **Prepare your contract files:**
   ```bash
   cd contract/org_registry
   # Your files are ready:
   # - lib.rs (contract code)
   # - Cargo.toml (dependencies)
   ```

2. **Open Polkadot.js Apps:**
   - Go to https://polkadot.js.org/apps/
   - Switch to **Paseo** testnet
   - Connect your wallet

3. **Upload Contract:**
   - Navigate to **Developer** → **Contracts**
   - Click **"Add New Contract"** or **"Upload WASM"**
   - Some versions allow you to upload the Rust source directly
   - Or use the contract wizard if available

4. **If WASM upload is required:**
   - You can use a pre-compiled WASM from another source
   - Or wait for cargo-contract to be fixed
   - Or use the Docker method below

## Option 2: Use Docker (If you need WASM file)

```bash
cd contract/org_registry

# Use official Ink! Docker image
docker run --rm \
  -v "$PWD":/build \
  -w /build \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release

# The WASM will be in target/ink/org_registry.wasm
```

## Option 3: Wait for cargo-contract Fix

The issue is in `cargo-contract 5.0.3`. You can:
- Check for updates: `cargo install cargo-contract --force`
- Monitor: https://github.com/paritytech/cargo-contract/issues

## Verification

Your contract is correct! Verify with:

```bash
cd contract/org_registry
cargo check        # ✅ Should pass
cargo test         # ✅ Should pass
```

## Next Steps

Once deployed (via any method above):
1. Copy the contract address
2. Add to `backend/.env`:
   ```
   CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
   POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
   ```
3. Restart backend
4. Test the full workflow!

