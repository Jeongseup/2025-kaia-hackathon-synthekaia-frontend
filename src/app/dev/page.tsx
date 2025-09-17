"use client";

import { useState, useCallback, useEffect } from "react";
import { useWalletAccountStore } from "@/components/Wallet/Account/auth.hooks";
import { useKaiaWalletSdk, Transaction } from "@/components/Wallet/Sdk/walletSdk.hooks";
import { COUNTER_CONTRACT_ADDRESS, COUNTER_CONTRACT_ABI } from "@/constants/CounterAbi";
import { ethers } from "ethers";
import styles from "./page.module.css";


export default function DevPage() {
  const [count, setCount] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [transferRecipient, setTransferRecipient] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const { account } = useWalletAccountStore();
  const { sendTransaction } = useKaiaWalletSdk();

  // USDT contract address (Kairos testnet)
  const USDT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS || "";
  
  // Fetch current count from contract
  const fetchCount = useCallback(async () => {
    if (!COUNTER_CONTRACT_ADDRESS) {
      console.log("Counter contract address not set");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching count from contract:", COUNTER_CONTRACT_ADDRESS);
      const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      const counterContract = new ethers.Contract(COUNTER_CONTRACT_ADDRESS, COUNTER_CONTRACT_ABI, provider);
      
      // Fetch current number from contract
      const currentNumber = await counterContract.number();
      console.log("Got current number:", currentNumber);        

      setCount(currentNumber.toString());
    } catch (error) {
      console.error("Failed to fetch count:", error);
      setCount("Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch count on component mount
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Increment counter
  const handleIncrement = async () => {
    if (!account || !COUNTER_CONTRACT_ADDRESS) {
      alert("Wallet not connected or contract address not set");
      return;
    }

    try {
      setIsLoading(true);
      setTxHash('');

      // Create contract interface for encoding
      const counterInterface = new ethers.Interface(COUNTER_CONTRACT_ABI);
      const incrementData = counterInterface.encodeFunctionData('increment', []);


      // Prepare transaction 
      const incrementTx: Transaction = {
        from: account,
        to: COUNTER_CONTRACT_ADDRESS,
        data: incrementData,
        value: "",
        gas: ""
      };

      // Send transaction
      await sendTransaction([incrementTx]);

      console.log('Increment transaction hash:', txHash)
      setTxHash("Transaction sent successfully!");
      
      // Refresh count after transaction
      setTimeout(() => {
        fetchCount();
      }, 2000);
    } catch (error) {
      console.error("Increment failed:", error);
      alert(`Increment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset counter to 0
  const handleSetNumber = async (number: number) => {
    if (!account || !COUNTER_CONTRACT_ADDRESS) {
      alert("Wallet not connected or contract address not set");
      return;
    }

    try {
      setIsLoading(true);
      setTxHash('');

      const counterInterface = new ethers.Interface(COUNTER_CONTRACT_ABI);
      const resetData = counterInterface.encodeFunctionData('setNumber', [number]);

      const setNumberTx: Transaction = {
        from: account,
        to: COUNTER_CONTRACT_ADDRESS,
        data: resetData,
        value: "",
        gas: ""
      };

      await sendTransaction([setNumberTx]);
      setTxHash("Transaction sent successfully!");
      
      setTimeout(() => {
        fetchCount();
      }, 2000);

    } catch (error) {
      console.error("Reset failed:", error);
      alert(`Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer USDT tokens
  const handleTransferUSDT = async () => {
    if (!account || !transferRecipient || !transferAmount) {
      alert("Please fill in all fields and connect wallet");
      return;
    }

    // Basic address validation
    if (!transferRecipient.startsWith('0x') || transferRecipient.length !== 42) {
      alert("Invalid recipient address format");
      return;
    }

    try {
      setIsLoading(true);
      setTxHash('');

      // Convert amount to wei (USDT has 6 decimals)
      const amountInWei = ethers.parseUnits(transferAmount, 6);
      
      // ERC20 transfer function ABI
      const erc20Interface = new ethers.Interface([
        "function transfer(address to, uint256 amount) returns (bool)"
      ]);
      
      const transferData = erc20Interface.encodeFunctionData('transfer', [
        transferRecipient,
        amountInWei
      ]);

      console.log('Transfer data:', transferData);
      console.log('USDT Contract:', USDT_CONTRACT_ADDRESS);
      console.log('Recipient:', transferRecipient);
      console.log('Amount in wei:', amountInWei.toString());

      const transferTx: Transaction = {
        from: account,
        to: USDT_CONTRACT_ADDRESS,
        data: transferData,
        value: "",
        gas: ""
      };

      await sendTransaction([transferTx]);
      setTxHash(`Transfer of ${transferAmount} USDT sent successfully!`);
      
      // Clear form
      setTransferRecipient('');
      setTransferAmount('');

    } catch (error) {
      console.error("Transfer failed:", error);
      alert(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.devPanel}>
        <h1 className={styles.title}>🔧 Dev Counter Panel</h1>
        
        {/* Contract Info */}
        <div className={styles.contractInfo}>
          <h3>Contract Info</h3>
          <p><strong>Address:</strong> {COUNTER_CONTRACT_ADDRESS || "Not Set"}</p>
          <p><strong>Account:</strong> {account || "Not Connected"}</p>
        </div>

        {/* Current Count */}
        <div className={styles.countSection}>
          <h3>Current Count</h3>
          <div className={styles.countDisplay}>
            {isLoading ? "Loading..." : count}
          </div>
          <button 
            className={styles.refreshButton}
            onClick={fetchCount}
            disabled={isLoading}
          >
            🔄 Refresh Count
          </button>
        </div>

        {/* Counter Controls */}
        <div className={styles.controlsSection}>
          <h3>Counter Controls</h3>
          <div className={styles.buttonGrid}>
            <button 
              className={`${styles.actionButton} ${styles.incrementButton}`}
              onClick={handleIncrement}
              disabled={isLoading || !account}
            >
              {isLoading ? "..." : "➕ Increment"}
            </button>
            
            <button 
              className={`${styles.actionButton} ${styles.resetButton}`}
              onClick={() => handleSetNumber(0)}
              disabled={isLoading || !account}
            >
                {isLoading ? "..." : "🔄 Reset to 0"}
            </button>
          </div>
        </div>

        {/* ERC20 Transfer Controls */}
        <div className={styles.controlsSection}>
          <h3>ERC20 Token Transfer</h3>
          <div className={styles.transferSection}>
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              className={styles.addressInput}
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder="Amount (USDT)"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className={styles.amountInput}
              disabled={isLoading}
            />
            <button 
              className={`${styles.actionButton} ${styles.transferButton}`}
              onClick={handleTransferUSDT}
              disabled={isLoading || !account || !transferRecipient || !transferAmount}
            >
              {isLoading ? "..." : "💸 Transfer USDT"}
            </button>
          </div>
        </div>

        {/* Transaction Status */}
        {txHash && (
          <div className={styles.txStatus}>
            <h3>Transaction Status</h3>
            <p className={styles.txHash}>{txHash}</p>
          </div>
        )}

        {/* Instructions */}
        <div className={styles.instructions}>
          <h3>Instructions</h3>
          <ul>
            <li>Make sure your wallet is connected</li>
            <li>Set NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS in your .env</li>
            <li>Click buttons to interact with the counter contract</li>
            <li>Check console for detailed logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
