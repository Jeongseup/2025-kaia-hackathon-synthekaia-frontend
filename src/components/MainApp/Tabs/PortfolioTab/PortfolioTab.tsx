"use client";

import styles from "./PortfolioTab.module.css";

export const PortfolioTab = () => {
  return (
    <div className={styles.container}>
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
      </div>
    </div>
  );
};
