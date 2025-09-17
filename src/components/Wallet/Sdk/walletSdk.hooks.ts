"use client";

import { create } from "zustand/react";
import { useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DappPortalSDKType,
  default as DappPortalSDK,
} from "@/utils/dapp-portal-sdk";
import { liff } from "@/utils/liff";

type KaiaWalletSdkState = {
  sdk: DappPortalSDKType | null;
  setSdk: (sdk: DappPortalSDKType | null) => void;
};

export const useKaiaWalletSdkStore = create<KaiaWalletSdkState>((set) => ({
  sdk: null,
  setSdk: (sdk) => set({ sdk }),
}));

export const initializeKaiaWalletSdk = async () => {
  try {
    const sdk = await DappPortalSDK.init({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
    });
    return sdk as DappPortalSDKType;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return null;
  }
};

export const useKaiaWalletSecurity = () => {
  const { setSdk } = useKaiaWalletSdkStore();
  return useQuery({
    queryKey: ["wallet", "sdk"],
    queryFn: async () => {
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID as string,
      });
      setSdk(await initializeKaiaWalletSdk());
      return true;
    },
    throwOnError: true,
  });
};

// export type Block = 'latest' | 'earliest';

export type Transaction = {
  from: string;
  to: string;
  data: string;
  value: string | null;
  gas: string | null;
};

export const useKaiaWalletSdk = () => {
  const { sdk } = useKaiaWalletSdkStore();
  if (!sdk) {
    throw new Error("KaiaWalletSdk is not initialized");
  }

  const walletProvider = sdk.getWalletProvider();
  const isRequestProcessing = useRef(false);

  const getAccount = useCallback(async () => {
    if (isRequestProcessing.current) {
      return;
    }
    isRequestProcessing.current = true;
    try {
      const addresses = (await walletProvider.request({
        method: "kaia_accounts",
      })) as string[];
      return addresses[0];
    } finally {
      isRequestProcessing.current = false;
    }
  }, [walletProvider]);

  const requestAccount = useCallback(async () => {
    if (isRequestProcessing.current) {
      return;
    }
    isRequestProcessing.current = true;
    try {
      const addresses = (await walletProvider.request({
        method: "kaia_requestAccounts",
      })) as string[];
      return addresses[0];
    } finally {
      isRequestProcessing.current = false;
    }
  }, [walletProvider]);

  const connectAndSign = useCallback(
    async (msg: string) => {
      if (isRequestProcessing.current) {
        return;
      }
      isRequestProcessing.current = true;
      try {
        const [account, signature] = (await walletProvider.request({
          method: "kaia_connectAndSign",
          params: [msg],
        })) as string[];
        return [account, signature];
      } finally {
        isRequestProcessing.current = false;
      }
    },
    [walletProvider]
  );

  const getBalance = useCallback(
    async (
      params: [account: string, blockNumberOrHash: "latest" | "earliest"]
    ) => {
      if (isRequestProcessing.current) {
        return;
      }
      isRequestProcessing.current = true;
      try {
        return await walletProvider.request({
          method: "kaia_getBalance",
          params: params,
        });
      } finally {
        isRequestProcessing.current = false;
      }
    },
    [walletProvider]
  );

  const disconnectWallet = useCallback(async () => {
    if (isRequestProcessing.current) {
      return;
    }
    isRequestProcessing.current = true;
    try {
      await walletProvider.disconnectWallet();
      window.location.reload();
    } finally {
      isRequestProcessing.current = false;
    }
  }, [walletProvider]);

  const sendTransaction = useCallback(
    async (params: Transaction[]) => {
      if (isRequestProcessing.current) {
        return;
      }
      isRequestProcessing.current = true;
      try {
        return await walletProvider.request({
          method: "kaia_sendTransaction",
          params: params,
        });
      } finally {
        isRequestProcessing.current = false;
      }
    },
    [walletProvider]
  );

  const getErc20TokenBalance = useCallback(
    async (contractAddress: string, account: string) => {
      if (isRequestProcessing.current) {
        return;
      }
      isRequestProcessing.current = true;
      try {
        return await walletProvider.getErc20TokenBalance(
          contractAddress,
          account
        );
      } finally {
        isRequestProcessing.current = false;
      }
    },
    [walletProvider]
  );
  return {
    getAccount,
    requestAccount,
    connectAndSign,
    disconnectWallet,
    getBalance,
    sendTransaction,
    getErc20TokenBalance,
    walletProvider,
  };
};