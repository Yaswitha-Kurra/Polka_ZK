import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { generateZKProof } from '../utils/zk';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function GenerateProof() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState(null);

  useEffect(() => {
    const selectedOrgId = localStorage.getItem('selectedOrgId');
    if (selectedOrgId) {
      setOrgId(parseInt(selectedOrgId));
    } else {
      navigate('/select-org');
    }
  }, [navigate]);

  const handleGenerateProof = async () => {
    if (!account || !orgId) {
      setError('Missing account or organization');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get identity secret
      const identities = JSON.parse(localStorage.getItem('identities') || '{}');
      const userIdentities = identities[account.address] || [];
      
      if (userIdentities.length === 0) {
        setError('No identity badge found');
        return;
      }

      const identitySecret = BigInt(userIdentities[0].identitySecret);

      // Get org root from chain
      const orgResponse = await axios.get(`${API_URL}/org/${orgId}`);
      const orgRoot = BigInt(orgResponse.data.root);

      // Get Merkle path (in production, fetch from backend)
      // For now, use mock path
      const pathElements = Array(20).fill(0).map(() => BigInt(0));
      const pathIndices = Array(20).fill(0);
      const fileId = BigInt(1);

      // Generate ZK proof
      const { proof: generatedProof, publicSignals: generatedSignals } = 
        await generateZKProof(identitySecret, fileId, orgRoot, pathElements, pathIndices);

      setProof(generatedProof);
      setPublicSignals(generatedSignals);

      // Store proof data
      localStorage.setItem('currentProof', JSON.stringify({
        proof: generatedProof,
        publicSignals: generatedSignals,
        orgId,
        fileId: fileId.toString()
      }));

      navigate('/verify-proof');
    } catch (err) {
      console.error('Error generating proof:', err);
      setError(err.message || 'Failed to generate proof');
    } finally {
      setLoading(false);
    }
  };

  if (!orgId) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Generate ZK Proof</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Generate a zero-knowledge proof to prove your membership in Organization {orgId}
          without revealing your identity.
        </p>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <p>Generating zero-knowledge proof...</p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>
              This may take a few seconds
            </p>
          </div>
        ) : (
          <div>
            <button className="btn" onClick={handleGenerateProof}>
              Generate Proof
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/select-org')}
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

export default GenerateProof;

