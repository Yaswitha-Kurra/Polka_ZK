# Easiest Way to Deploy - No Docker, No Local Build Issues

## 🎯 Use GitHub Codespaces (FREE, Works in Browser)

This is the **easiest method** - no Docker, no local build issues, everything works in your browser!

### Step 1: Push Code to GitHub

If you haven't already:

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub.com (go to github.com, click "+" → "New repository")
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Don't have GitHub?** Sign up at https://github.com (it's free!)

### Step 2: Open in Codespaces

1. Go to your GitHub repository on github.com
2. Click the green **"Code"** button (top right)
3. Click the **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait 1-2 minutes for it to open in your browser

### Step 3: Build Contract in Codespaces

In the Codespaces terminal (at the bottom), run:

```bash
# Install cargo-contract
cargo install cargo-contract --force

# Build the contract
cd contract/org_registry
cargo contract build --release
```

**Wait for build to complete** (may take 5-10 minutes first time)

### Step 4: Download Built Files

1. In the left sidebar (file explorer), navigate to:
   `contract/org_registry/target/ink/`

2. You should see:
   - `org_registry.wasm`
   - `org_registry.json` or `metadata.json`

3. **Right-click each file** → **Download**

### Step 5: Deploy via Polkadot.js Apps

Now go to Polkadot.js Apps:

1. **Open:** https://polkadot.js.org/apps/

2. **Switch Network:**
   - Look at **TOP LEFT** corner
   - Click the network name (might say "Polkadot" or "Westend")
   - Scroll and click **"Paseo"**
   - Page will reload

3. **Connect Wallet:**
   - Look at **TOP RIGHT** corner
   - Click the account/person icon
   - Click **"Add account"** or **"Import from extension"**
   - Select your account
   - Enter password

4. **Upload Contract:**
   - Look at **TOP MENU BAR** (horizontal menu)
   - Find **"Developer"** and click it
   - Click **"Contracts"** from dropdown
   - You should see a page with contract options
   - Look for button: **"Upload WASM"** or **"Add New Contract"**
   - Click it
   - Upload:
     - **WASM file:** Select `org_registry.wasm` (downloaded file)
     - **Metadata/JSON:** Select `org_registry.json` (downloaded file)
   - Click **"Upload"** or **"Submit"**
   - Sign the transaction in Polkadot.js extension

5. **Deploy Contract:**
   - After upload succeeds, find your contract code
   - Click **"Instantiate"** or **"Deploy"** button
   - Use constructor: **"new"** (from dropdown)
   - Endowment: **0**
   - Click **"Instantiate"** or **"Deploy"**
   - Sign the transaction
   - **Copy the contract address!** (starts with `5`)

### Step 6: Configure Backend

Back on your local machine:

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/backend

# Create .env file
cat > .env << EOF
CONTRACT_ADDRESS=PASTE_YOUR_CONTRACT_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
EOF
```

**Replace `PASTE_YOUR_CONTRACT_ADDRESS_HERE`** with the address you copied.

### Step 7: Start Backend

```bash
npm start
```

You should see: `✅ Connected to Polkadot node`

**Done!** 🎉

---

## Alternative: If You Can't Find "Developer" Menu

If you can't find the Developer menu in Polkadot.js Apps, try this:

1. **Look for "Settings" or gear icon** (usually top right)
2. **Enable "Developer mode"** or **"Advanced features"**
3. The Developer menu should appear

Or try this URL directly:
- https://polkadot.js.org/apps/?rpc=wss://paseo-rpc.polkadot.io#/contracts

This should take you directly to the Contracts page.

---

## Why This Method is Best

✅ **No Docker needed**
✅ **No local build issues**
✅ **Works in browser**
✅ **Free (GitHub Codespaces)**
✅ **All tools pre-installed**
✅ **Easy to use**

---

## Quick Summary

1. Push to GitHub → Open Codespaces → Build → Download files
2. Go to Polkadot.js Apps → Upload → Deploy
3. Copy address → Configure backend → Done!

**Total time: ~20 minutes, no installation needed!**

