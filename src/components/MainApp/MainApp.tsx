"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./MainApp.module.css";
import { Header } from "./Header/Header";
import { TabNavigation } from "./TabNavigation/TabNavigation";
import { DepositTab } from "./Tabs/DepositTab/DepositTab";
import { PortfolioTab } from "./Tabs/PortfolioTab/PortfolioTab";
import { PointsTab } from "./Tabs/PointsTab/PointsTab";
import { DetailsTab } from "./Tabs/DetailsTab/DetailsTab";

export type TabType = "deposit" | "portfolio" | "points" | "details";

export type MainAppProps = {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const MainApp = ({ setIsLoggedIn }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");

  const renderTabContent = () => {
    switch (activeTab) {
      case "deposit":
        return <DepositTab />;
      case "portfolio":
        return <PortfolioTab />;
      case "points":
        return <PointsTab />;
      case "details":
        return <DetailsTab />;
      default:
        return <DepositTab />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <Header setIsLoggedIn={setIsLoggedIn} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={styles.content}>
          {renderTabContent()}
        </div>
        <div className={styles.footer}>
          <span>Powered by SyntheKaia</span>
        </div>
      </div>
    </div>
  );
};
