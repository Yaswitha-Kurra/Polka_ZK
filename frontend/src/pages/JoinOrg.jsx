import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function JoinOrg() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [orgCode, setOrgCode] = useState('');
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasBadge, setHasBadge] = useState(false);

  useEffect(() => {
    if (!account) {
      navigate('/');
      return;
    }

    // Check if user has a badge
    const identities = JSON.parse(localStorage.getItem('identities') || '{}');
    const userIdentities = identities[account.address] || [];
    const badgeExists = userIdentities.length > 0;
    setHasBadge(badgeExists);

    if (!badgeExists) {
      setError('You need to create a ZK Badge first before joining organizations.');
    } else {
      loadAvailableOrgs();
    }
  }, [account, navigate]);

  const loadAvailableOrgs = async () => {
    try {
      const response = await axios.get(`${API_URL}/org`, {
        params: { address: account?.address }
      });
      setAvailableOrgs(response.data.orgs);
    } catch (err) {
      console.error('Error loading orgs:', err);
    }
  };

  const handleJoinByCode = async () => {
    if (!orgCode) {
      setError('Please enter an organization code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's identity commitment
      const identities = JSON.parse(localStorage.getItem('identities') || '{}');
      const userIdentities = identities[account.address] || [];
      
      if (userIdentities.length === 0) {
        setError('No identity badge found. Please create one first.');
        return;
      }

      const identityCommitment = userIdentities[0].identityCommitment;

      // Join organization
      await axios.post(`${API_URL}/org/join`, {
        orgId: parseInt(orgCode),
        identityCommitment
      });

      alert('Successfully joined organization!');
      navigate('/select-org');
    } catch (err) {
      console.error('Error joining org:', err);
      setError(err.response?.data?.error || 'Failed to join organization');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrg = async (orgId) => {
    try {
      setLoading(true);
      setError(null);

      const identities = JSON.parse(localStorage.getItem('identities') || '{}');
      const userIdentities = identities[account.address] || [];
      
      if (userIdentities.length === 0) {
        setError('No identity badge found. Please create one first.');
        return;
      }

      const identityCommitment = userIdentities[0].identityCommitment;

      await axios.post(`${API_URL}/org/join`, {
        orgId,
        identityCommitment
      });

      alert('Successfully joined organization!');
      navigate('/select-org');
    } catch (err) {
      console.error('Error joining org:', err);
      setError(err.response?.data?.error || 'Failed to join organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Join an Organization</h1>

        {error && (
          <div className="error">
            {error}
            {!hasBadge && (
              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn" 
                  onClick={() => navigate('/create-badge')}
                  style={{ marginTop: '0.5rem' }}
                >
                  Create ZK Badge
                </button>
              </div>
            )}
          </div>
        )}

        {hasBadge ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Enter Organization Code</h2>
              <input
                type="text"
                className="input"
                placeholder="Enter org code (e.g., 1, 2, 3)"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value)}
                disabled={loading}
              />
              <button 
                className="btn" 
                onClick={handleJoinByCode}
                disabled={loading || !orgCode}
              >
                {loading ? 'Joining...' : 'Join Organization'}
              </button>
            </div>

            <div>
              <h2 style={{ marginBottom: '1rem' }}>Available Organizations</h2>
              {availableOrgs.length === 0 ? (
                <p style={{ color: '#666' }}>No organizations available</p>
              ) : (
                <div className="org-list">
                  {availableOrgs.map((org) => (
                    <div key={org.orgId} className="org-card">
                      <h3>{org.name}</h3>
                      <p style={{ color: '#666', marginBottom: '1rem' }}>{org.description}</p>
                      <button
                        className="btn"
                        onClick={() => handleJoinOrg(org.orgId)}
                        disabled={loading}
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              You need to create a ZK Badge first to join organizations.
            </p>
            <button 
              className="btn" 
              onClick={() => navigate('/create-badge')}
            >
              Create ZK Badge
            </button>
          </div>
        )}

        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/select-org')}
          style={{ marginTop: '2rem' }}
        >
          Back to Organizations
        </button>
      </div>
    </div>
  );
}

export default JoinOrg;

