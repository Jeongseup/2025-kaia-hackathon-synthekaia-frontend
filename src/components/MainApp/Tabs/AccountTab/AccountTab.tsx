"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./AccountTab.module.css";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk } from "@/components/Wallet/Sdk/walletSdk.hooks";
import { MOCK_USDT_ADDRESS } from '@/constants/MockUSDTAbi';
import { microUSDTHexToUSDTDecimal } from "@/utils/format";

export const AccountTab = () => {
  const { account } = useWalletAccountStore();
  const { getErc20TokenBalance } = useKaiaWalletSdk();
  const [kaiaBalance, setKaiaBalance] = useState<string>('0.00');
  const [usdtBalance, setUsdtBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Show toast function
  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Faucet USDT
  const faucetUSDT = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      console.log(`Faucet 100 USDT to your wallet...`);
      
      // Call API route instead of direct contract interaction
      const response = await fetch('/api/faucet/usdt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Faucet request failed');
      }

      console.log("Faucet transaction confirmed successfully!", result);
      
      // Refresh USDT balance after successful mint
      await fetchUSDTBalance();
      
    } catch (error) {
      console.error("Faucet failed:", error);
      throw error;
    }
  };

  // Fetch KAIA balance
  const fetchKaiaBalance = useCallback(async () => {
    if (!account) return;
    
    try {
      // Mock KAIA balance fetch - replace with actual implementation
      setKaiaBalance('0.15');
    } catch (error) {
      console.error("Failed to fetch KAIA balance:", error);
      setKaiaBalance('0.00');
    }
  }, [account]);

  // Fetch USDT balance
  const fetchUSDTBalance = useCallback(async () => {
    if (!account || !MOCK_USDT_ADDRESS) return;
    
    try {
      const balance = await getErc20TokenBalance(MOCK_USDT_ADDRESS, account);
      const formattedBalance = Number(microUSDTHexToUSDTDecimal(balance as string)).toFixed(2);
      setUsdtBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch USDT balance:", error);
      setUsdtBalance('0.00');
    }
  }, [account, getErc20TokenBalance]);

  // Fetch all balances
  const fetchBalances = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchKaiaBalance(),
      fetchUSDTBalance()
    ]);
    setIsLoading(false);
  }, [fetchKaiaBalance, fetchUSDTBalance]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Faucet handlers (to be implemented)
  const handleKaiaFaucet = () => {
    console.log("KAIA Faucet requested");
    // Official Kaia Faucet: https://www.kaia.io/faucet
    // - Provides 50 KAIA tokens on Kairos Testnet
    // - Rate limit: Once every 24 hours
    // - Requires wallet address input
    
    // Option 1: Redirect to official faucet
    window.open('https://www.kaia.io/faucet', '_blank');
    
    // Option 2: Implement custom faucet API call
    // TODO: Implement direct API integration with Kaia faucet
  };

  const formatCurrency = (value: string, symbol: string) => {
    return `${value} ${symbol}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.accountContent}>
        {/* My Wallet Section */}
        <div className={styles.walletSection}>
          <div className={styles.walletCard}>
            <h3 className={styles.walletTitle}>Total Balance</h3>
            <div className={styles.walletAmount}>
              ${(parseFloat(kaiaBalance) * 0.15 + parseFloat(usdtBalance) * 1).toFixed(2)}
            </div>
            <p className={styles.walletSubtitle}>Your wallet balance</p>
          </div>
        </div>

        {/* My Assets Section */}
        <div className={styles.assetsSection}>
          <div className={styles.assetsHeader}>
            <h4 className={styles.assetsTitle}>My Assets</h4>
            <button className={styles.viewAllButton}>View All</button>
          </div>

          <div className={styles.assetsList}>
            {/* KAIA Asset */}
            <div className={styles.assetItem}>
              <div className={styles.assetInfo}>
                <div className={styles.assetIcon}>
                  <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <circle fill="#040404" cx="256" cy="256" r="256"/>
                    <path fill="#BFF007" d="M258.7,180.3c0-12,9.8-21.7,21.8-21.7h39.1v-52.9h-39.1c-41.4,0-75,33.4-75,74.6c0,10.7,2.3,21,6.4,30.2
                      c-32.2,13.5-53.5,42.3-58.5,78.7c-5.8,39.9,10.3,83,45.3,103.9c31.3,19.6,80.1,18.3,106.5-8.9v18h54.4V202h-79.1
                      C268.5,202,258.7,192.3,258.7,180.3 M306.5,254.9v50.2c-0.1,27.8-22.7,50.3-50.5,50.2c-27.8,0.1-50.4-22.4-50.5-50.2
                      c0.1-27.8,22.7-50.3,50.5-50.2H306.5z"/>
                  </svg>
                </div>
                <div className={styles.assetDetails}>
                  <div className={styles.assetName}>KAIA</div>
                  <div className={styles.assetPrice}>$0.15</div>
                </div>
              </div>
              <div className={styles.assetBalance}>
                <div className={styles.assetValue}>
                  ${(parseFloat(kaiaBalance) * 0.15).toFixed(2)}
                </div>
                <div className={styles.assetAmount}>
                  {isLoading ? "Loading..." : formatCurrency(kaiaBalance, "KAIA")}
                </div>
              </div>
            </div>

            {/* USDT Asset */}
            <div className={styles.assetItem}>
              <div className={styles.assetInfo}>
                <div className={styles.assetIcon}>
                  <svg width="32" height="32" viewBox="0 0 339.43 295.27">
                    <path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" fill="#50af95"/>
                    <path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" fill="#fff"/>
                  </svg>
                </div>
                <div className={styles.assetDetails}>
                  <div className={styles.assetName}>USDT</div>
                  <div className={styles.assetPrice}>$1</div>
                </div>
              </div>
              <div className={styles.assetBalance}>
                <div className={styles.assetValue}>
                  ${parseFloat(usdtBalance).toFixed(2)}
                </div>
                <div className={styles.assetAmount}>
                  {isLoading ? "Loading..." : formatCurrency(usdtBalance, "USDT")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faucet Section */}
        <div className={styles.faucetSection}>
          <h4 className={styles.faucetTitle}>Test Faucets</h4>
          <p className={styles.faucetDescription}>
            Get test tokens for testing the application
          </p>
          
          <div className={styles.faucetButtons}>
            <button 
              className={styles.faucetButton}
              onClick={handleKaiaFaucet}
              disabled={!account}
            >
              <div className={styles.faucetButtonIcon}>💧</div>
              <div className={styles.faucetButtonText}>
                <div className={styles.faucetButtonLabel}>Faucet KAIA</div>
                <div className={styles.faucetButtonDesc}>Get 50 KAIA tokens (24h limit)</div>
              </div>
            </button>
            
                <button 
                  className={styles.faucetButton}
                  onClick={async () => {
                    try {
                      await faucetUSDT();
                      showToastMessage("Successfully received 100 USDT!", "success");
                    } catch (error) {
                      console.error("USDT Faucet failed:", error);
                      showToastMessage(error instanceof Error ? error.message : 'Unknown error', "error");
                    }
                  }}
                  disabled={!account}
                >
              <div className={styles.faucetButtonIcon}>💧</div>
              <div className={styles.faucetButtonText}>
                <div className={styles.faucetButtonLabel}>Faucet USDT</div>
                <div className={styles.faucetButtonDesc}>Get test USDT tokens</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className={`${styles.toast} ${styles[toastType]}`}>
          <div className={styles.toastIcon}>
            {toastType === 'success' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            )}
          </div>
          <span className={styles.toastText}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
