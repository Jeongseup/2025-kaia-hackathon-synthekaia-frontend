"use client";

import styles from "./DetailsTab.module.css";

export const DetailsTab = () => {
  return (
    <div className={styles.container}>
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
