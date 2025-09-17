"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./Header.module.css";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk } from "@/components/Wallet/Sdk/walletSdk.hooks";

export type HeaderProps = {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ setIsLoggedIn }: HeaderProps) => {
  const { account, setAccount } = useWalletAccountStore();
  const { disconnectWallet } = useKaiaWalletSdk();
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAccount(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent disconnect when clicking copy
    if (!account) return;
    
    try {
      await navigator.clipboard.writeText(account);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return "Not Connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
        </div>
        <span className={styles.logoText}>SyntheKaia</span>
        {/* 현재 주소 버튼 위치 */}
        <button 
          className={styles.addressButton}
          onClick={handleCopyAddress}
          title="Copy address"
        >
          {formatAddress(account)}
        </button>
        <button 
          className={styles.disconnectButton}
          onClick={handleDisconnect}
          title="Disconnect wallet"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Copy Toast */}
      {showCopyToast && (
        <div className={styles.copyToast}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Copied
        </div>
      )} 
    </div>
  );
};
