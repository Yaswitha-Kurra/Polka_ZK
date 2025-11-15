# Quick Deploy Without Docker

## 🚀 Fastest Method (No Docker Needed)

### Option 1: Try cargo-contract Directly

The deployment script can work without Docker if cargo-contract works:

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract
./deploy_no_docker.sh "your seed phrase here"
```

This script will:
- ✅ Try to build with cargo-contract
- ✅ Upload to Paseo
- ✅ Deploy contract
- ✅ Configure backend

**If cargo-contract build fails**, see options below.

---

## Option 2: Install Docker (Recommended - 5 Minutes)

**Docker makes everything easier!** It's free and takes 5 minutes to install:

### macOS Installation:

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Mac"
   - Choose: Apple Silicon (M1/M2) or Intel

2. **Install:**
   - Open the downloaded `.dmg` file
   - Drag Docker to Applications
   - Open Docker from Applications
   - Wait for it to start (whale icon in menu bar)

3. **Verify:**
   ```bash
   docker --version
   ```

4. **Now use the easy script:**
   ```bash
   cd contract
   ./deploy.sh "your seed phrase"
   ```

**That's it!** Docker is free and makes deployment super easy.

---

## Option 3: Use GitHub Codespaces (Free Online)

If you can't install Docker, use GitHub's free online IDE:

### Step 1: Push Code to GitHub

```bash
# If you haven't already
cd /Users/yaswithakurra/Documents/polkadot-zk-access
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub and push
```

### Step 2: Open in Codespaces

1. Go to your GitHub repo
2. Click **"Code"** button (green)
3. Click **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait for it to open (takes 1-2 minutes)

### Step 3: Build in Codespaces

In the Codespaces terminal:

```bash
cd contract/org_registry
cargo contract build --release
```

### Step 4: Download Files

1. Right-click `target/ink/org_registry.wasm` → **Download**
2. Right-click `target/ink/org_registry.json` → **Download**

### Step 5: Deploy via Polkadot.js Apps

1. Go to: https://polkadot.js.org/apps/
2. Switch to **Paseo**
3. Connect wallet
4. **Developer** → **Contracts** → **Upload WASM**
5. Upload the downloaded files
6. Instantiate and copy address

---

## Option 4: Fix cargo-contract Version

The bug might be in version 5.0.3. Try version 4.0.0:

```bash
# Uninstall current
cargo uninstall cargo-contract

# Install older version
cargo install cargo-contract --version 4.0.0 --force

# Try building
cd contract/org_registry
cargo contract build --release
```

If this works, use `deploy_no_docker.sh` script.

---

## Comparison

| Method | Time | Difficulty | Best For |
|--------|------|-----------|----------|
| **Install Docker** | 5 min | ⭐ Easy | **Everyone (Recommended)** |
| GitHub Codespaces | 15 min | ⭐⭐ Easy | Can't install Docker |
| Fix cargo-contract | 10 min | ⭐⭐ Medium | Developers |
| Manual upload | 20 min | ⭐⭐⭐ Hard | Last resort |

---

## My Strong Recommendation

**Install Docker!** It's:
- ✅ Free
- ✅ Takes 5 minutes
- ✅ Makes everything work
- ✅ One-time setup
- ✅ Used by the easy deployment script

**After installing:**
```bash
cd contract
./deploy.sh "your seed phrase"
```

**That's literally all you need to do!**

---

## Quick Start (After Choosing Method)

### If You Install Docker:
```bash
cd contract
./deploy.sh "your seed phrase"
```

### If You Use Codespaces:
1. Build in Codespaces
2. Download WASM files
3. Upload via Polkadot.js Apps

### If cargo-contract Works:
```bash
cd contract
./deploy_no_docker.sh "your seed phrase"
```

---

## Need Help?

See detailed guide: `docs/DEPLOY_WITHOUT_DOCKER.md`

