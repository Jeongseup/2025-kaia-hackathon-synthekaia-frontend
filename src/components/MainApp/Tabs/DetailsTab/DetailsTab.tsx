"use client";

import styles from "./DetailsTab.module.css";

export const DetailsTab = () => {
  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h2 className={styles.welcomeTitle}>Welcome to</h2>
          <h1 className={styles.appName}>SyntheKaia</h1>
          <p className={styles.subtitle}>Hybrid DeFi Strategy Vault (stKAIA x Perp Short)</p>
          <div className={styles.lightningIcon}>⚡</div>
        </div>
      </div>

      {/* Details Content */}
      <div className={styles.detailsContent}>
        <div className={styles.comingSoonSection}>
          <h3 className={styles.comingSoonTitle}>Details</h3>
          <p className={styles.comingSoonText}>Coming soon</p>
        </div>
      </div>
    </div>
  );
};
