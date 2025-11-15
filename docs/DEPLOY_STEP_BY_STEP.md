# Step-by-Step Contract Deployment Guide

This guide will walk you through deploying your contract to Paseo testnet using Polkadot.js Apps, with detailed instructions for every step.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Polkadot.js browser extension installed
- [ ] Created an account in the extension
- [ ] Have Paseo testnet tokens (at least 5-10 PASEO)
- [ ] Contract code is ready (✅ `cargo check` passes)

## Part 1: Setup Your Wallet

### Step 1.1: Install Polkadot.js Extension

1. Open your browser (Chrome, Firefox, or Brave)
2. Go to: https://polkadot.js.org/extension/
3. Click **"Install"** or **"Add to Chrome/Firefox"**
4. Follow the installation prompts
5. The extension icon should appear in your browser toolbar

### Step 1.2: Create an Account

1. Click the Polkadot.js extension icon in your browser toolbar
2. Click **"+"** or **"Create new account"**
3. **IMPORTANT:** Save your seed phrase securely (write it down!)
4. Set a password for your account
5. Your account is now created - note the address (starts with `5`)

### Step 1.3: Get Paseo Testnet Tokens

**Option A: Use Faucet (if available)**
1. Go to https://polkadot.js.org/apps/
2. Switch to **Paseo** network (see Part 2, Step 2.1)
3. Look for "Faucet" in the menu
4. Enter your address and request tokens

**Option B: Request in Discord/Telegram**
1. Join Polkadot Discord: https://discord.gg/polkadot
2. Go to testnet channels
3. Request Paseo tokens with your address
4. Someone will send you tokens

**Option C: Use Social Media**
1. Check Polkadot Twitter/X for testnet faucet links
2. Follow instructions to get tokens

**Verify you have tokens:**
- In Polkadot.js Apps, your balance should show PASEO tokens
- You need at least 5-10 tokens for deployment

---

## Part 2: Access Polkadot.js Apps

### Step 2.1: Open Polkadot.js Apps

1. Go to: **https://polkadot.js.org/apps/**
2. Wait for the page to load completely

### Step 2.2: Switch to Paseo Testnet

1. Look at the **top left corner** of the page
2. You'll see a network selector (might say "Polkadot" or "Westend")
3. **Click on the network name**
4. A dropdown menu will appear
5. Scroll down and find **"Paseo"** in the list
6. **Click on "Paseo"**
7. The page will reload and show "Paseo" in the top left

### Step 2.3: Connect Your Wallet

1. Look at the **top right corner** of the page
2. You'll see an icon or button (might say "Accounts" or show a person icon)
3. **Click on it**
4. A sidebar or popup will appear
5. Click **"Add account"** or **"Import from extension"**
6. Select your account from the list
7. Enter your password if prompted
8. Your account should now appear in the top right

**Verify connection:**
- You should see your account address in the top right
- Your balance should be visible

---

## Part 3: Build Contract (Using Docker)

Since `cargo-contract build` has issues, we'll use Docker to build the contract.

### Step 3.1: Check if Docker is Installed

Open terminal and run:
```bash
docker --version
```

**If Docker is NOT installed:**

**For macOS:**
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install it
3. Open Docker Desktop
4. Wait for it to start (whale icon in menu bar should be running)

**If Docker IS installed:**
Continue to Step 3.2

### Step 3.2: Build the Contract

1. Open terminal
2. Navigate to your contract directory:
   ```bash
   cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry
   ```

3. Run Docker build command:
   ```bash
   docker run --rm \
     -v "$PWD":/build \
     -w /build \
     paritytech/contracts-ci-linux:production \
     cargo contract build --release
   ```

4. **Wait for build to complete** (this may take 5-10 minutes the first time)
5. You should see: `[==] Building cargo project` and then success messages

### Step 3.3: Find Your Built Files

After build completes, you'll have these files:

1. **WASM file:** `target/ink/org_registry.wasm`
   - This is the compiled contract code
   - File size: ~100-500 KB

