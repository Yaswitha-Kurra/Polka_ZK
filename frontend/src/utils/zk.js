import { buildPoseidon } from 'circomlibjs';
import * as snarkjs from 'snarkjs';

// Generate random identity secret
export function generateIdentitySecret() {
  // Generate 256-bit random number using Web Crypto API
  const array = new Uint32Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js (shouldn't happen in browser)
    throw new Error('Crypto API not available');
  }
  return BigInt('0x' + Array.from(array)
    .map(x => x.toString(16).padStart(8, '0'))
    .join(''));
}

// Poseidon instance cache
let poseidonInstance = null;

async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

// Helper to convert Poseidon output to BigInt
function poseidonHashToBigInt(result) {
  if (result instanceof Uint8Array) {
    const hex = Array.from(result)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return BigInt('0x' + hex);
  }
  return typeof result === 'bigint' ? result : BigInt(result);
}

// Compute identity commitment using Poseidon hash
export async function computeIdentityCommitment(identitySecret) {
  const poseidon = await getPoseidon();
  const result = poseidon([identitySecret]);
  return poseidonHashToBigInt(result);
}

// Generate ZK proof
export async function generateZKProof(identitySecret, fileId, orgRoot, pathElements, pathIndices) {
  try {
    // Load circuit files (these should be in public folder or served by backend)
    const wasmPath = '/circuits/merkle_membership.wasm';
    const zkeyPath = '/circuits/proving_key.zkey';

    // Prepare inputs
    const input = {
      identitySecret: identitySecret.toString(),
      fileId: fileId.toString(),
      orgRoot: orgRoot.toString(),
      pathElements: pathElements.map(e => e.toString()),
      pathIndices: pathIndices.map(i => i.toString())
    };

    // Generate proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    );

    return { proof, publicSignals };
  } catch (error) {
    console.error('Error generating proof:', error);
    throw new Error('Failed to generate ZK proof: ' + error.message);
  }
}

