import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function DownloadFile() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFile();
  }, [token]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/file/download/${token}`);
      setFile(response.data);
    } catch (err) {
      console.error('Error loading file:', err);
      setError(err.response?.data?.error || 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading file...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">{error}</div>
          <button className="btn" onClick={() => navigate('/select-org')}>
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>File Download</h1>
        
        {file && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Organization:</strong> {file.orgId}</p>
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {file.content}
              </pre>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Note: In production, this would download the actual file.
            </p>

            <button className="btn" onClick={() => navigate('/select-org')}>
              Back to Organizations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DownloadFile;