2. **Metadata file:** `target/ink/org_registry.json` or `metadata.json`
   - This describes the contract interface
   - File size: ~10-50 KB

**Verify files exist:**
```bash
ls -lh target/ink/
```

You should see both files listed.

---

## Part 4: Upload Contract Code

### Step 4.1: Navigate to Contracts Section

1. In Polkadot.js Apps (on Paseo network)
2. Look at the **top menu bar**
3. Find **"Developer"** in the menu
4. **Click on "Developer"**
5. A dropdown menu will appear
6. **Click on "Contracts"**
7. The page will change to show contract-related options

### Step 4.2: Upload WASM Code

1. In the Contracts page, look for buttons at the top
2. Find **"Upload WASM"** or **"Add New Contract"** button
3. **Click on it**
4. A form or dialog will appear

### Step 4.3: Fill in Upload Form

You'll see a form with fields:

**Field 1: "WASM file" or "Contract WASM"**
1. Click **"Browse"** or **"Choose File"** button
2. Navigate to: `/Users/yaswithakurra/Documents/polkadot-zk-access/contract/org_registry/target/ink/`
3. Select the file: **`org_registry.wasm`**
4. Click **"Open"**

**Field 2: "ABI/JSON file" or "Contract Metadata"**
1. Click **"Browse"** or **"Choose File"** button
2. Navigate to the same folder: `target/ink/`
3. Select the file: **`org_registry.json`** or **`metadata.json`**
4. Click **"Open"**

**Field 3: "Constructor" (if shown)**
- Leave as default or select **"new"** or **"default"**

**Field 4: "Endowment" (if shown)**
- Leave as **0** or default

### Step 4.4: Submit Upload

1. Review that both files are selected
2. Look for a **"Upload"** or **"Submit"** button
3. **Click "Upload"**
4. A popup will appear asking you to sign the transaction

### Step 4.5: Sign Transaction

1. The Polkadot.js extension popup will appear
2. Review the transaction details:
   - **Action:** Code upload
   - **Network:** Paseo
   - **Fee:** Will show estimated cost
3. Enter your **account password**
4. **Click "Sign"** or **"Approve"**
5. Wait for transaction to complete (30 seconds - 2 minutes)

**Success indicator:**
- You'll see a green success message
- The transaction will appear in the "Recent events" section
- Your contract code will appear in the "Code" section

---

## Part 5: Instantiate (Deploy) the Contract

### Step 5.1: Find Your Uploaded Code

1. After upload succeeds, you'll see your contract code listed
2. It might be under **"Code"** tab or **"Contract Codes"** section
3. Find the entry for **"org_registry"** or your contract name
4. **Click on it** to expand details

### Step 5.2: Instantiate the Contract

1. You'll see an **"Instantiate"** or **"Deploy"** button
2. **Click on "Instantiate"**
3. A form will appear

### Step 5.3: Configure Instantiation

Fill in the instantiation form:

**Field 1: "Constructor"**
- Select **"new"** or **"default"** from dropdown
- This is the function that initializes the contract

