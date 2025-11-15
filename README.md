# Polkadot Zero-Knowledge Multi-Organization Access Control DApp

A full-stack application that enables users to join multiple organizations and access private files while proving membership anonymously using zero-knowledge proofs on Polkadot.

## Project Structure

```
/zk              - Zero-knowledge circuits and Merkle tree scripts
/backend         - Node.js Express backend server
/frontend        - React + Vite frontend application
/contract        - Ink! smart contracts
/docs            - Documentation
```

## Quick Start

See [docs/QUICKSTART.md](./docs/QUICKSTART.md) for detailed setup instructions.

### Prerequisites

- Node.js 18+
- Rust and cargo-contract for Ink! contracts
- Circom compiler (install with `npm install -g circom` or from [releases](https://github.com/iden3/circom/releases))
- Polkadot.js browser extension
- Local Polkadot node (or testnet connection)

### Quick Setup

1. **Install all dependencies:**
```bash
# ZK layer
cd zk && npm install && cd ..

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

2. **Setup ZK circuits:**
```bash
cd zk
npm run compile
npm run setup
```

3. **Deploy contract to Paseo testnet:**
   - See [docs/DEPLOY_CONTRACT.md](./docs/DEPLOY_CONTRACT.md) for detailed instructions
   - Quick checklist: [contract/DEPLOY_CHECKLIST.md](./contract/DEPLOY_CHECKLIST.md)
   - Setup script: `cd contract/org_registry && ../setup_deploy.sh`

4. **Configure and start backend:**
```bash
cd backend
# Edit .env with contract address
npm start
```

5. **Start frontend:**
```bash
cd frontend
npm run dev
```

## System Workflow

1. User connects Polkadot wallet
2. Backend checks for ZK Identity Badge
3. User creates badge (if new) or selects organization
4. User joins organizations
5. User generates ZK proof for selected org
6. User signs on-chain verification transaction
7. Backend verifies and grants file access
8. User downloads files with signed URLs

## Features

- ✅ Anonymous membership verification using ZK proofs
- ✅ Multi-organization support
- ✅ On-chain identity commitments
- ✅ Merkle tree-based access control
- ✅ Secure file access with signed URLs

