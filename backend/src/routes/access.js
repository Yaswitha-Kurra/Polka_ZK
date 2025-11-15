import express from 'express';
import { verifyProof } from '../services/proofVerifier.js';
import { getStorage } from '../services/storage.js';
import { getOrgRoot } from '../services/contractService.js';

const router = express.Router();

// Request access by submitting ZK proof
router.post('/request', async (req, res) => {
  try {
    const { proof, publicSignals, orgId, fileId, address } = req.body;
    
    if (!proof || !publicSignals || !orgId || !fileId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify the ZK proof
    const isValid = await verifyProof(proof, publicSignals);
    
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid proof' });
    }
    
    // Check org root matches
    const api = req.app.locals.getApi();
    const orgRoot = await getOrgRoot(api, orgId);
    
    if (!orgRoot) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    // Store verification (in production, this would be on-chain)
    const storage = getStorage();
    if (!storage.verifications) {
      storage.verifications = {};
    }
    
    const key = `${address}-${orgId}-${fileId}`;
    storage.verifications[key] = {
      address,
      orgId,
      fileId,
      timestamp: Date.now(),
      verified: true
    };
    
    res.json({
      success: true,
      verified: true,
      orgId,
      fileId,
      message: 'Access granted'
    });
  } catch (error) {
    console.error('Error verifying access:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as accessRoutes };

