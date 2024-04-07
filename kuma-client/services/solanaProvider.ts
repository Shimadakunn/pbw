"use client"

import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { CustomChainConfig } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import { IWalletProvider } from "./walletProvider";

import { token } from "@/config/tokenConfig";

import { toast } from "sonner";

import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress
} from "@solana/spl-token";

const ethersWeb3Provider = (provider: any): IWalletProvider => {

    const getAddress = async (): Promise<string> => {
        try {
          const solanaWallet = new SolanaWallet(provider as any);
          const acc = await solanaWallet.requestAccounts();
        return acc[0];
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const getBalance = async (tok: string): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(provider as any);
            const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
              method: "solana_provider_config",
              params: [],
            });
            const conn = new Connection(connectionConfig.rpcTarget);
            const accounts = await solanaWallet.requestAccounts();
            let balance = await conn.getBalance(new PublicKey(accounts[0]));
            balance = balance / LAMPORTS_PER_SOL;
            if (token[tok].address) {
              const tokenAccount1Pubkey = new PublicKey(token[tok].address!);
              console.log(tokenAccount1Pubkey);
              let tokenAccountBalance = await conn.getTokenAccountBalance(tokenAccount1Pubkey);
              console.log(tokenAccountBalance);
              balance = parseFloat(tokenAccountBalance.value.amount) / Math.pow(10, tokenAccountBalance.value.decimals);
            }
            token[tok].balance = balance.toString();
            return balance.toString();
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const signTransaction = async (message: any): Promise<any> => {
        try {
          const solanaWallet = new SolanaWallet(provider as any);
          const connectionConfig = await solanaWallet.request({
            method: "solana_provider_config",
            params: [],
          });
          const connection = new Connection(connectionConfig.rpcTarget);

          const pubKey = await solanaWallet.requestAccounts();
          const { blockhash } = await connection.getRecentBlockhash("finalized");
          const sign = await solanaWallet.signTransaction(message);
            return "sign";
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const sendTransaction = async (amount: number, destination: string): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(provider as any);
  
            const accounts = await solanaWallet.requestAccounts();
      
            const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
              method: "solana_provider_config",
              params: [],
            });
            const connection = new Connection(connectionConfig.rpcTarget);
      
            const block = await connection.getLatestBlockhash("finalized");
      
            const TransactionInstruction = SystemProgram.transfer({
              fromPubkey: new PublicKey(accounts[0]),
              toPubkey: new PublicKey(destination),
              lamports: amount * LAMPORTS_PER_SOL,
            });
      
            const transaction = new Transaction({
              blockhash: block.blockhash,
              lastValidBlockHeight: block.lastValidBlockHeight,
              feePayer: new PublicKey(accounts[0]),
            }).add(TransactionInstruction);
      
            const { signature } = await solanaWallet.signAndSendTransaction(
              transaction
            );
      
            return signature;
        } catch (error: any) {
          return error as string;
        }
      };
    
      const getPrivateKey = async (): Promise<string> => {
        try {
          const solanaWallet = new SolanaWallet(provider as any);
            const privateKey = await solanaWallet.request({
                method: "solanaPrivateKey",
              });
          
              return privateKey as string;
        } catch (error: any) {
          toast.error(error);
          return error as string;
        }
      };

      const getConnection = async (): Promise<any> => {
        const solanaWallet = new SolanaWallet(provider as any);
        const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
            method: "solana_provider_config",
            params: [],
        });
        const conn = new Connection(connectionConfig.rpcTarget);        
        return conn;
      };
    
      return {
        getAddress,
        getBalance,
        signTransaction,
        sendTransaction,
        getPrivateKey,
        getConnection,
      };
    };
    
    export default ethersWeb3Provider;