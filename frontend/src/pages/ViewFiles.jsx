import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function ViewFiles() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [orgId, setOrgId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const selectedOrgId = localStorage.getItem('selectedOrgId');
    if (selectedOrgId) {
      setOrgId(parseInt(selectedOrgId));
      loadFiles(parseInt(selectedOrgId));
    } else {
      navigate('/select-org');
    }
  }, [navigate]);

  const loadFiles = async (org) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/file/list/${org}`, {
        params: { address: account?.address }
      });
      setFiles(response.data.files || []);
    } catch (err) {
      console.error('Error loading files:', err);
      setError(err.response?.data?.error || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.post(`${API_URL}/file/download-token`, {
        orgId,
        fileId,
        address: account.address
      });

      // Navigate to download page
      navigate(`/download/${response.data.token}`);
    } catch (err) {
      console.error('Error getting download token:', err);
      alert(err.response?.data?.error || 'Failed to get download link');
    }
  };

  if (!orgId) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Files - Organization {orgId}</h1>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading files...</div>
        ) : files.length === 0 ? (
          <p style={{ color: '#666' }}>No files available for this organization.</p>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.fileId} className="file-item">
                <div>
                  <strong>{file.name}</strong>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {file.size} bytes • {file.type}
                  </p>
                </div>
                <button 
                  className="btn" 
                  onClick={() => handleDownload(file.fileId)}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
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

export default ViewFiles;

