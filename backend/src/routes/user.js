import express from 'express';
import { getUserIdentity } from '../services/contractService.js';

const router = express.Router();

// Check if user has ZK Identity Badge
router.get('/identity/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const api = req.app.locals.getApi();
    
    if (!api) {
      return res.status(503).json({ error: 'Polkadot API not connected' });
    }
    
    const commitments = await getUserIdentity(api, address);
    
    res.json({
      address,
      hasIdentity: commitments.length > 0,
      commitments: commitments.map(c => '0x' + Buffer.from(c).toString('hex'))
    });
  } catch (error) {
    console.error('Error checking identity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's organizations
router.get('/orgs/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const api = req.app.locals.getApi();
    
    if (!api) {
      return res.status(503).json({ error: 'Polkadot API not connected' });
    }
    
    // Query contract for user's orgs
    const orgs = await getUserOrgs(api, address);
    
    res.json({
      address,
      orgs
    });
  } catch (error) {
    console.error('Error fetching user orgs:', error);
    res.status(500).json({ error: error.message });
  }
});

async function getUserOrgs(api, address) {
  // This would call the contract's get_user_orgs function
  // For now, return mock data
  return [1, 2, 3]; // Mock org IDs
}

export { router as userRoutes };

