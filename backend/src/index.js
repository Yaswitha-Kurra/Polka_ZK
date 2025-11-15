import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { userRoutes } from './routes/user.js';
import { orgRoutes } from './routes/org.js';
import { accessRoutes } from './routes/access.js';
import { fileRoutes } from './routes/file.js';
import { eventListener } from './services/eventListener.js';
import { initStorage } from './services/storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize storage
initStorage();

// Routes
app.use('/user', userRoutes);
app.use('/org', orgRoutes);
app.use('/access', accessRoutes);
app.use('/file', fileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Initialize Polkadot API connection
let api = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

async function initPolkadot() {
  const wsUrl = process.env.POLKADOT_WS_URL || 'ws://127.0.0.1:9944';
  
  // If no contract address is set, skip connection (development mode)
  if (!process.env.CONTRACT_ADDRESS) {
    console.log('⚠️  No CONTRACT_ADDRESS set - running in development mode without Polkadot connection');
    console.log('   The backend will use mock data. Set CONTRACT_ADDRESS to connect to a deployed contract.');
    return;
  }

  try {
    const wsProvider = new WsProvider(wsUrl);
    
    // Set up connection error handler to prevent spam
    wsProvider.on('error', (error) => {
      connectionAttempts++;
      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        console.warn(`⚠️  Failed to connect to Polkadot node after ${MAX_CONNECTION_ATTEMPTS} attempts`);
        console.warn('   Running in development mode without blockchain connection');
        console.warn('   To connect: Start a local Polkadot node or set POLKADOT_WS_URL to a remote node');
        wsProvider.disconnect();
      }
    });

    api = await Promise.race([
      ApiPromise.create({ provider: wsProvider }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);
    
    console.log('✅ Connected to Polkadot node');
    
    // Start event listener
    eventListener(api);
  } catch (error) {
    console.warn('⚠️  Failed to connect to Polkadot node:', error.message);
    console.warn('   Running in development mode without blockchain connection');
    console.warn('   The backend will use mock data for contract queries');
  }
}

// Store API instance for routes
app.locals.getApi = () => api;

app.listen(PORT, async () => {
  console.log(`Backend server running on port ${PORT}`);
  await initPolkadot();
});

export { app };

