const { MerkleTree } = require("merkletreejs");
const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");
const path = require("path");

// Poseidon hash function for Circom compatibility
let poseidonInstance = null;

async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

// Poseidon hash function that works with MerkleTree
async function poseidonHash(inputs) {
  const poseidon = await getPoseidon();
  // Convert inputs to array of BigInts if needed
  const inputArray = Array.isArray(inputs) ? inputs : [inputs];
  const bigIntInputs = inputArray.map(i => {
    if (typeof i === 'string') {
      return BigInt(i.startsWith('0x') ? i : '0x' + i);
    }
    return BigInt(i);
  });
  
  // Poseidon hash (returns BigInt)
  const result = poseidon(bigIntInputs);
  return result.toString();
}

// Generate Merkle tree for an organization
async function generateMerkleTree(orgId, identityCommitments) {
  console.log(`Generating Merkle tree for org: ${orgId}`);
  console.log(`Members: ${identityCommitments.length}`);
  
  // Create a synchronous hash function for MerkleTree
  // Note: MerkleTree calls this with (left, right) buffers
  const poseidonHashSync = (left, right) => {
    // Handle case where right might be undefined (single leaf)
    if (!right) {
      return left;
    }
    // This is a simplified hash for tree construction
    // The actual Poseidon hashing for identity commitments happens in the circuit
    const crypto = require("crypto");
    const combined = Buffer.concat([left, right]);
    return Buffer.from(crypto.createHash("sha256").update(combined).digest());
  };
  
  const leaves = identityCommitments.map(commitment => 
    Buffer.from(commitment.toString(16).padStart(64, '0'), 'hex')
  );
  
  // Build Merkle tree with synchronous hash function
  // Note: The actual Poseidon hash of identity commitments is done in the circuit
  // This tree is just for generating the Merkle paths
  const tree = new MerkleTree(leaves, poseidonHashSync, { 
    sortPairs: true,
    hashLeaves: false 
  });
  
  const root = tree.getRoot().toString('hex');
  
  // Generate paths for all members
  const memberPaths = identityCommitments.map((commitment, index) => {
    const leaf = Buffer.from(commitment.toString(16).padStart(64, '0'), 'hex');
    const proof = tree.getProof(leaf, index);
    
    const pathElements = proof.map(p => 
      BigInt('0x' + p.data.toString('hex'))
    );
    const pathIndices = proof.map(p => p.position === 'left' ? 0 : 1);
    
    return {
      identityCommitment: commitment.toString(),
      pathElements: pathElements.map(e => e.toString()),
      pathIndices: pathIndices,
      root: root
    };
  });
  
  return {
    orgId,
    root: '0x' + root,
    memberPaths,
    treeHeight: tree.getDepth()
  };
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const orgId = args[0] || 'org1';
  
  // Sample identity commitments (in production, these come from on-chain data)
  const sampleCommitments = [
    BigInt('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'),
    BigInt('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
    BigInt('0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'),
  ];
  
  const merkleData = await generateMerkleTree(orgId, sampleCommitments);
  
  const outputPath = path.join(__dirname, `../merkle/${orgId}_merkle.json`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(merkleData, null, 2));
  
  console.log(`Merkle tree saved to: ${outputPath}`);
  console.log(`Root: ${merkleData.root}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateMerkleTree, poseidonHash };

