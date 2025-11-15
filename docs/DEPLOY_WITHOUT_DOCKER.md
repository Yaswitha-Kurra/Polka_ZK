# Deploy Without Docker

This guide shows you how to deploy your contract without needing Docker.

## Option 1: Fix cargo-contract and Build Locally (Recommended)

### Step 1: Try Different cargo-contract Version

The issue might be with cargo-contract 5.0.3. Let's try an older version:

```bash
# Uninstall current version
cargo uninstall cargo-contract

# Install version 4.0.0 (more stable)
cargo install cargo-contract --version 4.0.0 --force
```

### Step 2: Build Contract

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry
cargo contract build --release
```

If this works, you'll have the WASM file in `target/ink/org_registry.wasm`

### Step 3: Deploy Using Polkadot.js Apps

Since you can't navigate the website easily, let's use a simpler approach:

1. **Get your WASM and metadata files ready:**
   - `target/ink/org_registry.wasm`
   - `target/ink/org_registry.json` or `metadata.json`

2. **Use the command line to get upload instructions:**
   ```bash
   # This will show you exactly what to do
   cargo contract upload --help
   ```

---

## Option 2: Use Pre-built Contract (If Available)

If someone else has built the contract, you can use their WASM file. But for security, it's better to build your own.

---

## Option 3: Use GitHub Codespaces or Online IDE

### Using GitHub Codespaces (Free)

1. **Push your code to GitHub** (if not already)
2. **Open in Codespaces:**
   - Go to your GitHub repo
   - Click "Code" → "Codespaces" → "Create codespace"
3. **In Codespaces terminal:**
   ```bash
   cd contract/org_registry
   cargo contract build --release
   ```
4. **Download the built files:**
   - Right-click `target/ink/org_registry.wasm` → Download
   - Right-click `target/ink/org_registry.json` → Download

### Using GitPod (Free Alternative)

1. Go to: https://gitpod.io/
2. Connect your GitHub repo
3. In the terminal, run:
   ```bash
   cd contract/org_registry
   cargo contract build --release
   ```
4. Download the files

---

## Option 4: Install Docker (Easiest Long-term Solution)

Docker makes building much easier. Here's how to install:

### macOS:

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Download for Mac (Apple Silicon or Intel)
   - Install the .dmg file

2. **Open Docker Desktop:**
   - Launch from Applications
   - Wait for it to start (whale icon in menu bar)

3. **Verify installation:**
   ```bash
   docker --version
   ```

4. **Now you can use the deployment script:**
   ```bash
   cd contract
   ./deploy.sh "your seed phrase"
   ```

**Docker is free and makes everything easier!**

---

## Option 5: Manual Build with Regular Cargo

If cargo-contract doesn't work, we can try building manually:

### Step 1: Install WASM Target

```bash
rustup target add wasm32-unknown-unknown
```

### Step 2: Try Building

```bash
cd contract/org_registry
cargo build --release --target wasm32-unknown-unknown
```

**Note:** This might not create the exact format needed, but we can try.

### Step 3: If Build Succeeds

The WASM will be at:
```
target/wasm32-unknown-unknown/release/org_registry.wasm
```

You can try uploading this, though it might need optimization.

---

## Option 6: Use Polkadot.js Apps with Pre-built Files

If you can get the WASM file from any method above:

1. **Go to:** https://polkadot.js.org/apps/
2. **Switch to Paseo** (top left)
3. **Connect wallet** (top right)
4. **Go to:** Developer → Contracts → Upload WASM
5. **Upload:**
   - WASM file: `org_registry.wasm`
   - Metadata: `org_registry.json`
6. **Click "Upload"** and sign
7. **After upload, click "Instantiate"**
8. **Copy the contract address**

---

## Recommended: Install Docker

**Docker is the easiest solution!** It's:
- ✅ Free
- ✅ One-time installation
- ✅ Makes everything work smoothly
- ✅ Used by the deployment script

**Installation takes 5 minutes:**
1. Download: https://www.docker.com/products/docker-desktop/
2. Install
3. Open Docker Desktop
4. Done!

Then you can use:
```bash
cd contract
./deploy.sh "your seed phrase"
```

---

## Quick Comparison

| Method | Difficulty | Time | Requires |
|--------|-----------|------|----------|
| **Install Docker** | ⭐ Easy | 5 min | Download Docker |
| Fix cargo-contract | ⭐⭐ Medium | 10 min | Try different version |
| GitHub Codespaces | ⭐⭐ Easy | 15 min | GitHub account |
| GitPod | ⭐⭐ Easy | 15 min | GitHub account |
| Manual cargo build | ⭐⭐⭐ Hard | 30 min | May not work perfectly |

---

## My Recommendation

**Install Docker!** It's:
- Free
- Takes 5 minutes
- Makes everything work
- Used by the script (which is easier than Remix)

**After installing Docker:**
```bash
cd contract
./deploy.sh "your seed phrase"
```

That's it! 🚀

---

## If You Can't Install Docker

Try Option 1 first (fix cargo-contract version), then Option 3 (GitHub Codespaces) as backup.

