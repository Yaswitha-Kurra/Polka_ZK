# Simple Deployment - No Docker Needed

## 🎯 Easiest Options (Pick One)

### Option 1: GitHub Codespaces (FREE Online IDE) ⭐ RECOMMENDED

**This is the easiest if you don't have Docker!**

#### Step 1: Push to GitHub (if not already)

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access
git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub.com, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Open in Codespaces

1. Go to your GitHub repo on github.com
2. Click the green **"Code"** button
3. Click **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait 1-2 minutes for it to open

#### Step 3: Build in Codespaces

In the Codespaces terminal, run:

```bash
cd contract/org_registry

# Install cargo-contract
cargo install cargo-contract --force

# Build
cargo contract build --release
```

#### Step 4: Download Files

1. In Codespaces file explorer, go to `contract/org_registry/target/ink/`
2. Right-click `org_registry.wasm` → **Download**
3. Right-click `org_registry.json` → **Download**

#### Step 5: Deploy via Polkadot.js Apps

1. Go to: **https://polkadot.js.org/apps/**
2. **Top left:** Click network → Select **"Paseo"**
3. **Top right:** Click account icon → Connect wallet
4. **Top menu:** Click **"Developer"** → **"Contracts"**
5. Click **"Upload WASM"** button
6. Upload:
   - WASM: `org_registry.wasm` (downloaded file)
   - Metadata: `org_registry.json` (downloaded file)
7. Click **"Upload"** → Sign transaction
8. After upload, click **"Instantiate"**
9. Use constructor: **"new"**
10. Click **"Deploy"** → Sign transaction
11. **Copy the contract address!**

#### Step 6: Configure Backend

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/backend

# Create .env file
cat > .env << EOF
CONTRACT_ADDRESS=PASTE_CONTRACT_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
EOF
```

Replace `PASTE_CONTRACT_ADDRESS_HERE` with the address from step 5.

#### Step 7: Start Backend

```bash
npm start
```

Look for: `✅ Connected to Polkadot node`

**Done!** 🎉

---

### Option 2: Install Docker (5 Minutes - Makes Everything Easy)

**Docker is free and makes deployment super simple!**

#### Install Docker Desktop:

1. **Download:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Mac"
   - Choose: Apple Silicon (M1/M2/M3) or Intel

2. **Install:**
   - Open the `.dmg` file
   - Drag Docker to Applications
   - Open Docker from Applications
   - Wait for it to start (whale icon in menu bar)

3. **Verify:**
   ```bash
   docker --version
   ```

4. **Deploy:**
   ```bash
   cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract
   ./deploy.sh "your seed phrase here"
   ```

**That's it!** One command and you're done.

---

### Option 3: Try cargo-contract Workaround

The bug might be fixable. Try this:

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry

# Try building (might work now)
cargo contract build --release
```

If it works, you'll have the files in `target/ink/`. Then upload via Polkadot.js Apps (see Option 1, Step 5).

---

## Quick Comparison

| Method | Time | Difficulty | Requires |
|--------|------|-----------|----------|
| **GitHub Codespaces** | 15 min | ⭐⭐ Easy | GitHub account |
| **Install Docker** | 5 min | ⭐ Easy | Download Docker |
| Try cargo-contract | 10 min | ⭐⭐ Medium | May not work |

---

## My Recommendation

**Use GitHub Codespaces!** It's:
- ✅ Free
- ✅ No installation needed
- ✅ Works in your browser
- ✅ Has all tools pre-installed
- ✅ Easy to use

**Or install Docker** - it's a 5-minute one-time setup that makes everything easier forever.

---

## Step-by-Step: GitHub Codespaces (Easiest)

1. **Push code to GitHub** (5 min)
2. **Open Codespaces** (2 min)
3. **Build contract** (5 min)
4. **Download files** (1 min)
5. **Upload via Polkadot.js Apps** (5 min)
6. **Configure backend** (2 min)

**Total: ~20 minutes, no Docker needed!**

---

## Need Help?

- **Codespaces guide:** See Option 1 above
- **Docker install:** See Option 2 above
- **Detailed guide:** `docs/DEPLOY_WITHOUT_DOCKER.md`

