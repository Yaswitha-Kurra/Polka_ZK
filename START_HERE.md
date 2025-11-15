# 🚀 START HERE - Easiest Deployment Method

## ✅ Use GitHub Codespaces (No Installation Needed!)

This is the **easiest way** - everything works in your browser, no Docker, no local build issues!

---

## Quick Steps (20 minutes total)

### 1. Push to GitHub (5 min)

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access

# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Don't have GitHub?** Sign up free at https://github.com

### 2. Open Codespaces (2 min)

1. Go to your repo on github.com
2. Click green **"Code"** button
3. Click **"Codespaces"** tab  
4. Click **"Create codespace on main"**
5. Wait 1-2 minutes

### 3. Build in Browser (5 min)

In Codespaces terminal:

```bash
cargo install cargo-contract --force
cd contract/org_registry
cargo contract build --release
```

### 4. Download Files (1 min)

1. In file explorer: `contract/org_registry/target/ink/`
2. Right-click `org_registry.wasm` → Download
3. Right-click `org_registry.json` → Download

### 5. Deploy on Polkadot.js Apps (5 min)

1. Go to: **https://polkadot.js.org/apps/**
2. **Top left:** Click network → Select **"Paseo"**
3. **Top right:** Click account icon → Connect wallet
4. **Top menu:** Click **"Developer"** → **"Contracts"**
5. Click **"Upload WASM"**
6. Upload both downloaded files
7. Click **"Instantiate"** → Use **"new"** constructor
8. **Copy contract address!**

### 6. Configure Backend (2 min)

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/backend

cat > .env << EOF
CONTRACT_ADDRESS=PASTE_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
EOF
```

### 7. Start Backend

```bash
npm start
```

Look for: `✅ Connected to Polkadot node`

**Done!** 🎉

---

## Can't Find "Developer" Menu?

Try this direct link:
**https://polkadot.js.org/apps/?rpc=wss://paseo-rpc.polkadot.io#/contracts**

This takes you straight to the Contracts page!

---

## Why This is Easiest

✅ No Docker installation
✅ No local build issues  
✅ No Rust version problems
✅ Works in browser
✅ Free (GitHub Codespaces)
✅ All tools pre-installed

**Just follow the 7 steps above!**

---

## Need More Details?

See: `EASIEST_WAY.md` for detailed step-by-step instructions.

