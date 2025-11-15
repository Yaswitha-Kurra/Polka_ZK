import { ContractPromise } from '@polkadot/api-contract';
import { getStorage } from './storage.js';

let CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;

export function eventListener(api) {
  if (!CONTRACT_ADDRESS) {
    console.log('Contract address not set, event listener disabled');
    return;
  }
  
  console.log('Starting event listener...');
  
  // Subscribe to new blocks
  api.rpc.chain.subscribeNewHeads(async (header) => {
    try {
      // Query contract events from the block
      const blockHash = header.hash;
      const events = await api.query.system.events.at(blockHash);
      
      events.forEach((record) => {
        const { event } = record;
        
        // Check for contract events
        if (event.section === 'contracts' || event.section === 'orgRegistry') {
          handleContractEvent(event);
        }
      });
    } catch (error) {
      console.error('Error processing block events:', error);
    }
  });
}

function handleContractEvent(event) {
  const storage = getStorage();
  
  if (event.method === 'IdentityCreated') {
    const [user, commitment] = event.data;
    console.log('IdentityCreated:', user.toString(), commitment.toString());
    
    // Store identity creation
    if (!storage.identities) {
      storage.identities = {};
    }
    const address = user.toString();
    if (!storage.identities[address]) {
      storage.identities[address] = [];
    }
    storage.identities[address].push(commitment.toString());
  }
  
  if (event.method === 'OrgRootUpdated') {
    const [orgId, newRoot] = event.data;
    console.log('OrgRootUpdated:', orgId.toString(), newRoot.toString());
    
    // Update org root
    if (!storage.orgs) {
      storage.orgs = {};
    }
    const orgIdNum = parseInt(orgId.toString());
    if (!storage.orgs[orgIdNum]) {
      storage.orgs[orgIdNum] = { orgId: orgIdNum };
    }
    storage.orgs[orgIdNum].root = newRoot.toString();
  }
  
  if (event.method === 'ProofVerified') {
    const [user, orgId, fileId, timestamp] = event.data;
    console.log('ProofVerified:', user.toString(), orgId.toString(), fileId.toString());
    
    // Store verification
    if (!storage.verifications) {
      storage.verifications = {};
    }
    const key = `${user.toString()}-${orgId.toString()}-${fileId.toString()}`;
    storage.verifications[key] = {
      address: user.toString(),
      orgId: parseInt(orgId.toString()),
      fileId: parseInt(fileId.toString()),
      timestamp: parseInt(timestamp.toString()),
      verified: true
    };
  }
}

