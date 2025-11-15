import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function Landing() {
  const navigate = useNavigate();
  const { account, connectWallet, isConnecting } = useWallet();
  const [checking, setChecking] = React.useState(false);

  const handleConnect = async () => {
    try {
      const connectedAccount = await connectWallet();
      
      // Send wallet address to backend
      setChecking(true);
      await axios.post(`${API_URL}/user/identity/${connectedAccount.address}`);
      
      // Check if user has identity
      const response = await axios.get(`${API_URL}/user/identity/${connectedAccount.address}`);
      
      if (response.data.hasIdentity) {
        // User has badge, go to org selection
        navigate('/select-org');
      } else {
        // New user, create badge
        navigate('/create-badge');
      }
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '5rem auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
          🔐 Polkadot ZK Access Control
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Join organizations and access private files with zero-knowledge proofs
        </p>
        
        {!account ? (
          <button
            className="btn"
            onClick={handleConnect}
            disabled={isConnecting || checking}
          >
            {isConnecting || checking ? 'Connecting...' : 'Connect Polkadot Wallet'}
          </button>
        ) : (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              Connected: {account.address.slice(0, 10)}...{account.address.slice(-8)}
            </p>
            <button className="btn" onClick={() => navigate('/select-org')}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;

