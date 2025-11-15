import express from 'express';
import { getOrgRoot } from '../services/contractService.js';
import { getStorage } from '../services/storage.js';

const router = express.Router();

// Get organization details
router.get('/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    const api = req.app.locals.getApi();
    
    if (!api) {
      return res.status(503).json({ error: 'Polkadot API not connected' });
    }
    
    const root = await getOrgRoot(api, parseInt(orgId));
    const storage = getStorage();
    const orgData = storage.orgs[orgId] || {};
    
    res.json({
      orgId: parseInt(orgId),
      root: root ? '0x' + Buffer.from(root).toString('hex') : null,
      name: orgData.name || `Organization ${orgId}`,
      description: orgData.description || ''
    });
  } catch (error) {
    console.error('Error fetching org:', error);
    res.status(500).json({ error: error.message });
  }
});

// List available organizations
router.get('/', async (req, res) => {
  try {
    const { address } = req.query;
    const storage = getStorage();
    
    // Get orgs that are either:
    // 1. Open to everyone (no preApprovedAddresses or empty array)
    // 2. Pre-approved for this specific address
    const availableOrgs = Object.values(storage.orgs).filter(org => {
      // If org has no pre-approved addresses, it's open to everyone
      if (!org.preApprovedAddresses || org.preApprovedAddresses.length === 0) {
        return true;
      }
      // If address is provided, check if it's pre-approved
      if (address) {
        return org.preApprovedAddresses.includes(address);
      }
      // If no address provided, show all open orgs (those with no restrictions)
      return true;
    });
    
    res.json({
      orgs: availableOrgs.map(org => ({
        orgId: org.orgId,
        name: org.name,
        description: org.description
      }))
    });
  } catch (error) {
    console.error('Error listing orgs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Join organization (off-chain registration)
router.post('/join', async (req, res) => {
  try {
    const { orgId, identityCommitment } = req.body;
    const storage = getStorage();
    
    if (!storage.orgs[orgId]) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    // Add identity commitment to org's Merkle tree
    if (!storage.orgs[orgId].members) {
      storage.orgs[orgId].members = [];
    }
    
    if (!storage.orgs[orgId].members.includes(identityCommitment)) {
      storage.orgs[orgId].members.push(identityCommitment);
    }
    
    res.json({
      success: true,
      orgId,
      message: 'Successfully joined organization'
    });
  } catch (error) {
    console.error('Error joining org:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as orgRoutes };

