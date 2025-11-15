import express from 'express';
import jwt from 'jsonwebtoken';
import { getStorage } from '../services/storage.js';
import { getLatestVerification } from '../services/contractService.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Get files available for an organization
router.get('/list/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }
    
    // Check if user has verified access
    const api = req.app.locals.getApi();
    const verification = await getLatestVerification(api, address, parseInt(orgId));
    
    if (!verification) {
      return res.status(403).json({ error: 'No verified access found' });
    }
    
    // Check if verification is recent (within last hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (verification < oneHourAgo) {
      return res.status(403).json({ error: 'Verification expired' });
    }
    
    const storage = getStorage();
    const orgFiles = storage.files[orgId] || [];
    
    res.json({
      orgId: parseInt(orgId),
      files: orgFiles.map(file => ({
        fileId: file.fileId,
        name: file.name,
        size: file.size,
        type: file.type
      }))
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate signed download URL
router.post('/download-token', async (req, res) => {
  try {
    const { orgId, fileId, address } = req.body;
    
    if (!orgId || !fileId || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify access
    const api = req.app.locals.getApi();
    const verification = await getLatestVerification(api, address, parseInt(orgId));
    
    if (!verification) {
      return res.status(403).json({ error: 'No verified access' });
    }
    
    // Generate signed token
    const token = jwt.sign(
      {
        orgId: parseInt(orgId),
        fileId: parseInt(fileId),
        address,
        exp: Math.floor(Date.now() / 1000) + 300 // 5 minutes
      },
      JWT_SECRET
    );
    
    res.json({
      token,
      url: `/file/download/${token}`
    });
  } catch (error) {
    console.error('Error generating download token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download file with signed token
router.get('/download/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    const { orgId, fileId } = decoded;
    
    // Get file info
    const storage = getStorage();
    const orgFiles = storage.files[orgId] || [];
    const file = orgFiles.find(f => f.fileId === fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // In production, serve actual file from storage
    // For now, return file info
    res.json({
      fileId,
      orgId,
      name: file.name,
      content: file.content || 'Sample file content',
      message: 'File download (implement actual file serving)'
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as fileRoutes };

