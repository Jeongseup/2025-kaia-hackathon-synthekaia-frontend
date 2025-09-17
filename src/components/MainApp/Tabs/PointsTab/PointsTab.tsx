"use client";

import styles from "./PointsTab.module.css";

export const PointsTab = () => {
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
            <span className={styles.amount}>0.020000</span>
          </div>
          <p className={styles.balanceInfo}>
            Sora Balance: <span className={styles.balanceAmount}>☁️ 0.02</span>
          </p>
        </div>

        {/* Character Section */}
        <div className={styles.characterSection}>
          <div className={styles.character}>
            <div className={styles.characterBody}>
              <span className={styles.characterFace}>😊</span>
            </div>
            <div className={styles.speechBubble}>
              <p className={styles.speechText}>I&apos;m Soaked!</p>
              <p className={styles.speechSubtext}>Tap me collect now</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Speed:</span>
            <span className={styles.statValue}>0.01 SORA/hour</span>
          </div>
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
