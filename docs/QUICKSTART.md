# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Rust and cargo-contract installed
- ✅ Circom compiler installed (`npm install -g circom` or download from [circom releases](https://github.com/iden3/circom/releases))
- ✅ Polkadot.js extension installed in browser
- ✅ Local Polkadot node running (or testnet connection)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install ZK dependencies
cd zk
npm install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup ZK Circuits

```bash
cd zk

# IMPORTANT: Install Circom 2.x (not the deprecated npm package)
# The npm package 'circom' only provides version 0.5.x which is incompatible
# See zk/INSTALL_CIRCOM.md for installation instructions

# For macOS:
# wget https://github.com/iden3/circom/releases/download/v2.1.6/circom-macos-amd64
# chmod +x circom-macos-amd64
# sudo mv circom-macos-amd64 /usr/local/bin/circom

# Verify you have Circom 2.x (should show 2.x.x, NOT 0.5.x)
circom --version

# Compile the circuit
npm run compile

# Generate proving and verification keys
npm run setup

# Generate sample Merkle tree
npm run generate-merkle org1
```

**Note**: 
- The circuit compilation may take a few minutes. The setup script generates the Groth16 keys.
- **CRITICAL**: You must have Circom 2.x installed. The npm package `circom` is deprecated and only provides 0.5.x which won't work.
- See `zk/INSTALL_CIRCOM.md` for detailed installation instructions.

### 3. Deploy Smart Contract

```bash
cd contract/org_registry

# Build the contract
cargo contract build

# Start a local Polkadot node in another terminal:
# polkadot --dev

# Deploy the contract (in contract directory)
cargo contract instantiate \
  --constructor new \
  --suri //Alice \
  --skip-confirm

# Copy the contract address from the output
```

### 4. Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
PORT=3001
POLKADOT_WS_URL=ws://127.0.0.1:9944
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
JWT_SECRET=your-secret-key-change-in-production
EOF

# Edit .env and add your contract address
```

### 5. Start Backend

```bash
cd backend
npm start
```

You should see:
```
Backend server running on port 3001
Connected to Polkadot node
Starting event listener...
```

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 7. Use the Application

1. Open `http://localhost:5173` in your browser
2. Click "Connect Polkadot Wallet"
3. Approve the connection in Polkadot.js extension
4. Follow the workflow:
   - Create ZK Badge (if new user)
   - Join an Organization
   - Select Organization
   - Generate ZK Proof
   - Verify Proof On-Chain
   - View and Download Files

## Testing

### Test ZK Proof Generation

```bash
cd zk
npm run test-proof
```

Expected output:
```
Testing ZK proof generation...
Proof generated!
Public signals: [...]
Proof verified: true
✅ Proof is valid!
```

### Test Contract Connection

```bash
cd zk
node scripts/testContract.js
```

Expected output:
```
Testing contract interaction...
Connected to Polkadot node
Chain: Development
Node: Substrate Node
Version: x.x.x
Listening for new blocks...
```

## Troubleshooting

### "Circuit not compiled"
- Run `npm run compile` in the `zk` directory

### "Contract address not set"
- Make sure you've set `CONTRACT_ADDRESS` in `backend/.env`
- Verify the contract is deployed and address is correct

### "Polkadot API not connected"
- Ensure local node is running: `polkadot --dev`
- Check `POLKADOT_WS_URL` in `backend/.env`

### "No Polkadot extension found"
- Install Polkadot.js extension from browser store
- Refresh the page after installation

### Frontend can't load circuit files
- Copy circuit files to `frontend/public/circuits/`:
  ```bash
  mkdir -p frontend/public/circuits
  cp zk/circuits/*.wasm frontend/public/circuits/
  cp zk/circuits/proving_key.zkey frontend/public/circuits/
  ```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Read [SETUP.md](./SETUP.md) for detailed setup instructions
- Customize organizations and files in `backend/src/services/storage.js`
- Deploy to testnet for production testing

