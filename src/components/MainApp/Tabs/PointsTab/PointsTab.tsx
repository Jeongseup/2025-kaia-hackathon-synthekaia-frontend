"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./PointsTab.module.css";
import { STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS} from '@/constants/StkaiaDeltaNeutralVaultAbi'
import VaultABI from '@/constants/abis/StkaiaDeltaNeutralVault.json'
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { ethers } from 'ethers'

// Constants
const BASE_POINT_SPEED = 0.01; // Base POINT per hour

export const PointsTab = () => {
  const { account } = useWalletAccountStore();
  const [, setUserShares] = useState<bigint>(BigInt(0));
  const [, setTotalShares] = useState<bigint>(BigInt(0));
  const [sharePercentage, setSharePercentage] = useState<number>(0);
  const [pointSpeed, setPointSpeed] = useState<number>(BASE_POINT_SPEED);
  const [points, ] = useState<number>(0.020000);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user share data
  const fetchShareData = useCallback(async () => {
    if (!account || !STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS) return;
    
    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      const vaultContract = new ethers.Contract(
        STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS,
        VaultABI.abi,
        provider
      );

      // Get user shares and total shares
      const [userShareBalance, vaultStatus] = await Promise.all([
        vaultContract.balanceOf(account),
        vaultContract.getVaultStatus()
      ]);

      setUserShares(userShareBalance);
      setTotalShares(vaultStatus.totalShares);

      // Calculate share percentage
      const shareRatio = vaultStatus.totalShares > 0 
        ? (Number(userShareBalance) / Number(vaultStatus.totalShares)) * 100
        : 0;
      
      setSharePercentage(shareRatio);

      // Calculate point speed based on share percentage
      // Formula: base speed + (share percentage * multiplier)
      const speedMultiplier = 0.1; // 0.1 additional POINT per hour per 1% share
      const calculatedSpeed = BASE_POINT_SPEED + (shareRatio * speedMultiplier);
      setPointSpeed(calculatedSpeed);
      
    } catch (error) {
      console.error("Failed to fetch share data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchShareData();
  }, [fetchShareData]);

  const formatNumber = (value: number, decimals: number = 6) => {
    return value.toFixed(decimals);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tabIndicator}>
          <span className={`${styles.tabLabel} ${styles.active}`}>Point</span>
        </div>
      </div>

      {/* Points Content */}
      <div className={styles.pointsContent}>
        {/* Storage Info */}
        <div className={styles.storageInfo}>
          <p className={styles.storageLabel}>In Storage:</p>
          <div className={styles.storageAmount}>
            <span className={styles.soraIcon}>☁️</span>
            <span className={styles.amount}>
              {isLoading ? "Loading..." : formatNumber(points)}
            </span>
          </div>
          <p className={styles.balanceInfo}>
            Point Balance: <span className={styles.balanceAmount}>☁️ {formatNumber(points, 2)}</span>
            {sharePercentage > 0 && (
              <span className={styles.shareInfo}> / Your Vault Share: {sharePercentage.toFixed(2)}%</span>
            )}
          </p>
        </div>

        {/* Character Section */}
        <div className={styles.characterSection}>
          <div className={styles.character}>
            <div className={styles.characterBody}>
              <span className={styles.characterFace}>😊</span>
            </div>
            <div className={styles.speechBubble}>
              <p className={styles.speechText}>
                {sharePercentage > 0 ? "I'm earning faster!" : "I'm Soaked!"}
              </p>
              <p className={styles.speechSubtext}>
                {sharePercentage > 0 
                  ? `${sharePercentage.toFixed(1)}% vault share boost!` 
                  : "Tap me collect now"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Speed:</span>
            <span className={styles.statValue}>
              {isLoading ? "Loading..." : `${pointSpeed.toFixed(3)} POINT/hour`}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Base Speed:</span>
            <span className={styles.statValue}>{BASE_POINT_SPEED} POINT/hour</span>
          </div>
          {sharePercentage > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Boost:</span>
              <span className={styles.statValue}>
                +{((pointSpeed - BASE_POINT_SPEED) / BASE_POINT_SPEED * 100).toFixed(1)}%
              </span>
            </div>
          )}
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Cap:</span>
            <span className={styles.statValue}>2 hours</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>🎯</span>
            <span className={styles.buttonLabel}>Mission</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>🚀</span>
            <span className={styles.buttonLabel}>Boost</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>👥</span>
            <span className={styles.buttonLabel}>Friend</span>
          </button>
        </div>
      </div>
    </div>
  );
};
