"use client";

import { useState } from "react";
import styles from "./DepositTab.module.css";

type DepositStep = "input" | "review" | "permitting" | "success";

export const DepositTab = () => {
  const [amount, setAmount] = useState("");
  const [selectedCurrency] = useState("USDT");
  const [currentStep, setCurrentStep] = useState<DepositStep>("input");

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setCurrentStep("review");
  };

  const handleReview = () => {
    setCurrentStep("permitting");
    // Simulate permission process
    setTimeout(() => {
      setCurrentStep("success");
    }, 3000);
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
      case "permitting":
        return renderPermittingStep();
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
          <span className={styles.walletLabel}>Wallet: 82.20</span>
          <button className={styles.maxButton}>MAX</button>
        </div>

        {/* Strategy Allocation */}
        <div className={styles.strategySection}>
          <h4 className={styles.strategyTitle}>Strategy Allocation</h4>
          
          <div className={styles.allocationItem}>
            <div className={styles.allocationHeader}>
              <div className={styles.strategyInfo}>
                <span className={styles.strategyIcon}>🔵</span>
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
                <span className={styles.strategyIcon}>🔵</span>
                <span className={styles.strategyName}>BTC Short Position (3x)</span>
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
          <span className={styles.dollarIcon}>💰$</span>
        </div>
        <div className={styles.reviewAmount}>{amount}</div>
        <div className={styles.reviewLabel}>You deposit</div>

        <div className={styles.commitmentInfo}>
          <div className={styles.commitmentRow}>
            <span className={styles.commitmentKey}>Commitment period ends</span>
          </div>
        </div>

        <button className={styles.depositButton} onClick={handleReview}>
          Deposit {selectedCurrency}
        </button>
      </div>
    </div>
  );

  const renderPermittingStep = () => (
    <div className={styles.permittingSection}>
      <div className={styles.permittingContent}>
        <h3 className={styles.permittingTitle}>Permitting {selectedCurrency}</h3>
        <p className={styles.permittingText}>Please sign the permit transaction in your wallet</p>
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
            <h1 className={styles.appName}>SynteKaia</h1>
            <p className={styles.subtitle}>Hybrid DeFi Strategy Vault (stKAIA x Perp Short)</p>
            <div className={styles.lightningIcon}>⚡</div>
          </div>
        </div>
      )}

      {renderStepContent()}

      {currentStep === "input" && (
        <div className={styles.footer}>
          <span>Powered by stKAIA x k-bit PerpDEX</span>
        </div>
      )}
    </div>
  );
};
