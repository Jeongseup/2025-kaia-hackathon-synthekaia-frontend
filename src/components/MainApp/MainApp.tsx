"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./MainApp.module.css";
import { Header } from "./Header/Header";
import { TabNavigation } from "./TabNavigation/TabNavigation";
import { DepositTab } from "./Tabs/DepositTab/DepositTab";
import { PortfolioTab } from "./Tabs/PortfolioTab/PortfolioTab";
import { VaultTab } from "./Tabs/VaultTab/VaultTab";
import { AccountTab } from "./Tabs/AccountTab/AccountTab";

export type TabType = "deposit" | "portfolio" | "vault" | "account";

export type MainAppProps = {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const MainApp = ({ setIsLoggedIn }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");

  const renderTabContent = () => {
    switch (activeTab) {
      case "deposit":
        return <DepositTab setActiveTab={setActiveTab} />;
      case "portfolio":
        return <PortfolioTab />;
      case "vault":
        return <VaultTab />;
      case "account":
        return <AccountTab />;
      default:
        return <DepositTab setActiveTab={setActiveTab} />;
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
