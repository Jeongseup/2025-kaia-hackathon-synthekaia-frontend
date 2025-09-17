"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk } from "@/components/Wallet/Sdk/walletSdk.hooks";
import { SignInPage } from "@/components/SignIn/SignInPage";
import { MainApp } from "@/components/MainApp/MainApp";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setKeySequence] = useState<string[]>([]);
  const router = useRouter();
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

  // Handle keydown events for secret sequence
  useEffect(() => {
    // Secret key sequence to access dev page: "dev123"
    const secretSequence = ['d', 'e', 'v', '1', '2', '3'];
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-secretSequence.length);
        
        // Check if the sequence matches
        if (newSequence.length === secretSequence.length && 
            newSequence.every((k, i) => k === secretSequence[i])) {
          // Navigate to dev page
          router.push('/dev');
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

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
