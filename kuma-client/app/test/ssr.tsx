"use client"
import {PublicKey,clusterApiUrl,Cluster,Connection} from "@solana/web3.js";
import {
    createAssociatedTokenAccount,
    sendTransactionWithTokenFee,
    buildTransactionToTransfer,
    buildTransactionToCreateAccount
} from "../../lib/octane/octane";
import useOctaneConfigStore from "../../lib/octane/useOctaneConfigStore";
import useTransferFormStore, { ATAState } from "../../lib/octane/useTransferFormStore";
import { useEffect, useCallback, use } from "react";

import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import { Button } from "@/components/ui/button";

const Page = () => {
    const { getConnection, addresses, signTransaction } = useWeb3Auth();
    const publicKey = addresses[1];
    const cluster: Cluster = "devnet";
    const connection = new Connection(clusterApiUrl(cluster));

    const octaneConfig = useOctaneConfigStore((s) => s.config);
    const feePayer = useOctaneConfigStore((s) => s.config ? new PublicKey(s.config.feePayer) : null);
    const { fetchOctaneConfig, getTransferFeeConfig, getATAFeeConfig } = useOctaneConfigStore();
    useEffect(() => {fetchOctaneConfig();}, [fetchOctaneConfig]);
  
    const mint = useTransferFormStore((s) => s.mint);
    const address = useTransferFormStore((s) => s.address);
    const amount = useTransferFormStore((s) => s.amount);
    const accountState = useTransferFormStore((s) => s.accountState);
    const { setMint, setAddress, setAmount, updateAccountState } = useTransferFormStore();

    const transfer = useCallback(async () => {
        const mintAsPublicKey = "HbAo3NPbDbDoZ1BwMNaVx1mtziDpKsPEpyohEZkCd3Yd";
        const addressAsPublicKey = "2y17As4NmPaVx2QnNviJx1PSXeLbv4aRzCgWxsi8GHL8";

        const transferFeeConfig = {
            mint: "HbAo3NPbDbDoZ1BwMNaVx1mtziDpKsPEpyohEZkCd3Yd",
            account: "41LHqhvqbWoariobSgkHgc959WLNg3eGZtz3btV2yM1B",
            decimals: 9,
            fee: 10000000
        }
        const transferTransaction = await buildTransactionToTransfer(
          connection,
          feePayer,
          transferFeeConfig,
          mintAsPublicKey,
          publicKey,
          addressAsPublicKey,
          Math.floor(parseFloat("10") * (10 ** 9))
        );
        const signedTransferTransaction = await signTransaction!(transferTransaction);
        console.log("signedTransferTransaction", signedTransferTransaction)
        const transferTxId = await sendTransactionWithTokenFee(signedTransferTransaction);
      }, [mint, address, accountState, feePayer, publicKey, amount, getTransferFeeConfig, getATAFeeConfig]);

    return ( 
        <Button onClick={()=>transfer()}>Click me</Button>
    );
}

export default Page;