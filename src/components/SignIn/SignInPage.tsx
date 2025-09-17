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
            <h1 className={styles.logoText}>SyntheKaia</h1>
          </div>
        </div>

        {/* Center Illustration */}
        <div className={styles.centerIllustration}>
          <div className={styles.logoIllustration}>
          <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* 배경: 둥근 파란색 사각형 */}
                <rect width="100" height="100" rx="20" fill="#1DA1F2"/>

                {/* 금고 아이콘 그룹 (흰색 선으로 그림) */}
                <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
                  <g strokeWidth="4">
                    {/* 금고 몸체 (문) */}
                    <path d="M25 20 H 75 A 5 5 0 0 1 80 25 V 75 A 5 5 0 0 1 75 80 H 25 A 5 5 0 0 1 20 75 V 25 A 5 5 0 0 1 25 20 Z"/>
                    
                    {/* 경첩 */}
                    <path d="M80 30 L 85 30"/>
                    <path d="M80 65 L 85 65"/>

                    {/* 다리 */}
                    <path d="M30 80 L 30 85"/>
                    <path d="M70 80 L 70 85"/>
                  </g>
                  {/* 다이얼 */}
                  <circle cx="50" cy="50" r="12"/>
                </g>

                {/* T 글자 */}
                <text x="50" y="58" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="white" textAnchor="middle">T</text>
              </svg>
          </div>
        </div>

        {/* Description */}
        <div className={styles.description}>
          <p className={styles.title}>
            Seamless USDT vault for Kaia DeFi Users
          </p>
          <p className={styles.subtitle}>
            Deposit, Earn, And Just Enjoy Your Coffee Time ☕
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
