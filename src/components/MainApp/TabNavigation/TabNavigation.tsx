"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./TabNavigation.module.css";
import { TabType } from "../MainApp";

export type TabNavigationProps = {
  activeTab: TabType;
  setActiveTab: Dispatch<SetStateAction<TabType>>;
};

const tabs = [
  { id: "deposit" as TabType, label: "Deposit", icon: "🏦" },
  { id: "portfolio" as TabType, label: "Portfolio", icon: "📊" },
  { id: "points" as TabType, label: "Points", icon: "💎" },
  { id: "details" as TabType, label: "Details", icon: "📋" },
];

export const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
