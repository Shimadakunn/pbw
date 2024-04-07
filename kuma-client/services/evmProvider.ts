import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { Presets, Client } from "userop";

import { chain } from "@/config/chainConfig";
import { contract } from "@/config/contractConfig";
import { token } from "@/config/tokenConfig";
import ERC20 from "@/public/abi/ERC20.json";
import AAVEETH from "@/public/abi/aave-native-pool.json";
import AAVE from "@/public/abi/aave-pool.json";
import FEE from "@/public/abi/fee-mint.json";

// import { json } from "stream/consumers";
import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";
import { cp } from "fs";

const rpcUrl = "https://api.stackup.sh/v1/node/22dcc687cd819c6515df7457358d51d6bfde70ec27b8698ec4744264f372a659";
const paymasterUrl = "https://api.stackup.sh/v1/paymaster/22dcc687cd819c6515df7457358d51d6bfde70ec27b8698ec4744264f372a659";

const ethersWeb3Provider = (provider: IProvider | null): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const builder = await Presets.Builder.Kernel.init(signer as any, chain[token["fee-mumbai"].network].rpcTarget);
      const address = builder.getSender();
      return address;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getBalance = async (tok: string): Promise<string> => {
    try {
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });
      const ethersProvider = new ethers.JsonRpcProvider(chain[token[tok].network].rpcTarget);
      const signer = new ethers.Wallet(privateKey as string, ethersProvider);
      const builder = await Presets.Builder.Kernel.init(signer as any, chain[token[tok].network].rpcTarget);
      const address = builder.getSender();
      if (token[tok].address) {
        const contract = new ethers.Contract(
          token[tok].address!,
          ERC20,
          signer
        );
        const decimals = await contract.decimals();
        const res = ethers.formatUnits(
          await contract.balanceOf(address),decimals
        );
        const balance = (+res).toFixed(4);
        token[tok].balance = balance;
      } else {
        const res = ethers.formatEther(
          await ethersProvider.getBalance(address)
        );
        const balance = (+res).toFixed(4);
        token[tok].balance = balance;
      }
      if (token[tok].aave) {
        const contract = new ethers.Contract(
          token[tok].aave!,
          ERC20,
          signer
        );
        const decimals = await contract.decimals();
        const res = ethers.formatUnits(
          await contract.balanceOf(address),decimals
        );
        const balance = (+res).toFixed(4);
        token[tok].aaveBalance = balance;
      }
      return "success";
    } catch (error: any) {
      return error as string;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const sendTransaction = async (
    amount: number,
    destination: string,
    tok?: string
  ): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      let amountBigInt = ethers.parseEther(amount.toString());
      if(token[tok!].address){
        const erc20 = new ethers.Contract(token[tok!].address!, ERC20, signer);
        const decimals = await erc20.decimals();
        amountBigInt = ethers.parseUnits(amount.toString(),decimals);
        const tx = await erc20.transfer(destination, amountBigInt);
        await tx.wait();
        return tx.hash;
      }
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      return error as string;
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error: any) {
      return error as string;
    }
  };

  const supplyAave = async (cont: string,tok: string,amount: string) => {
    try {
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const contrac = new ethers.Contract(contract[cont].address,AAVE,signer);
      const erc20 = new ethers.Contract(token[tok].address!, ERC20, signer);
      const nonces = await erc20.nonces(address);
      const decimals = await erc20.decimals();
      const domain = {name: await erc20.name(),version: "1",chainId: (await ethersProvider!.getNetwork()).chainId,verifyingContract: token[tok].address!,};
      const types = {Permit: [{ name: "owner", type: "address" },{ name: "spender", type: "address" },{ name: "value", type: "uint256" },{ name: "nonce", type: "uint256" },{ name: "deadline", type: "uint256" },],};
      const message = {owner: address,spender: contract[cont].address,value: ethers.parseUnits(amount,decimals),nonce: nonces,deadline: expiry,};
      const signature = await signer.signTypedData(domain, types, message);
      const r = signature.slice(0, 66);
      const s = "0x" + signature.slice(66, 130);
      const v = Number("0x" + signature.slice(130, 132));
      const tx = await contrac.supplyWithPermit(token[tok].address!,ethers.parseUnits(amount,decimals),address,0,expiry,v,r,s, {gasLimit: 800000,});
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      return error as string;
    }
  };

  const withdrawAave = async (cont: string, tok: string,amount: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contrac = new ethers.Contract(contract[cont].address, AAVE, signer);
      const aerc20 = new ethers.Contract(token[tok].aave!, ERC20, signer);
      const decimals = await aerc20.decimals();
      const aerc20Balance = await aerc20.balanceOf(signer.getAddress());
      const tx = await contrac.withdraw(token[tok].address!,ethers.parseUnits(amount,decimals),signer.getAddress());
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      return error as string;
    }
  };

  const depositETHAave = async (cont: string, tok: string, amount: string) => {
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();
    const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(paymasterUrl!,{
      type: "erc20token",
      token: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"
    });
    const builder = await Presets.Builder.Kernel.init(signer as any, rpcUrl,{
      paymasterMiddleware: paymasterMiddleware,
    });
    const address = builder.getSender();
    const contrac = new ethers.Contract(contract[cont].address,AAVEETH,signer);
    const deposit = {
      to: contract[cont].address,
      value: ethers.parseEther(amount),
      data: contrac.interface.encodeFunctionData("depositETH", [contract[cont].wrappedAddress, address,0]),
    }
    builder.executeBatch([deposit]);
    console.log("Builder UseOp",builder.getOp());
    const client = await Client.init(rpcUrl!);
    const res = await client.sendUserOperation(builder, {
        onBuild: (op) => { console.log("Signed UserOp:",op) },
    });
    console.log("UserOp Hash:", res.userOpHash);
    console.log("Waiting for the transaction to be mined...");
    const ev = await res.wait();
    console.log("Transaction mined! Receipt:", ev?.transactionHash ?? "null");
    return ev!.transactionHash;
  };

  const withdrawETHAave = async (cont: string, tok: string,amount: string) => {
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();
    const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(paymasterUrl!,{
      type: "erc20token",
      token: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"
    });
    const builder = await Presets.Builder.Kernel.init(signer as any, rpcUrl,{
      paymasterMiddleware: paymasterMiddleware,
    });
    const address = builder.getSender();
    const aerc20 = new ethers.Contract(token[tok].aave!, ERC20, signer);
    const contrac = new ethers.Contract(contract[cont].address,AAVEETH,signer);
    const approve = {
      to: token[tok].aave!,
      value:"0",
      data: aerc20.interface.encodeFunctionData("approve", [contract[cont].address,ethers.parseEther(amount)]),
    }
    const withdraw = {
      to: contract[cont].address,
      value: "0",
      gasLimit: 800000,
      data: contrac.interface.encodeFunctionData("withdrawETH", [contract[cont].wrappedAddress,ethers.parseEther(amount),address]),
    }
    builder.executeBatch([approve,withdraw]);
    console.log("Builder UseOp",builder.getOp());
    const client = await Client.init(rpcUrl!);
    const res = await client.sendUserOperation(builder, {
        onBuild: (op) => { console.log("Signed UserOp:",op) },
    });
    console.log("UserOp Hash:", res.userOpHash);
    console.log("Waiting for the transaction to be mined...");
    const ev = await res.wait();
    console.log("Transaction mined! Receipt:", ev!.transactionHash ?? "null");
    return ev!.transactionHash;
  };

  const topUpGas = async (amount: string) => {
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();
    const builder = await Presets.Builder.Kernel.init(signer as any, chain[token["fee-mumbai"].network].rpcTarget);
    const address = builder.getSender();
    const contrac = new ethers.Contract(token["fee-mumbai"].address!,FEE,signer);
    const mint = await contrac.mint(address,ethers.parseUnits(amount,6));
    const receipt = await mint.wait();
    return receipt.hash;
  };

  return {
    getAddress,
    signMessage,
    sendTransaction,
    getPrivateKey,
    getBalance,
    supplyAave,
    withdrawAave,
    depositETHAave,
    withdrawETHAave,
    topUpGas,
  };
};

export default ethersWeb3Provider;
