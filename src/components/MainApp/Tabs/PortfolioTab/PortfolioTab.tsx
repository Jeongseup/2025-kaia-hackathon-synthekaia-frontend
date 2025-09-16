"use client";

import styles from "./PortfolioTab.module.css";

export const PortfolioTab = () => {
  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h2 className={styles.welcomeTitle}>Welcome to</h2>
          <h1 className={styles.appName}>SynteKaia</h1>
          <p className={styles.subtitle}>Hybrid DeFi Strategy Vault (stKAIA x Perp Short)</p>
          <div className={styles.lightningIcon}>⚡</div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className={styles.portfolioContent}>
        {/* Total Balance */}
        <div className={styles.balanceSection}>
          <div className={styles.balanceCard}>
            <h3 className={styles.balanceTitle}>Total Balance</h3>
            <div className={styles.balanceAmount}>$0.00</div>
            <p className={styles.balanceSubtitle}>Earning 12.5% APY</p>
          </div>
        </div>

        {/* Positions */}
        <div className={styles.positionsSection}>
          <div className={styles.positionCard}>
            <div className={styles.positionHeader}>
              <h4 className={styles.positionTitle}>stKAIA Position</h4>
              <span className={styles.statusBadge}>Active</span>
            </div>
            <div className={styles.positionDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Staked Amount</span>
                <span className={styles.detailValue}>0 KAIA</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Rewards Earned</span>
                <span className={styles.detailValue}>0 KAIA</span>
              </div>
            </div>
          </div>

          <div className={styles.positionCard}>
            <div className={styles.positionHeader}>
              <h4 className={styles.positionTitle}>BTC Short Position</h4>
              <span className={styles.statusBadge}>Active</span>
            </div>
            <div className={styles.positionDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Margin (USDT)</span>
                <span className={styles.detailValue}>0 USDT</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>PnL</span>
                <span className={styles.detailValue}>+0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <button className={styles.withdrawButton}>
          Withdraw
        </button>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Powered by stKAIA x k-bit PerpDEX</span>
        </div>
      </div>
    </div>
  );
};
