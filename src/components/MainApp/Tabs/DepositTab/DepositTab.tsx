"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./DepositTab.module.css";
import { STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS} from '@/constants/StkaiaDeltaNeutralVaultAbi'
import VaultABI from '@/constants/abis/StkaiaDeltaNeutralVault.json'
import { MOCK_USDT_ADDRESS,  MOCK_USDT_ABI} from '@/constants/MockUSDTAbi'
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import {useKaiaWalletSdk} from "@/components/Wallet/Sdk/walletSdk.hooks";
import { ethers } from 'ethers'
import { microUSDTHexToUSDTDecimal } from "@/utils/format";

type DepositStep = "input" | "review" | "approving" | "depositing" | "success";

export const DepositTab = () => {
  const vaultContractAddress = STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS;    
  const usdtContractAddress = MOCK_USDT_ADDRESS;
  const [amount, setAmount] = useState("");
  const [selectedCurrency] = useState("USDT");
  const [currentStep, setCurrentStep] = useState<DepositStep>("input");  
  const [usdtBalance, setUsdtBalance] = useState<string>('0.00');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { account } = useWalletAccountStore();
  const { sendTransaction, getErc20TokenBalance } = useKaiaWalletSdk();

  // Fetch USDT balance
  const fetchUSDTBalance = useCallback(async () => {
    if (!account || !usdtContractAddress) return;
    
    try {
      setIsLoadingBalance(true);
      const balance = await getErc20TokenBalance(usdtContractAddress, account);
      const formattedBalance = Number(microUSDTHexToUSDTDecimal(balance as string)).toFixed(2);
      setUsdtBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch USDT balance:", error);
      setUsdtBalance('0.00');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [account, usdtContractAddress, getErc20TokenBalance]);

  // Fetch balance when component mounts or account changes
  useEffect(() => {
    fetchUSDTBalance();
  }, [fetchUSDTBalance]);

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setCurrentStep("review");
  };

  const handleMaxClick = () => {
    if (usdtBalance && usdtBalance !== '0.00') {
      setAmount(usdtBalance);
    }
  };

  const handleReview = async () => {
    setCurrentStep("approving");
      
    try {
      // Contract call for USDT deposit
      const result = await depositUSDT(parseFloat(amount));
      
      if (result.success) {
        // Refresh balance after successful deposit
        await fetchUSDTBalance();
        
        // Show success after a brief delay
        setTimeout(() => {
          setCurrentStep("success");
        }, 1500);
      } else {
        throw new Error("Deposit failed");
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      // Show error message to user (you could add a toast/alert here)
      alert(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStep("review");
    }
    };

  const depositUSDT = async (amount: number) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      console.log(`Depositing ${amount} USDT to SyntheKaia vault...`);
      const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      
      // Convert amount to wei (USDT has 6 decimals)
      const amountInWei = ethers.parseUnits(amount.toString(), 6);
      
      // --- Step 1: Approve USDT spending ---
      console.log("Step 1: Approving USDT spending...");
      const mUSDTInterface = new ethers.Interface(MOCK_USDT_ABI);
      const approveData = mUSDTInterface.encodeFunctionData('approve', [
        vaultContractAddress, // spender
        amountInWei // amount
      ]);
      
      const approveTx = {
        from: account,
        to: usdtContractAddress,
        data: approveData,
        value: "",
        gas: "" 
      };
      
      const approveTxHash = await sendTransaction([approveTx]) as string;
      if (!approveTxHash) {
        throw new Error("Failed to send approve transaction. The request may have been rejected or is already processing.");
      }
      console.log(`Approve transaction sent. Hash: ${approveTxHash}. Waiting for confirmation...`);

      setCurrentStep("depositing");

      const approveReceipt = await provider.waitForTransaction(approveTxHash);
      if (!approveReceipt) {
        throw new Error("Failed to get approve transaction receipt. The transaction may not have been mined yet.");
      }
      if (approveReceipt.status === 0) {
        throw new Error("Approve transaction failed. Please check the transaction on the explorer.");
      }
      console.log("Approve transaction confirmed.");

      // --- Step 2: Deposit to vault ---
      console.log("Step 2: Depositing to vault...");
      const vaultInterface = new ethers.Interface(VaultABI.abi);
      const depositData = vaultInterface.encodeFunctionData('deposit', [
        amountInWei, // assets
        account // receiver
      ]);
      
      const depositTx = {
        from: account,
        to: vaultContractAddress,
        data: depositData,
        value: "",
        gas: "" // Will be estimated by wallet
      };
      
      const depositTxHash = await sendTransaction([depositTx]) as string;
      if (!depositTxHash) {
        throw new Error("Failed to send deposit transaction.");
      }
      console.log(`Deposit transaction sent. Hash: ${depositTxHash}. Waiting for confirmation...`);

      const depositReceipt = await provider.waitForTransaction(depositTxHash);
      if (!depositReceipt || depositReceipt.status === 0) {
        throw new Error("Deposit transaction failed. Please check the transaction on the explorer.");
      }
      console.log("Deposit transaction confirmed successfully!");
      
      return { success: true };
      
    } catch (error) {
      console.error("Contract call failed:", error);
      throw error;
    }
  };

  const handleBack = () => {
    if (currentStep === "review") {
      setCurrentStep("input");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "input":
        return renderInputStep();
      case "review":
        return renderReviewStep();
      case "approving":
        return renderApprovingStep();
      case "depositing":
        return renderDepositingStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderInputStep();
    }
  };

  const renderInputStep = () => (
    <>
      {/* Deposit Section */}
      <div className={styles.depositSection}>
        <div className={styles.depositHeader}>
          <h3 className={styles.sectionTitle}>Deposit</h3>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="number"
            placeholder="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.amountInput}
          />
          <div className={styles.currencyBox}>
            <div className={styles.currencyIcon}>
              <svg width="20" height="20" viewBox="0 0 339.43 295.27">
                <path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" fill="#50af95"/>
                <path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" fill="#fff"/>
              </svg>
            </div>
            <span className={styles.currencyText}>USDT</span>
          </div>
        </div>

        <div className={styles.walletInfo}>
          <span className={styles.walletLabel}>
            Wallet: {isLoadingBalance ? (
              <span className={styles.loadingText}>Loading...</span>
            ) : (
              `${usdtBalance} USDT`
            )}
          </span>
          <button 
            className={styles.maxButton}
            onClick={handleMaxClick}
            disabled={isLoadingBalance || usdtBalance === '0.00'}
          >
            MAX
          </button>
        </div>

        {/* Strategy Allocation */}
        <div className={styles.strategySection}>
          <h4 className={styles.strategyTitle}>Strategy Allocation</h4>
          
          <div className={styles.allocationItem}>
            <div className={styles.allocationHeader}>
              <div className={styles.strategyInfo}>
                <span className={styles.strategyIcon}>
                  <svg width="14" height="14" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <circle fill="#040404" cx="256" cy="256" r="256"/>
                    <path fill="#BFF007" d="M258.7,180.3c0-12,9.8-21.7,21.8-21.7h39.1v-52.9h-39.1c-41.4,0-75,33.4-75,74.6c0,10.7,2.3,21,6.4,30.2
                      c-32.2,13.5-53.5,42.3-58.5,78.7c-5.8,39.9,10.3,83,45.3,103.9c31.3,19.6,80.1,18.3,106.5-8.9v18h54.4V202h-79.1
                      C268.5,202,258.7,192.3,258.7,180.3 M306.5,254.9v50.2c-0.1,27.8-22.7,50.3-50.5,50.2c-27.8,0.1-50.4-22.4-50.5-50.2
                      c0.1-27.8,22.7-50.3,50.5-50.2H306.5z"/>
                  </svg>
                </span>
                <span className={styles.strategyName}>Liquid Staking (stKAIA)</span>
              </div>
              <span className={styles.percentage}>50%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: "50%" }}></div>
            </div>
          </div>

          <div className={styles.allocationItem}>
            <div className={styles.allocationHeader}>
              <div className={styles.strategyInfo}>
                <span className={styles.strategyIcon}>
                  <svg width="14" height="14" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <circle fill="#DC2626" cx="256" cy="256" r="256"/>
                    <path fill="#FFF1F2" d="M258.7,180.3c0-12,9.8-21.7,21.8-21.7h39.1v-52.9h-39.1c-41.4,0-75,33.4-75,74.6c0,10.7,2.3,21,6.4,30.2
                      c-32.2,13.5-53.5,42.3-58.5,78.7c-5.8,39.9,10.3,83,45.3,103.9c31.3,19.6,80.1,18.3,106.5-8.9v18h54.4V202h-79.1
                      C268.5,202,258.7,192.3,258.7,180.3 M306.5,254.9v50.2c-0.1,27.8-22.7,50.3-50.5,50.2c-27.8,0.1-50.4-22.4-50.5-50.2
                      c0.1-27.8,22.7-50.3,50.5-50.2H306.5z"/>
                  </svg>
                </span>
                <span className={styles.strategyName}>KAIA Short Position (1x)</span>
              </div>
              <span className={styles.percentage}>50%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>

{/* Yield Information */}
        <div className={styles.yieldInfo}>
          <div className={styles.yieldItem}>
            <span className={styles.yieldLabel}>Expected Monthly Yield</span>
            <span className={styles.yieldValue}>~1.04%</span>
          </div>
          <div className={styles.yieldItem}>
            <span className={styles.yieldLabel}>Estimated Annual Return</span>
            <span className={styles.yieldValue}>~12.5%</span>
          </div>
        </div>

        {/* Review Button */}
        <button 
          className={styles.reviewButton}
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Review
        </button>
      </div>
    </>
  );

  const renderReviewStep = () => (
    <div className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Review Deposit
        </button>
      </div>

      <div className={styles.reviewContent}>
        <div className={styles.reviewIcon}>
          <div className={styles.usdtIcon}>
            <svg width="40" height="40" viewBox="0 0 339.43 295.27">
              <path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" fill="#50af95"/>
              <path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" fill="#fff"/>
            </svg>
          </div>
        </div>
        <div className={styles.reviewAmount}>{amount}</div>
        <div className={styles.reviewLabel}>You deposit</div>

        <div className={styles.commitmentInfo}>
          <div className={styles.commitmentRow}>
            <span className={styles.commitmentKey}>Deposit is processed as USDT approve & deposit sequentially</span>
          </div>
        </div>

        <button className={styles.depositButton} onClick={handleReview}>
          Deposit {selectedCurrency}
        </button>
      </div>
    </div>
  );

  const renderApprovingStep = () => (
    <div className={styles.permittingSection}>
      <div className={styles.permittingContent}>
        <h3 className={styles.permittingTitle}>Approving {selectedCurrency}</h3>
        <p className={styles.permittingText}>Please sign the approve transaction in your wallet</p>
        <div className={styles.loadingSpinner}></div>
      </div>
    </div>
  );

  const renderDepositingStep = () => (
    <div className={styles.permittingSection}>
      <div className={styles.permittingContent}>
        <h3 className={styles.permittingTitle}>Depositing {selectedCurrency}...</h3>
        <p className={styles.permittingText}>Please wait while your deposit is being processed</p>
        <div className={styles.loadingSpinner}></div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className={styles.successSection}>
      <div className={styles.successContent}>
        <div className={styles.successIcon}>✅</div>
        <h3 className={styles.successTitle}>Deposit Successful!</h3>
        <p className={styles.successText}>Your {amount} {selectedCurrency} has been deposited successfully.</p>
        <button 
          className={styles.doneButton}
          onClick={() => {
            setCurrentStep("input");
            setAmount("");
          }}
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {currentStep === "input" && (
        <div className={styles.welcomeBanner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.welcomeTitle}>Welcome to</h2>
            <h1 className={styles.appName}>SyntheKaia</h1>
            <p className={styles.subtitle}>Hybrid DeFi Strategy Vault (stKAIA x Perp Short)</p>
            <div className={styles.logoIcon}>
              <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* 배경: 둥근 사각형 */}
                <rect width="100" height="100" rx="20" fill="rgba(255, 255, 255, 0.2)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2"/>
                
                {/* 금고 아이콘 그룹 */}
                <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
                  <g strokeWidth="3">
                    {/* 금고 몸체 */}
                    <path d="M25 20 H 75 A 5 5 0 0 1 80 25 V 75 A 5 5 0 0 1 75 80 H 25 A 5 5 0 0 1 20 75 V 25 A 5 5 0 0 1 25 20 Z"/>
                    
                    {/* 경첩 */}
                    <path d="M80 30 L 85 30"/>
                    <path d="M80 65 L 85 65"/>

                    {/* 다리 */}
                    <path d="M30 80 L 30 85"/>
                    <path d="M70 80 L 70 85"/>
                  </g>
                  {/* 다이얼 */}
                  <circle cx="50" cy="50" r="12" strokeWidth="2"/>
                </g>

                {/* T 글자 */}
                <text x="50" y="58" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">T</text>
              </svg>
            </div>
            </div>
          </div>
      )}

      {renderStepContent()}
    </div>
  );
};
