# Testing Guide - Complete Workflow

This guide walks you through testing the entire Polkadot ZK Access Control system.

## Prerequisites Checklist

Before testing, ensure you have:

- ✅ ZK circuits compiled (`npm run compile` in `zk/`)
- ✅ Setup complete (`npm run setup` in `zk/`)
- ✅ Merkle tree generated (`npm run generate-merkle org1` in `zk/`)
- ✅ Node.js 18+ installed
- ✅ Polkadot.js extension installed in browser
- ✅ Local Polkadot node running (or testnet connection)

## Step-by-Step Testing

### 1. Test ZK Proof Generation (Backend/Node.js)

First, verify that ZK proofs can be generated:

```bash
cd zk
npm run test-proof
```

**Expected Output:**
- Proof generated successfully
- Proof verified: true
- ✅ Proof is valid!

**If this fails:**
- Check that `circuits/proving_key.zkey` exists
- Check that `circuits/verification_key.json` exists
- Re-run `npm run setup` if needed

### 2. Copy Circuit Files to Frontend

The frontend needs the compiled circuit files:

```bash
cd zk
npm run copy-circuits
```

This copies:
- `merkle_membership.wasm` → `frontend/public/circuits/`
- `proving_key.zkey` → `frontend/public/circuits/`

**Verify:**
```bash
ls -lh frontend/public/circuits/
```

### 3. Start Backend Server

```bash
cd backend

# Create .env file if it doesn't exist
cat > .env << EOF
PORT=3001
POLKADOT_WS_URL=ws://127.0.0.1:9944
CONTRACT_ADDRESS=
JWT_SECRET=dev-secret-key-change-in-production
EOF

# Install dependencies (if not done)
npm install

# Start server
npm start
```

**Expected Output:**
```
Backend server running on port 3001
Connected to Polkadot node
Starting event listener...
```

**If connection fails:**
- Start a local Polkadot node: `polkadot --dev`
- Or update `POLKADOT_WS_URL` in `.env` to point to a testnet

### 4. Start Frontend Development Server

In a new terminal:

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 5. Test Frontend Workflow

Open `http://localhost:5173` in your browser and follow these steps:

#### Step 5.1: Connect Wallet
1. Click "Connect Polkadot Wallet"
2. Approve connection in Polkadot.js extension
3. Should see your wallet address

#### Step 5.2: Create ZK Badge (if new user)
1. If you're a new user, you'll be redirected to "Create ZK Badge"
2. Click "Create ZK Badge"
3. Wait for:
   - Identity secret generation
   - Identity commitment computation
   - Local storage
   - On-chain transaction (sign in wallet)
4. Should redirect to organization selection

#### Step 5.3: Join Organization
1. Click "Join an Organization"
2. Enter org code: `1` (or select from available orgs)
3. Click "Join Organization"
4. Should see success message

#### Step 5.4: Select Organization
1. You should see "Your Organizations" with org ID 1
2. Click on the organization card
3. Should redirect to proof generation

#### Step 5.5: Generate ZK Proof
1. Click "Generate Proof"
2. Wait for proof generation (may take 10-30 seconds)
3. Should redirect to verification page

#### Step 5.6: Verify Proof On-Chain
1. Click "Sign & Verify Proof"
2. Approve transaction in Polkadot.js extension
3. Should redirect to files page

#### Step 5.7: View and Download Files
1. Should see list of files for the organization
2. Click "Download" on a file
3. Should see file content or download

### 6. Test Backend API Directly

You can also test the backend API using curl or Postman:

#### Check User Identity
```bash
curl http://localhost:3001/user/identity/YOUR_WALLET_ADDRESS
```

#### List Organizations
```bash
curl http://localhost:3001/org?address=YOUR_WALLET_ADDRESS
```

#### Get Organization Details
```bash
curl http://localhost:3001/org/1
```

#### List Files (requires verification)
```bash
curl "http://localhost:3001/file/list/1?address=YOUR_WALLET_ADDRESS"
```

## Testing Without Full Setup

If you don't have a Polkadot node or contract deployed, the system will use mock data:

- Backend returns mock data when contract address is not set
- Frontend can still generate proofs (circuit files needed)
- File access uses mock verification timestamps

## Troubleshooting

### Frontend Can't Load Circuit Files
```bash
# Make sure files are copied
cd zk
npm run copy-circuits

# Verify files exist
ls -lh frontend/public/circuits/
```

### Proof Generation Fails
- Check browser console for errors
- Verify `proving_key.zkey` is in `frontend/public/circuits/`
- Check that circuit was compiled with Circom 2.x

### Backend Can't Connect to Polkadot
- Start local node: `polkadot --dev`
- Or use testnet: Update `POLKADOT_WS_URL` in `.env`

### Contract Calls Fail
- Deploy contract first (see contract setup)
- Set `CONTRACT_ADDRESS` in `backend/.env`
- Or use mock mode (leave `CONTRACT_ADDRESS` empty)

## Next Steps After Testing

1. **Deploy Contract to Testnet**
   - Build and deploy to Rococo or other testnet
   - Update `CONTRACT_ADDRESS` in backend

2. **Replace Mock Data**
   - Replace in-memory storage with database
   - Implement actual file storage (S3, IPFS, etc.)

3. **Production Setup**
   - Use production powers of tau ceremony
   - Secure JWT secret
   - Add proper error handling
   - Add logging and monitoring

4. **Security Hardening**
   - Review access controls
   - Add rate limiting
   - Implement proper authentication
   - Audit smart contract

