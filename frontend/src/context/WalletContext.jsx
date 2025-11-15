import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const WalletContext = createContext();

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const extensions = await web3Enable('Polkadot ZK Access');
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found');
      }
      
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found in extension');
      }
      
      setAccounts(allAccounts);
      setAccount(allAccounts[0]);
      
      // Store in localStorage
      localStorage.setItem('selectedAccount', allAccounts[0].address);
      
      return allAccounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAccounts([]);
    localStorage.removeItem('selectedAccount');
  };

  useEffect(() => {
    // Try to restore account from localStorage
    const savedAddress = localStorage.getItem('selectedAccount');
    if (savedAddress) {
      connectWallet().then((acc) => {
        if (acc && acc.address === savedAddress) {
          setAccount(acc);
        }
      }).catch(() => {
        // Ignore errors on restore
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        accounts,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

