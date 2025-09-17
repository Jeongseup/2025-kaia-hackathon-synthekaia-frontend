/* GUIDELINE https://docs.dappportal.io/mini-dapp/design-guide#connect-button */
import styles from "./WalletButton.module.css";
import {Logo} from "@/components/Assets/Logo";
import {useKaiaWalletSdk} from "@/components/Wallet/Sdk/walletSdk.hooks";
import {useWalletAccountStore} from "@/components/Wallet/Account/auth.hooks";
import {Dispatch, SetStateAction} from "react";

export type WalletButtonProps = {
  setIsLoggedIn:  Dispatch<SetStateAction<boolean>>;
}
export const WalletButton = ({setIsLoggedIn}:WalletButtonProps)=> {
  const { connectAndSign } = useKaiaWalletSdk();
  const { setAccount } = useWalletAccountStore();

  const handleClick = async () => {
    try {
      const result = await connectAndSign("connect");
      if (result) {
        const [account] = result;
        setAccount(account);
        setIsLoggedIn(true);
      }
    }
    catch (error: unknown) {
      console.log(error);
    }
  }
    return (
      <button className={styles.root} onClick={handleClick}>
        <Logo className={styles.icon}/>
        <span className={styles.description}>Connect</span>
      </button>
    );
}