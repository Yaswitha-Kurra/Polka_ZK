import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { verifyProofOnChain } from '../utils/contract';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function VerifyProof() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proofData, setProofData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentProof');
    if (stored) {
      setProofData(JSON.parse(stored));
    } else {
      navigate('/generate-proof');
    }
  }, [navigate]);

  const hashProof = (proof) => {
    // Simple hash of proof (in production, use proper hashing)
    return Buffer.from(JSON.stringify(proof)).toString('hex').slice(0, 64);
  };

  const handleVerifyProof = async () => {
    if (!account || !proofData) {
      setError('Missing account or proof data');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Hash proof and public signals
      const proofHash = hashProof(proofData.proof);
      const publicSignalsHash = hashProof(proofData.publicSignals);

      // Submit verification to backend (which will call contract)
      await axios.post(`${API_URL}/access/request`, {
        proof: proofData.proof,
        publicSignals: proofData.publicSignals,
        orgId: proofData.orgId,
        fileId: proofData.fileId,
        address: account.address
      });

      // Also submit on-chain transaction
      await verifyProofOnChain(
        account,
        proofData.orgId,
        proofData.fileId,
        proofHash,
        publicSignalsHash
      );

      // Clear proof data
      localStorage.removeItem('currentProof');

      // Navigate to view files
      navigate('/view-files');
    } catch (err) {
      console.error('Error verifying proof:', err);
      setError(err.response?.data?.error || err.message || 'Failed to verify proof');
    } finally {
      setLoading(false);
    }
  };

  if (!proofData) {
    return <div className="loading">Loading proof data...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Verify Proof On-Chain</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Sign a transaction to verify your zero-knowledge proof on-chain.
          This proves your membership without revealing your identity.
        </p>

        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <p><strong>Organization:</strong> {proofData.orgId}</p>
          <p><strong>File ID:</strong> {proofData.fileId}</p>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <p>Submitting verification transaction...</p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>
              Please approve the transaction in your wallet
            </p>
          </div>
        ) : (
          <div>
            <button className="btn" onClick={handleVerifyProof}>
              Sign & Verify Proof
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/generate-proof')}
              style={{ marginLeft: '1rem' }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyProof;

