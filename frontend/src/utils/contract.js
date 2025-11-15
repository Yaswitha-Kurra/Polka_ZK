import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';

// Contract address (set after deployment)
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || null;

// Contract ABI (simplified)
const CONTRACT_ABI = {
  messages: {
    register_identity: { args: ['[u8;32]'] },
    verify_proof: { args: ['u32', 'u32', '[u8;32]', '[u8;32]'] }
  }
};

// Convert hex string to Uint8Array
function hexToU8a(hex) {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

// Convert BigInt to 32-byte array
function bigIntToBytes32(value) {
  const hex = value.toString(16).padStart(64, '0');
  return hexToU8a(hex);
}

export async function registerIdentityOnChain(account, identityCommitment) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not set');
  }

  try {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider: wsProvider });

    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    
    // Convert commitment to bytes
    const commitmentBytes = bigIntToBytes32(identityCommitment);

    // Get injector
    const injector = await web3FromAddress(account.address);

    // Submit transaction
    await contract.tx
      .registerIdentity(
        { value: 0, gasLimit: -1 },
        commitmentBytes
      )
      .signAndSend(account.address, { signer: injector.signer });

    await api.disconnect();
  } catch (error) {
    console.error('Error registering identity:', error);
    throw error;
  }
}

export async function verifyProofOnChain(account, orgId, fileId, proofHash, publicSignalsHash) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not set');
  }

  try {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider: wsProvider });

    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    
    // Convert hashes to bytes
    const proofHashBytes = hexToU8a(proofHash);
    const signalsHashBytes = hexToU8a(publicSignalsHash);

    // Get injector
    const injector = await web3FromAddress(account.address);

    // Submit transaction
    await contract.tx
      .verifyProof(
        { value: 0, gasLimit: -1 },
        orgId,
        fileId,
        proofHashBytes,
        signalsHashBytes
      )
      .signAndSend(account.address, { signer: injector.signer });

    await api.disconnect();
  } catch (error) {
    console.error('Error verifying proof:', error);
    throw error;
  }
}

