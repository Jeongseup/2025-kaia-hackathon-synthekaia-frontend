"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./PortfolioTab.module.css";
import { STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS} from '@/constants/StkaiaDeltaNeutralVaultAbi'
import VaultABI from '@/constants/abis/StkaiaDeltaNeutralVault.json'
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { ethers } from 'ethers'

// Constants
const STKAIA_PRICE_IN_USDT = 0.1641; // 1 stKAIA = 0.1641 USDT

export const PortfolioTab = () => {
  const { account } = useWalletAccountStore();
  const [userShares, setUserShares] = useState<bigint>(BigInt(0));
  const [totalShares, setTotalShares] = useState<bigint>(BigInt(0));
  const [userAssetValue, setUserAssetValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user portfolio data
  const fetchUserData = useCallback(async () => {
    if (!account || !STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS) return;
    
    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      const vaultContract = new ethers.Contract(
        STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS,
        VaultABI.abi,
        provider
      );

      // Get vault status and user shares
      const [vaultStatus, userShareBalance] = await Promise.all([
        vaultContract.getVaultStatus(),
        vaultContract.balanceOf(account)
      ]);

      console.log("User Shares:", userShareBalance);
      console.log("Total Shares:", vaultStatus.totalShares);
      
      setUserShares(userShareBalance);
      setTotalShares(vaultStatus.totalShares);

      // Calculate user's asset value
      calculateUserValue(vaultStatus, userShareBalance);
      
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Calculate user's asset value
  const calculateUserValue = (vaultStatus: { 
    currentStkAIABalance: bigint;
    totalUsdtCurrentlyShorted: bigint;
    leftoverUsdtInVault: bigint;
    totalShares: bigint;
  }, userShareBalance: bigint) => {
    // Mock price data - in production, fetch from price APIs
    const shortPositionPnlMultiplier = 1.05; // 5% profit on short position

    // Convert bigint to numbers for calculation (be careful with precision)
    const stkaiaValueInUsdt = Number(vaultStatus.currentStkAIABalance) / Math.pow(10, 18) * STKAIA_PRICE_IN_USDT;
    const shortPositionValueInUsdt = Number(vaultStatus.totalUsdtCurrentlyShorted) / Math.pow(10, 6) * shortPositionPnlMultiplier;
    const leftoverUsdtValue = Number(vaultStatus.leftoverUsdtInVault) / Math.pow(10, 6);
    
    const totalVaultValueInUsdt = stkaiaValueInUsdt + shortPositionValueInUsdt + leftoverUsdtValue;

    // Calculate user's asset value
    if (vaultStatus.totalShares > 0) {
      const userShareRatio = Number(userShareBalance) / Number(vaultStatus.totalShares);
      const userAssetValueInUsdt = totalVaultValueInUsdt * userShareRatio;
      setUserAssetValue(userAssetValueInUsdt);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.portfolioContent}>
        {/* User Holdings Value */}
        <div className={styles.userValueSection}>
          <div className={styles.userValueCard}>
            <h3 className={styles.userValueTitle}>Your Portfolio Value</h3>
            <div className={styles.userValueAmount}>
              {isLoading ? "Loading..." : formatCurrency(userAssetValue)}
            </div>
            <p className={styles.userValueSubtitle}>
              Your total holdings in SyntheKaia Vault
            </p>
          </div>
        </div>

        {/* Share Information */}
        <div className={styles.shareSection}>
          <h4 className={styles.sectionTitle}>Your Share Details</h4>
          <div className={styles.shareCard}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Your Shares</span>
              <span className={styles.shareValue}>
                {userShares.toString()}
              </span>
            </div>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Your Share Ratio</span>
              <span className={styles.shareValue}>
                {totalShares > 0 
                  ? `${((Number(userShares) / Number(totalShares)) * 100).toFixed(2)}%`
                  : "0%"
                }
              </span>
            </div>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Total Shares</span>
              <span className={styles.shareValue}>
                {totalShares.toString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Withdraw Button */}
        <div className={styles.withdrawButtonContainer}>
          <button 
            className={styles.withdrawButton}
            disabled={Number(userShares) === 0}
          >
            {Number(userShares) > 0 ? "Withdraw" : "No Holdings to Withdraw"}
          </button>
          {Number(userShares) > 0 && (
            <div className={styles.comingSoonTooltip}>
              Coming Soon... 🚧
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
