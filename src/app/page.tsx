"use client";
import { useEffect, useState } from "react";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk } from "@/components/Wallet/Sdk/walletSdk.hooks";
import { SignInPage } from "@/components/SignIn/SignInPage";
import { MainApp } from "@/components/MainApp/MainApp";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setAccount } = useWalletAccountStore();
  const { getAccount, disconnectWallet } = useKaiaWalletSdk();

  useEffect(() => {
    getAccount()
      .then((account) => {
        if (account) {
          setIsLoggedIn(true);
          setAccount(account);
        }
      })
      .catch((error) => {
        if (error.code === -32004) {
          disconnectWallet();
        }
      });
  }, [disconnectWallet, getAccount, setAccount]);

  return (
    <>
      {isLoggedIn ? (
        <MainApp setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <SignInPage setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}
