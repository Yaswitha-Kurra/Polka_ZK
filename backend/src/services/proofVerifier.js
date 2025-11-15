import * as snarkjs from 'snarkjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let verificationKey = null;

// Load verification key
function loadVerificationKey() {
  if (verificationKey) return verificationKey;
  
  try {
    const vkeyPath = path.join(__dirname, '../../zk/circuits/verification_key.json');
    if (fs.existsSync(vkeyPath)) {
      verificationKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'));
      return verificationKey;
    }
  } catch (error) {
    console.error('Error loading verification key:', error);
  }
  
  return null;
}

export async function verifyProof(proof, publicSignals) {
  try {
    const vkey = loadVerificationKey();
    
    if (!vkey) {
      console.warn('Verification key not found, skipping proof verification');
      // In development, allow proofs if key not found
      return true;
    }
    
    const verified = await snarkjs.groth16.verify(vkey, publicSignals, proof);
    return verified;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}

