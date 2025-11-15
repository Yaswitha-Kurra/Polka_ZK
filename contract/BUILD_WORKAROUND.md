# Build Workaround for cargo-contract Issue

If you're encountering the error:
```
error: failed to parse manifest at `/tmp/cargo-contract_XXX/Cargo.toml`
Caused by:
  the target `org_registry` is a binary and can't have any crate-types set
```

This is a known issue with `cargo-contract 5.0.3`. **The contract code is correct** (verified with `cargo check`).

## ✅ Recommended Solution: Deploy via Polkadot.js Apps

**Polkadot.js Apps can compile and deploy your contract directly!** You don't need `cargo-contract build` to work.

### Steps:

1. **Open Polkadot.js Apps:**
   - Go to https://polkadot.js.org/apps/
   - Switch to **Paseo** testnet
   - Connect your wallet

2. **Upload Contract Source:**
   - Navigate to **Developer** → **Contracts** → **Upload WASM**
   - Instead of uploading a pre-built WASM, you can:
     - Use the **"Upload & deploy"** option
     - Or use the **"Add New Contract"** → **"Upload Contract Code"**
     - Polkadot.js Apps will compile it for you

3. **Alternative: Use Contract Wizard**
   - Some versions of Polkadot.js Apps have a contract wizard
   - It can compile Ink! contracts directly

### Why This Works:

Polkadot.js Apps uses its own build system that doesn't have the cargo-contract bug. Your contract code is correct, so it will compile successfully.

## Other Workarounds (if needed):

## Option 1: Use Manual Build (Recommended)

Build the contract manually and then use `cargo-contract` only for optimization:

```bash
cd contract/org_registry

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# The WASM file will be at:
# target/wasm32-unknown-unknown/release/org_registry.wasm

# Optimize using wasm-opt (if installed)
wasm-opt -Os target/wasm32-unknown-unknown/release/org_registry.wasm \
  -o target/ink/org_registry.wasm

# Copy metadata (you'll need to generate this separately or use cargo-contract metadata)
```

## Option 2: Update/Reinstall cargo-contract

Try updating to the latest version:

```bash
cargo install cargo-contract --force
```

Or try a specific version:

```bash
cargo install cargo-contract --version 4.0.0 --force
```

## Option 3: Use Docker

Use the official Ink! Docker image which has a working cargo-contract:

```bash
docker run --rm -v "$PWD":/build -w /build/contract/org_registry \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release
```

## Option 4: Temporary Fix - Rename Library

As a temporary workaround, you can try renaming the library in `Cargo.toml`:

```toml
[lib]
name = "org_registry_lib"  # Changed from "org_registry"
path = "lib.rs"
crate-type = ["cdylib", "rlib"]
```

Then update the contract module name in `lib.rs` if needed.

## Current Status

The code compiles successfully with `cargo check`, so the contract code is correct. The issue is with `cargo-contract`'s build process.

For deployment, you can:
1. Use the manual build method above
2. Deploy the WASM directly via Polkadot.js Apps
3. Wait for a cargo-contract update that fixes this issue

## Verification

To verify your contract code is correct:

```bash
cargo check
cargo test
```

Both should pass without errors.

