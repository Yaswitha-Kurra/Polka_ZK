import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { generateIdentitySecret, computeIdentityCommitment } from '../utils/zk';
import { registerIdentityOnChain } from '../utils/contract';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function CreateBadge() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleCreateBadge = async () => {
    if (!account) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Generate identity secret
      setStep(1);
      const identitySecret = generateIdentitySecret();
      
      // Step 2: Compute identity commitment
      setStep(2);
      const identityCommitment = await computeIdentityCommitment(identitySecret);
      
      // Step 3: Store identity secret locally
      setStep(3);
      const identities = JSON.parse(localStorage.getItem('identities') || '{}');
      if (!identities[account.address]) {
        identities[account.address] = [];
      }
      identities[account.address].push({
        identitySecret: identitySecret.toString(),
        identityCommitment: identityCommitment.toString(),
        createdAt: Date.now()
      });
      localStorage.setItem('identities', JSON.stringify(identities));
      
      // Step 4: Submit on-chain transaction
      setStep(4);
      await registerIdentityOnChain(account, identityCommitment);
      
      // Success!
      navigate('/select-org');
    } catch (err) {
      console.error('Error creating badge:', err);
      setError(err.message || 'Failed to create badge');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Generating identity secret...',
    'Computing identity commitment...',
    'Storing identity locally...',
    'Submitting on-chain transaction...'
  ];

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Create your ZK Badge</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Generate a zero-knowledge identity badge to join organizations anonymously.
        </p>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <p>{steps[step - 1]}</p>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(step / 4) * 100}%`,
                  height: '100%',
                  background: '#667eea',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1.5rem' }}>
              Your identity secret will be generated and stored securely in your browser.
              It will never be sent to the server.
            </p>
            <button className="btn" onClick={handleCreateBadge}>
              Create ZK Badge
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/')}
              style={{ marginLeft: '1rem' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateBadge;

