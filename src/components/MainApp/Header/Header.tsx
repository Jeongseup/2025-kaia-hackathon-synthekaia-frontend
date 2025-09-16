"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./Header.module.css";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk } from "@/components/Wallet/Sdk/walletSdk.hooks";

export type HeaderProps = {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ setIsLoggedIn }: HeaderProps) => {
  const { account, setAccount } = useWalletAccountStore();
  const { disconnectWallet } = useKaiaWalletSdk();

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAccount(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Disconnect error:", error);
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="var(--secondary-color)" />
            <path d="M12 4L15 10H9L12 4Z" fill="white" />
            <path d="M6 16L12 20L18 16H6Z" fill="white" />
          </svg>
        </div>
        <span className={styles.logoText}>SynteKaia</span>
        <button 
          className={styles.addressButton}
          onClick={handleDisconnect}
          title="Click to disconnect wallet"
        >
          {formatAddress(account)}
        </button>
      </div>
    </div>
  );
};
