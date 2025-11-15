import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function SelectOrg() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (account) {
      loadUserOrgs();
    }
  }, [account]);

  const loadUserOrgs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/orgs/${account.address}`);
      setOrgs(response.data.orgs || []);
    } catch (err) {
      console.error('Error loading orgs:', err);
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = async (orgId) => {
    // Store selected org in localStorage
    localStorage.setItem('selectedOrgId', orgId.toString());
    navigate('/generate-proof');
  };

  if (!account) {
    return (
      <div className="container">
        <div className="card">
          <p>Please connect your wallet first.</p>
          <button className="btn" onClick={() => navigate('/')}>
            Go to Landing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Your Organizations</h1>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading organizations...</div>
        ) : orgs.length === 0 ? (
          <div>
            <p style={{ marginBottom: '1rem' }}>You haven't joined any organizations yet.</p>
            <button className="btn" onClick={() => navigate('/join-org')}>
              Join an Organization
            </button>
          </div>
        ) : (
          <div>
            <div className="org-list">
              {orgs.map((orgId) => (
                <div 
                  key={orgId} 
                  className="org-card"
                  onClick={() => handleSelectOrg(orgId)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>Organization {orgId}</h3>
                  <p style={{ color: '#666' }}>Click to access files</p>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/join-org')}
              style={{ marginTop: '1rem' }}
            >
              Join Another Organization
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectOrg;

