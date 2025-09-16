"use client";

import { WalletButton } from "@/components/Wallet/Button/WalletButton";
import styles from "./SignInPage.module.css";
import { Dispatch, SetStateAction } from "react";

export type SignInPageProps = {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const SignInPage = ({ setIsLoggedIn }: SignInPageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="var(--secondary-color)" />
                <path d="M20 8L24 16H16L20 8Z" fill="white" />
                <path d="M12 24L20 32L28 24H12Z" fill="white" />
              </svg>
            </div>
            <h1 className={styles.logoText}>SyntheKaia</h1>
          </div>
        </div>

        {/* Vault Illustration */}
        <div className={styles.illustration}>
          <div className={styles.vault}>
            <div className={styles.vaultBody}>
              <div className={styles.vaultDoor}>
                <div className={styles.vaultHandle}></div>
              </div>
              <div className={styles.vaultContent}>
                <div className={styles.coins}>
                  <span className={styles.coin}>💰</span>
                  <span className={styles.coin}>💰</span>
                </div>
              </div>
            </div>
            <div className={styles.vaultBase}></div>
          </div>
          <div className={styles.sparkles}>
            <div className={styles.sparkle}>✨</div>
            <div className={styles.sparkle}>✨</div>
            <div className={styles.sparkle}>✨</div>
            <div className={styles.sparkle}>✨</div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.description}>
          <p className={styles.title}>
            SyntheKaia is Seamless USDT vault for Kaia DeFi Users:
          </p>
          <p className={styles.subtitle}>
            Deposit, Earn, Pay, And More!
          </p>
        </div>

        {/* Connect Button */}
        <div className={styles.buttonContainer}>
          <WalletButton setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>
    </div>
  );
};
