import { ContractPromise } from '@polkadot/api-contract';

// Contract address (set after deployment)
let CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;

// Contract ABI (simplified - in production, load from contract metadata)
const CONTRACT_ABI = {
  messages: {
    get_identity_commitments: { args: ['AccountId'] },
    get_user_orgs: { args: ['AccountId'] },
    get_org_root: { args: ['u32'] },
    get_latest_verification: { args: ['AccountId', 'u32'] },
    register_identity: { args: ['[u8;32]'] },
    update_org_root: { args: ['u32', '[u8;32]'] },
    verify_proof: { args: ['u32', 'u32', '[u8;32]', '[u8;32]'] }
  }
};

export async function getUserIdentity(api, address) {
  if (!CONTRACT_ADDRESS) {
    // Return mock data if contract not deployed
    return [];
  }
  
  try {
    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    const result = await contract.query.getIdentityCommitments(
      address,
      { value: 0, gasLimit: -1 },
      address
    );
    
    return result.output?.toJSON() || [];
  } catch (error) {
    console.error('Error querying identity:', error);
    return [];
  }
}

export async function getUserOrgs(api, address) {
  if (!CONTRACT_ADDRESS) {
    return [];
  }
  
  try {
    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    const result = await contract.query.getUserOrgs(
      address,
      { value: 0, gasLimit: -1 },
      address
    );
    
    return result.output?.toJSON() || [];
  } catch (error) {
    console.error('Error querying user orgs:', error);
    return [];
  }
}

export async function getOrgRoot(api, orgId) {
  if (!api || !CONTRACT_ADDRESS) {
    // Return mock data for development
    return Buffer.from('0'.repeat(64), 'hex');
  }
  
  try {
    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    const result = await contract.query.getOrgRoot(
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // dummy address
      { value: 0, gasLimit: -1 },
      orgId
    );
    
    const root = result.output?.toJSON();
    if (root && Array.isArray(root) && root.length === 32) {
      return Buffer.from(root);
    }
    // Return mock data for development
    return Buffer.from('0'.repeat(64), 'hex');
  } catch (error) {
    console.error('Error querying org root:', error);
    // Return mock data for development
    return Buffer.from('0'.repeat(64), 'hex');
  }
}

export async function getLatestVerification(api, address, orgId) {
  if (!api || !CONTRACT_ADDRESS) {
    // Return mock data for development
    return Date.now() - 1000; // 1 second ago
  }
  
  try {
    const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS);
    const result = await contract.query.getLatestVerification(
      address,
      { value: 0, gasLimit: -1 },
      address,
      orgId
    );
    
    const timestamp = result.output?.toJSON();
    return timestamp ? timestamp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error('Error querying verification:', error);
    // Return mock data for development
    return Date.now() - 1000;
  }
}

export function setContractAddress(address) {
  CONTRACT_ADDRESS = address;
}

