"use client";

import styles from "./DetailsTab.module.css";

export const DetailsTab = () => {
  return (
    <div className={styles.container}>
      {/* Details Content */}
      <div className={styles.detailsContent}>
        {/* Analytics Charts */}
        <div className={styles.analyticsSection}>
          <div className={styles.chartContainer}>
            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <div className={styles.chartIcon}>📊</div>
                <div>
                  <h4 className={styles.chartTitle}>AUM</h4>
                  <p className={styles.chartSubtitle}>Transparent overview of AUM, deposits, yield, and collateral</p>
                </div>
              </div>
              
              <div className={styles.chartMetrics}>
                <div className={styles.metricGroup}>
                  <div className={styles.metricValue}>$3.01B</div>
                  <div className={styles.metricPeriod}>
                    <span className={styles.periodTab}>1W</span>
                    <span className={styles.periodTab}>1M</span>
                    <span className={styles.periodTab + ' ' + styles.active}>1Y</span>
                  </div>
                </div>
                <div className={styles.metricChange}>$1.8B</div>
              </div>

              <div className={styles.chartArea}>
                <svg className={styles.chartSvg} viewBox="0 0 300 100">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="100" fill="url(#grid)" />
                  
                  {/* AUM Line (consistently increasing) */}
                  <path
                    d="M 20 85 Q 50 80 80 75 Q 120 70 160 65 Q 200 60 240 55 Q 270 50 280 45"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    className={styles.chartLine}
                  />
                  
                  {/* Data points */}
                  <circle cx="20" cy="85" r="2" fill="#3B82F6" />
                  <circle cx="80" cy="75" r="2" fill="#3B82F6" />
                  <circle cx="160" cy="65" r="2" fill="#3B82F6" />
                  <circle cx="240" cy="55" r="2" fill="#3B82F6" />
                  <circle cx="280" cy="45" r="2" fill="#3B82F6" />
                </svg>
                
                <div className={styles.chartLabels}>
                  <span>Aug 19</span>
                  <span>Aug 22</span>
                  <span>Aug 26</span>
                  <span>Aug 30</span>
                  <span>Sep 3</span>
                  <span>Sep 7</span>
                  <span>Sep 11</span>
                  <span>Sep 15</span>
                </div>
              </div>

              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{backgroundColor: '#F97316'}}></div>
                  <span>Loan Collateral</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{backgroundColor: '#3B82F6'}}></div>
                  <span>Deposits</span>
                </div>
              </div>
            </div>

            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <div className={styles.chartIcon}>📈</div>
                <div>
                  <h4 className={styles.chartTitle}>APY</h4>
                  <p className={styles.chartSubtitle}>9.2% <span className={styles.rewardText}>includes 2.2% in Rewards</span></p>
                </div>
              </div>
              
              <div className={styles.chartMetrics}>
                <div className={styles.metricGroup}>
                  <div className={styles.metricValue}>9.2%</div>
                  <div className={styles.metricPeriod}>
                    <span className={styles.periodTab}>1W</span>
                    <span className={styles.periodTab + ' ' + styles.active}>1M</span>
                    <span className={styles.periodTab}>1Y</span>
                  </div>
                </div>
                <div className={styles.metricChange}>10.2%</div>
              </div>

              <div className={styles.chartArea}>
                <svg className={styles.chartSvg} viewBox="0 0 300 100">
                  {/* Grid lines */}
                  <rect width="300" height="100" fill="url(#grid)" />
                  
                  {/* APY Line (fluctuating) */}
                  <path
                    d="M 20 70 Q 50 60 80 65 Q 120 55 160 60 Q 200 65 240 55 Q 270 60 280 65"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    className={styles.chartLine}
                  />
                  
                  {/* USD Benchmark Rate (lower, more stable) */}
                  <path
                    d="M 20 80 Q 50 78 80 82 Q 120 85 160 83 Q 200 80 240 85 Q 270 82 280 80"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="2"
                    className={styles.chartLine}
                  />
                  
                  {/* Data points for APY */}
                  <circle cx="20" cy="70" r="2" fill="#F97316" />
                  <circle cx="80" cy="65" r="2" fill="#F97316" />
                  <circle cx="160" cy="60" r="2" fill="#F97316" />
                  <circle cx="240" cy="55" r="2" fill="#F97316" />
                  <circle cx="280" cy="65" r="2" fill="#F97316" />
                </svg>
                
                <div className={styles.chartLabels}>
                  <span>Aug 17</span>
                  <span>Aug 21</span>
                  <span>Aug 25</span>
                  <span>Aug 29</span>
                  <span>Sep 2</span>
                  <span>Sep 6</span>
                  <span>Sep 10</span>
                  <span>Sep 14</span>
                </div>
              </div>

              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{backgroundColor: '#F97316'}}></div>
                  <span>Maple</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{backgroundColor: '#A855F7'}}></div>
                  <span>USD Benchmark Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
