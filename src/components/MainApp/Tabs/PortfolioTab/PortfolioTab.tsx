"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./PortfolioTab.module.css";
import { STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS} from '@/constants/StkaiaDeltaNeutralVaultAbi'
import VaultABI from '@/constants/abis/StkaiaDeltaNeutralVault.json'
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { ethers } from 'ethers'

interface VaultStatus {
  totalUsdtEverDeposited: bigint;
  totalUsdtCurrentlyShorted: bigint;
  currentStkAIABalance: bigint;
  totalShares: bigint;
  leftoverUsdtInVault: bigint;
}

// Constants
const STKAIA_PRICE_IN_USDT = 0.1641; // 1 stKAIA = 0.1641 USDT

export const PortfolioTab = () => {
  const { account } = useWalletAccountStore();
  const [vaultStatus, setVaultStatus] = useState<VaultStatus | null>(null);
  const [userShares, setUserShares] = useState<bigint>(BigInt(0));
  const [totalVaultValue, setTotalVaultValue] = useState<number>(0);
  const [userAssetValue, setUserAssetValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch vault status and user data
  const fetchVaultData = useCallback(async () => {
    if (!account || !STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS) return;
    
    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      const vaultContract = new ethers.Contract(
        STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS,
        VaultABI.abi,
        provider
      );

      // Get vault status using getVaultStatus() function
      const vaultStatus = await vaultContract.getVaultStatus();
      
      const status: VaultStatus = {
        totalUsdtEverDeposited: vaultStatus.totalUsdtEverDeposited,
        totalUsdtCurrentlyShorted: vaultStatus.totalUsdtCurrentlyShorted,
        currentStkAIABalance: vaultStatus.currentStkAIABalance,
        totalShares: vaultStatus.totalShares,
        leftoverUsdtInVault: vaultStatus.leftoverUsdtInVault,
      };

      console.log("Total USDT Ever Deposited:", status.totalUsdtEverDeposited);
      console.log("Total USDT Currently Shorted:", status.totalUsdtCurrentlyShorted);
      console.log("Current stKAIA Balance:", status.currentStkAIABalance);
      console.log("Total Shares:", status.totalShares);
      console.log("Leftover USDT in Vault:", status.leftoverUsdtInVault);

      // Get user shares
      const shares = await vaultContract.balanceOf(account);
      console.log("User Shares:", shares);
      
      setVaultStatus(status);
      setUserShares(shares);

      // Calculate TVL and user value (simplified version)
      calculateVaultValue(status, shares);
      
    } catch (error) {
      console.error("Failed to fetch vault data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Calculate vault total value and user asset value
  const calculateVaultValue = (status: VaultStatus, userShareBalance: bigint) => {
    // Mock price data - in production, fetch from price APIs
    const shortPositionPnlMultiplier = 1.05; // 5% profit on short position

    // Convert bigint to numbers for calculation (be careful with precision)
    const stkaiaValueInUsdt = Number(status.currentStkAIABalance) / Math.pow(10, 18) * STKAIA_PRICE_IN_USDT;
    const shortPositionValueInUsdt = Number(status.totalUsdtCurrentlyShorted) / Math.pow(10, 6) * shortPositionPnlMultiplier;
    const leftoverUsdtValue = Number(status.leftoverUsdtInVault) / Math.pow(10, 6);
    
    const totalVaultValueInUsdt = stkaiaValueInUsdt + shortPositionValueInUsdt + leftoverUsdtValue;
    setTotalVaultValue(totalVaultValueInUsdt);

    // Calculate user's asset value
    if (status.totalShares > 0) {
      const userShareRatio = Number(userShareBalance) / Number(status.totalShares);
      const userAssetValueInUsdt = totalVaultValueInUsdt * userShareRatio;
      setUserAssetValue(userAssetValueInUsdt);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: bigint, decimals: number) => {
    return (Number(value) / Math.pow(10, decimals)).toFixed(4);
  };

  return (
    <div className={styles.container}>
      <div className={styles.portfolioContent}>
        {/* 1. Vault Total Value (TVL) */}
        <div className={styles.tvlSection}>
          <div className={styles.tvlCard}>
            <h3 className={styles.tvlTitle}>Vault Total Value Locked (TVL)</h3>
            <div className={styles.tvlAmount}>
              {isLoading ? "Loading..." : formatCurrency(totalVaultValue)}
            </div>
            <p className={styles.tvlSubtitle}>SyntheKaia Delta Neutral Vault</p>
          </div>
        </div>

        {/* Vault Statistics */}
        <div className={styles.statisticsSection}>
          <h4 className={styles.sectionTitle}>Vault Statistics</h4>
          <div className={styles.statisticsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Deposits</div>
                <div className={styles.statValue}>
                  {vaultStatus ? formatCurrency(Number(vaultStatus.totalUsdtEverDeposited) / Math.pow(10, 6)) : "$0.00"}
                </div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Shares</div>
                <div className={styles.statValue}>
                  {vaultStatus ? vaultStatus.totalShares.toString() : "0"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Vault Asset Composition */}
        <div className={styles.compositionSection}>
          <h4 className={styles.sectionTitle}>Vault Asset Composition</h4>
          
          {/* stKAIA Position */}
          <div className={styles.assetCard}>
            <div className={styles.assetHeader}>
              <div className={styles.assetTitleWithIcon}>
                <span className={styles.strategyIcon}>
                  <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <circle fill="#040404" cx="256" cy="256" r="256"/>
                    <path fill="#BFF007" d="M258.7,180.3c0-12,9.8-21.7,21.8-21.7h39.1v-52.9h-39.1c-41.4,0-75,33.4-75,74.6c0,10.7,2.3,21,6.4,30.2
                      c-32.2,13.5-53.5,42.3-58.5,78.7c-5.8,39.9,10.3,83,45.3,103.9c31.3,19.6,80.1,18.3,106.5-8.9v18h54.4V202h-79.1
                      C268.5,202,258.7,192.3,258.7,180.3 M306.5,254.9v50.2c-0.1,27.8-22.7,50.3-50.5,50.2c-27.8,0.1-50.4-22.4-50.5-50.2
                      c0.1-27.8,22.7-50.3,50.5-50.2H306.5z"/>
                  </svg>
                </span>
                <span className={styles.assetName}>stKAIA Holdings</span>
              </div>
              <span className={styles.assetValue}>
                {vaultStatus ? formatCurrency(Number(vaultStatus.currentStkAIABalance) / Math.pow(10, 18) * STKAIA_PRICE_IN_USDT) : "$0.00"}
              </span>
            </div>
            <div className={styles.assetDetails}>
              <span className={styles.assetAmount}>
                {vaultStatus ? `${formatNumber(vaultStatus.currentStkAIABalance, 18)} stKAIA` : "0 stKAIA"}
              </span>
              <span className={styles.assetPrice}>@ ${STKAIA_PRICE_IN_USDT} per stKAIA</span>
            </div>
          </div>

          {/* Short Position */}
          <div className={styles.assetCard}>
            <div className={styles.assetHeader}>
              <div className={styles.assetTitleWithIcon}>
                <span className={styles.strategyIcon}>
                  <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <circle fill="#DC2626" cx="256" cy="256" r="256"/>
                    <path fill="#FFF1F2" d="M258.7,180.3c0-12,9.8-21.7,21.8-21.7h39.1v-52.9h-39.1c-41.4,0-75,33.4-75,74.6c0,10.7,2.3,21,6.4,30.2
                      c-32.2,13.5-53.5,42.3-58.5,78.7c-5.8,39.9,10.3,83,45.3,103.9c31.3,19.6,80.1,18.3,106.5-8.9v18h54.4V202h-79.1
                      C268.5,202,258.7,192.3,258.7,180.3 M306.5,254.9v50.2c-0.1,27.8-22.7,50.3-50.5,50.2c-27.8,0.1-50.4-22.4-50.5-50.2
                      c0.1-27.8,22.7-50.3,50.5-50.2H306.5z"/>
                  </svg>
                </span>
                <span className={styles.assetName}>KAIA Short Position</span>
              </div>
              <span className={styles.assetValue}>
                {vaultStatus ? formatCurrency(Number(vaultStatus.totalUsdtCurrentlyShorted) / Math.pow(10, 6) * 1.05) : "$0.00"}
              </span>
            </div>
            <div className={styles.assetDetails}>
              <span className={styles.assetAmount}>
                {vaultStatus ? `${formatNumber(vaultStatus.totalUsdtCurrentlyShorted, 6)} USDT` : "0 USDT"}
              </span>
              <span className={styles.assetPrice}>+5.0% PnL</span>
            </div>
          </div>

          {/* Leftover USDT */}
          <div className={styles.assetCard}>
            <div className={styles.assetHeader}>
              <div className={styles.assetTitleWithIcon}>
                <span className={styles.usdtIcon}>💵</span>
                <span className={styles.assetName}>Leftover USDT</span>
              </div>
              <span className={styles.assetValue}>
                {vaultStatus ? formatCurrency(Number(vaultStatus.leftoverUsdtInVault) / Math.pow(10, 6)) : "$0.00"}
              </span>
            </div>
            <div className={styles.assetDetails}>
              <span className={styles.assetAmount}>
                {vaultStatus ? `${formatNumber(vaultStatus.leftoverUsdtInVault, 6)} USDT` : "0 USDT"}
              </span>
              <span className={styles.assetPrice}>Dust amount</span>
            </div>
          </div>
        </div>

        {/* 3. Share Information */}
        <div className={styles.shareSection}>
          <h4 className={styles.sectionTitle}>Share Information</h4>
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
                {vaultStatus && vaultStatus.totalShares > 0 
                  ? `${((Number(userShares) / Number(vaultStatus.totalShares)) * 100).toFixed(2)}%`
                  : "0%"
                }
              </span>
            </div>
          </div>
        </div>

        {/* 4. Your Asset Value */}
        <div className={styles.userValueSection}>
          <div className={styles.userValueCard}>
            <h3 className={styles.userValueTitle}>Your Holdings Value</h3>
            <div className={styles.userValueAmount}>
              {isLoading ? "Loading..." : formatCurrency(userAssetValue)}
            </div>
            <p className={styles.userValueSubtitle}>
              Based on current share ratio and vault TVL
            </p>
          </div>
        </div>

        {/* Withdraw Button */}
        <div className={styles.withdrawButtonContainer}>
          <button className={styles.withdrawButton}>
            Withdraw
          </button>
          <div className={styles.comingSoonTooltip}>
            Coming Soon... 🚧
          </div>
        </div>
      </div>
    </div>
  );
};
