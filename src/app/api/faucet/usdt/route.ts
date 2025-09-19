import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { MOCK_USDT_ABI, MOCK_USDT_ADDRESS } from "@/constants/MockUSDTAbi";

// In-memory storage for faucet recipients (in production, use database)
const faucetRecipients = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { account } = await request.json();

    if (!account) {
      return NextResponse.json(
        { error: "Account address is required" },
        { status: 400 }
      );
    }

    // Check if account has already received faucet
    if (faucetRecipients.has(account.toLowerCase())) {
      return NextResponse.json(
        { error: "This account has already received USDT from the faucet" },
        { status: 429 }
      );
    }

    // Get faucet private key from server environment (without NEXT_PUBLIC_ prefix)
    const faucetPrivateKey = process.env.FAUCETER_PRIVATE_KEY;
    if (!faucetPrivateKey) {
      return NextResponse.json(
        { error: "Faucet private key not configured" },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(
      "https://public-en-kairos.node.kaia.io"
    );
    const faucetSigner = new ethers.Wallet(faucetPrivateKey, provider);

    // Create contract instance with faucet signer
    const usdtContract = new ethers.Contract(
      MOCK_USDT_ADDRESS,
      MOCK_USDT_ABI,
      faucetSigner
    );

    const amountInWei = ethers.parseUnits("100", 6);

    console.log(`Transferring 100 USDT to ${account}...`);
    const transferTx = await usdtContract.transfer(account, amountInWei);

    console.log(
      `Transfer transaction sent. Hash: ${transferTx.hash}. Waiting for confirmation...`
    );
    const transferReceipt = await transferTx.wait();

    if (transferReceipt.status === 0) {
      throw new Error("Transfer transaction failed");
    }

    console.log("Faucet transfer confirmed successfully!");

    // Add account to faucet recipients set
    faucetRecipients.add(account.toLowerCase());

    return NextResponse.json({
      success: true,
      txHash: transferTx.hash,
      message: "Successfully transferred 100 USDT",
    });
  } catch (error) {
    console.error("Faucet API failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
