# Quick Deployment Guide - Easiest Method

## 🚀 Fastest Way to Deploy (Using Script)

### Step 1: Get Your Seed Phrase

1. Open Polkadot.js extension in your browser
2. Click on your account
3. Click "..." (three dots) menu
4. Click "Export account"
5. Enter your password
6. **Copy the seed phrase** (12 or 24 words)
7. **Keep it secret!**

### Step 2: Run Deployment Script

Open terminal and run:

```bash
cd /Users/yaswithakurra/Documents/polkadot-zk-access/contract
./deploy.sh "your seed phrase here"
```

**Example:**
```bash
./deploy.sh "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
```

### Step 3: Wait for Completion

The script will:
- ✅ Build your contract (using Docker)
- ✅ Upload it to Paseo
- ✅ Deploy it
- ✅ Configure backend automatically

### Step 4: Start Backend

```bash
cd ../backend
npm start
```

Look for: `✅ Connected to Polkadot node`

**Done!** 🎉

---

## Alternative: Manual Command Line

If the script doesn't work, use these commands one by one:

### 1. Build Contract

```bash
cd contract/org_registry
docker run --rm -v "$PWD":/build -w /build \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release
```

### 2. Upload Code

```bash
cargo contract upload \
  --suri "your seed phrase here" \
  --url wss://paseo-rpc.polkadot.io \
  target/ink/org_registry.contract
```

**Copy the code hash** from the output!

### 3. Deploy Contract

```bash
cargo contract instantiate \
  --constructor new \
  --suri "your seed phrase here" \
  --url wss://paseo-rpc.polkadot.io \
  --code-hash PASTE_CODE_HASH_HERE \
  --salt 0x00
```

**Copy the contract address** from the output!

### 4. Configure Backend

```bash
cd ../../backend
echo "CONTRACT_ADDRESS=PASTE_CONTRACT_ADDRESS_HERE" > .env
echo "POLKADOT_WS_URL=wss://paseo-rpc.polkadot.io" >> .env
echo "PORT=3001" >> .env
```

Replace `PASTE_CONTRACT_ADDRESS_HERE` with the address from step 3.

### 5. Start Backend

```bash
npm start
```

---

## Need More Help?

See detailed guides:
- **Step-by-step:** `docs/DEPLOY_STEP_BY_STEP.md`
- **Alternative methods:** `docs/DEPLOY_ALTERNATIVE.md`