**Field 2: "Endowment"**
- Enter **0** (or leave default)
- This is how much tokens to send to the contract (we don't need any)

**Field 3: "Gas Limit"**
- Leave as default (or increase slightly if needed)
- This limits how much computation the contract can do

**Field 4: "Salt" (optional)**
- Leave empty for first deployment
- This is used if you want to deploy multiple instances

### Step 5.4: Submit Instantiation

1. Review all fields
2. **Click "Instantiate"** or **"Deploy"**
3. A popup will appear asking you to sign

### Step 5.5: Sign Instantiation Transaction

1. Polkadot.js extension popup appears
2. Review transaction:
   - **Action:** Contract instantiation
   - **Network:** Paseo
   - **Fee:** Estimated cost
3. Enter your **password**
4. **Click "Sign"** or **"Approve"**
5. Wait for transaction (30 seconds - 2 minutes)

**Success indicator:**
- Green success message
- Your contract will appear in **"Contracts"** section
- **IMPORTANT:** Copy the contract address (starts with `5`)

---

## Part 6: Get Your Contract Address

### Step 6.1: Find Contract Address

After instantiation succeeds:

1. Your contract will appear in the **"Contracts"** tab
2. **Click on your contract** to view details
3. Look for **"Contract Address"** or **"Address"**
4. It will be a long string starting with `5`
5. Example: `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`

### Step 6.2: Copy the Address

1. **Click on the address** to select it
2. **Copy it** (Cmd+C on Mac, Ctrl+C on Windows)
3. **Save it somewhere safe** (text file, notes app, etc.)

---

## Part 7: Configure Backend

### Step 7.1: Create Backend Environment File

1. Open terminal
2. Navigate to backend directory:
   ```bash
   cd /Users/yaswithakurra/Documents/polkadot-zk-access/backend
   ```

3. Create or edit `.env` file:
   ```bash
   nano .env
   ```
   (Or use any text editor)

### Step 7.2: Add Configuration

Add these lines to the `.env` file:

```bash
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
```

**Replace `YOUR_CONTRACT_ADDRESS_HERE`** with the address you copied in Step 6.2

**Example:**
```bash
CONTRACT_ADDRESS=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io
PORT=3001
```

4. **Save the file** (in nano: Ctrl+X, then Y, then Enter)

### Step 7.3: Restart Backend

1. If backend is running, stop it (Ctrl+C)
2. Start it again:
   ```bash
   npm start
   ```

3. **Look for this message:**
   ```
   ✅ Connected to Polkadot node
   Starting event listener...
   ```

4. If you see this, **deployment is complete!** ✅

---

## Part 8: Verify Deployment

### Step 8.1: Test Contract Connection

1. Backend should be running
2. Check backend logs - should NOT see:
   - ❌ `⚠️ No CONTRACT_ADDRESS set`
   - ❌ `Failed to connect to Polkadot`

3. Should see:
   - ✅ `✅ Connected to Polkadot node`

### Step 8.2: Test in Frontend

1. Start frontend (if not running):
   ```bash
   cd frontend
   npm run dev
   ```

2. Open browser: http://localhost:5173
3. Connect wallet
4. Try creating a ZK Badge
5. It should register on-chain (check backend logs)

---

## Troubleshooting

### Problem: "Insufficient balance"
**Solution:** Get more Paseo testnet tokens

### Problem: "Transaction failed"
**Solution:** 
- Check you have enough tokens
- Try increasing gas limit
- Check network is Paseo (not mainnet!)

### Problem: "Code upload failed"
**Solution:**
- Verify WASM file is correct
- Try re-uploading
- Check file size (should be reasonable, not 0 bytes)

### Problem: "Cannot find contract"
**Solution:**
- Verify contract address is correct in backend/.env
- Check backend is connected to Paseo
- Restart backend after adding contract address

### Problem: Backend shows "No CONTRACT_ADDRESS set"
**Solution:**
- Check backend/.env file exists
- Verify CONTRACT_ADDRESS line is correct
- Make sure no extra spaces or quotes
- Restart backend

---

## Quick Reference

**Contract Address Format:**
- Starts with `5`
- About 48 characters long
- Example: `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`

**Important URLs:**
- Polkadot.js Apps: https://polkadot.js.org/apps/
- Extension: https://polkadot.js.org/extension/
- Paseo RPC: `wss://paseo-rpc.polkadot.io`

**File Locations:**
- WASM: `contract/org_registry/target/ink/org_registry.wasm`
- Metadata: `contract/org_registry/target/ink/org_registry.json`
- Backend config: `backend/.env`

---

## Success Checklist

After completing all steps, you should have:

- [ ] Contract code uploaded to Paseo
- [ ] Contract instantiated (deployed)
- [ ] Contract address copied
- [ ] Backend `.env` file configured
- [ ] Backend shows "✅ Connected to Polkadot node"
- [ ] Frontend can create badges and interact with contract

**Congratulations! Your contract is deployed! 🎉**

