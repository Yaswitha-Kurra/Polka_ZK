# Architecture Overview

## System Components

### 1. Zero-Knowledge Layer (`/zk`)

- **Circom Circuit**: `merkle_membership.circom`
  - Proves Merkle tree membership without revealing identity
  - Uses Poseidon hash function
  - Supports 20-level Merkle trees (2^20 members max)

- **Merkle Tree Generator**: `generateMerkleTree.js`
  - Generates Merkle trees for organizations
  - Computes membership paths for each identity commitment
  - Outputs JSON with paths and roots

- **Proof Generation**: Browser-based using snarkjs
  - Generates Groth16 proofs client-side
  - Never exposes identity secret to server

### 2. Smart Contract (`/contract`)

**Ink! Contract**: `org_registry/lib.rs`

**Storage:**
- `identity_commitments`: Maps address → list of identity commitments
- `user_orgs`: Maps address → list of organization IDs
- `org_roots`: Maps org ID → Merkle root
- `verifications`: Maps (user, org) → latest verification timestamp

**Functions:**
- `register_identity(identity_commitment)`: Register new identity
- `get_identity_commitments(address)`: Get user's identities
- `update_org_root(org_id, new_root)`: Update org Merkle root
- `get_org_root(org_id)`: Get org root
- `verify_proof(org_id, file_id, proof_hash, signals_hash)`: Verify proof
- `get_user_orgs(address)`: Get user's organizations
- `get_latest_verification(address, org_id)`: Get verification timestamp

**Events:**
- `IdentityCreated`: Emitted when user registers identity
- `OrgRootUpdated`: Emitted when org root is updated
- `ProofVerified`: Emitted when proof is verified on-chain

### 3. Backend (`/backend`)

**Express Server** with routes:

- `/user/identity/:address` - Check if user has identity badge
- `/user/orgs/:address` - Get user's organizations
- `/org/:orgId` - Get organization details
- `/org` - List available organizations
- `/org/join` - Join organization (off-chain)
- `/access/request` - Submit ZK proof for verification
- `/file/list/:orgId` - List files for organization
- `/file/download-token` - Generate signed download URL
- `/file/download/:token` - Download file with token

**Services:**
- `contractService.js`: Interacts with Polkadot contract
- `proofVerifier.js`: Verifies ZK proofs using snarkjs
- `eventListener.js`: Listens for on-chain events
- `storage.js`: In-memory storage (replace with database in production)

### 4. Frontend (`/frontend`)

**React Application** with pages:

1. **Landing** (`/`) - Connect wallet, check identity
2. **CreateBadge** (`/create-badge`) - Generate and register identity
3. **JoinOrg** (`/join-org`) - Join organizations
4. **SelectOrg** (`/select-org`) - Select organization to access
5. **GenerateProof** (`/generate-proof`) - Generate ZK proof
6. **VerifyProof** (`/verify-proof`) - Sign on-chain verification
7. **ViewFiles** (`/view-files`) - View available files
8. **DownloadFile** (`/download/:token`) - Download file

**Key Features:**
- Polkadot.js wallet integration
- Browser-based ZK proof generation
- Local storage for identity secrets
- Multi-organization support

## Data Flow

### Identity Creation Flow

1. User connects wallet
2. Frontend generates `identity_secret` (browser-only)
3. Frontend computes `identity_commitment = Poseidon(identity_secret)`
4. Frontend stores `identity_secret` in localStorage
5. Frontend calls contract `registerIdentity(identity_commitment)`
6. User signs transaction via Polkadot.js extension
7. Contract emits `IdentityCreated` event

### Access Verification Flow

1. User selects organization
2. Frontend loads `identity_secret` from localStorage
3. Frontend fetches org root from chain
4. Frontend gets Merkle path (from backend or local)
5. Frontend generates ZK proof using snarkjs
6. Frontend submits proof to backend `/access/request`
7. Backend verifies proof using verification key
8. Frontend calls contract `verifyProof(...)`
9. User signs transaction
10. Contract emits `ProofVerified` event
11. Backend grants file access

### File Access Flow

1. User requests file list for org
2. Backend checks latest verification timestamp
3. If verified (within last hour), return file list
4. User requests download token
5. Backend generates JWT token (5 min expiry)
6. User downloads file using token
7. Backend verifies token and serves file

## Security Considerations

1. **Identity Secrets**: Never sent to server, stored only in browser localStorage
2. **ZK Proofs**: Generated client-side, server only verifies
3. **On-Chain Verification**: Every access requires on-chain transaction
4. **Signed URLs**: Short-lived tokens for file access
5. **Merkle Roots**: Stored on-chain, cannot be tampered with

## Multi-Organization Support

- Users can have multiple identity commitments
- Each org maintains separate Merkle tree
- User generates separate proof for each org
- Each org access requires separate on-chain verification
- Identity secrets stored per org in localStorage

## Future Enhancements

1. Replace in-memory storage with database
2. Implement actual file storage (S3, IPFS, etc.)
3. Add admin interface for org management
4. Implement Merkle tree updates on-chain
5. Add proof aggregation for multiple orgs
6. Implement file encryption
7. Add audit logging

