import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Landing from './pages/Landing';
import CreateBadge from './pages/CreateBadge';
import JoinOrg from './pages/JoinOrg';
import SelectOrg from './pages/SelectOrg';
import GenerateProof from './pages/GenerateProof';
import VerifyProof from './pages/VerifyProof';
import ViewFiles from './pages/ViewFiles';
import DownloadFile from './pages/DownloadFile';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-badge" element={<CreateBadge />} />
          <Route path="/join-org" element={<JoinOrg />} />
          <Route path="/select-org" element={<SelectOrg />} />
          <Route path="/generate-proof" element={<GenerateProof />} />
          <Route path="/verify-proof" element={<VerifyProof />} />
          <Route path="/view-files" element={<ViewFiles />} />
          <Route path="/download/:token" element={<DownloadFile />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;

