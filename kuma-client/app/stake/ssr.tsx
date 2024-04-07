"use client";
import { contract } from "@/config/contractConfig";
import { token } from "@/config/tokenConfig";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useReducer, useState,useCallback, use } from "react";

import {PublicKey,clusterApiUrl,Cluster,Connection} from "@solana/web3.js";
import {
    createAssociatedTokenAccount,
    sendTransactionWithTokenFee,
    buildTransactionToTransfer,
    buildTransactionToCreateAccount
} from "../../lib/octane/octane";
import useOctaneConfigStore from "../../lib/octane/useOctaneConfigStore";
import useTransferFormStore, { ATAState } from "../../lib/octane/useTransferFormStore";

export default function Home() {
  const { addresses, signTransaction } = useWeb3Auth();
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
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="flex items-center justify-between px-4">
          <div className="w-28">Token</div>
          <div className="w-20 text-center">Protocol</div>
          <div className="w-20 text-center">APY</div>
          <div className="w-20 text-center">TVL</div>
          <div className="w-20 text-center">Available</div>
          <div className="w-20 text-center">Locked</div>
          <div className="w-20 text-right"></div>
          <div className="w-20 text-right"></div>
        </div>
        {Object.keys(contract).map((key) =>
          contract[key].tokenArray.map((tok) => (
            <StakePool key={tok} tok={tok} cont={key} apy={10} tvl={1} />
          ))
        )}
        <div onClick={()=>transfer()}>
          <StakePool key={"solana-devnet"} tok={"solana-devnet"} cont={"aave-mumbai-pool"} apy={13.2} tvl={1}/>
        </div>
      </div>
    </main>
  );
}
type Pool = {
  tok: string;
  cont: string;
  apy: number;
  tvl: number;
};
const StakePool: React.FC<Pool> = ({ tok, cont, apy, tvl }) => {
  const { supplyAave, withdrawAave } =
    useWeb3Auth();

  const [supplyAmount, setSupplyAmount] = useState<number>();
  const [withdrawAmount, setWithdrawAmount] = useState<number>();

  const [reducer, dispatch] = useReducer(x => x+1, 0);

  const [balance, setBalance] = useState<string | undefined>(token[tok].balance);
  const [aaveBalance, setAaveBalance] = useState<string | undefined>(token[tok].aaveBalance);
  
  useEffect(() => {
    setBalance(token[tok].balance);
    setAaveBalance(token[tok].aaveBalance);
  },[reducer])

  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4">
      <div className="w-28 flex items-center justify-start">
        <Image src={
            token[tok].logo ||
            `https://cryptofonts.com/img/icons/${token[
            tok
          ].coin.toLowerCase()}.svg`} width={40} height={40} alt={tok} className="mr-2"/>
        {token[tok].coin}
      </div>
      <div className="w-20 flex items-center justify-center">
        <Image src={token[tok].pool!} width={40} height={40} alt={tok}/>
      </div>
      <div className="w-20 text-center">
        {token[tok].apy}
      </div>
      <div className="w-20 text-center">
        {token[tok].tvl}
      </div>
      <div className="w-20 text-center">
        {balance ? balance.slice(0,6) : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
      <div className="w-20 text-center">
        {aaveBalance ? aaveBalance.slice(0,6) : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
            <Button
            className="w-20 text-right"
            variant={"secondary"}
          >
            Supply
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supply in this vault?</AlertDialogTitle>
            <AlertDialogDescription>
              You can lock here an amount of {token[tok].coin} to earn interest on.
            </AlertDialogDescription>
            <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You supply
          </div>
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={supplyAmount}
            onChange={(e) => setSupplyAmount(parseFloat(e.target.value))}
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl">
            {token[tok].coin}
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
            Solde: {token[tok!].balance ? token[tok!].balance : <Skeleton className="w-14 h-4 bg-gray-600" />}
            <span
              className="ml-1 text-secondary/80 cursor-pointer"
              onClick={() => setSupplyAmount(parseFloat(token[tok!].balance!))}
            >
              Max
            </span>
          </div>
        </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-secondary/90 text-primary-foreground hover:bg-secondary/60" onClick={async () => {
              await supplyAave(cont, tok, supplyAmount!.toString(),dispatch);
            }}>
            Supply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger>
            <Button
            className="w-20 text-right"
          >
            Withdraw
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw from this vault?</AlertDialogTitle>
            <AlertDialogDescription>
              You can withdraw from this vault at any time and get back your founds and you interest you gained.
            </AlertDialogDescription>
            <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You withdraw
          </div>
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl">
            {token[tok].coin}
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
            Solde: {token[tok!].aaveBalance ? token[tok!].aaveBalance : <Skeleton className="w-14 h-4 bg-gray-600" />}
            <span
              className="ml-1 text-secondary/80 cursor-pointer"
              onClick={() => setWithdrawAmount(parseFloat(token[tok!].aaveBalance!))}
            >
              Max
            </span>
          </div>
        </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction  onClick={async () => {
                await withdrawAave(cont, tok, withdrawAmount!.toString(),dispatch);
              }}>
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};