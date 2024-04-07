"use client";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import Image from "next/image";

import { Copy, Fuel, Plus } from 'lucide-react';

import { toast } from 'sonner';
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Input } from "@/components/ui/input";
import { useState, useReducer, useEffect } from "react";

export default function Home() {
  const { user, logout, addresses, privateKeys } = useWeb3Auth();

  const { gas,topUpGas } = useWeb3Auth();

  const [supplyAmount, setSupplyAmount] = useState<number>();
  const [reducer, dispatch] = useReducer(x => x+1, 0);

  const [gasTank, setGasTank] = useState<number>();
  useEffect(() => {
    setGasTank(gas);
  }, [reducer]);

  return(
    <main className="flex items-center justify-center h-full">
        <div className="shadow p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
          <div className='p-1'>
            Profile
          </div>
          <div className="bg-primary/30 rounded-xl p-2 flex space-y-4 flex-col">
            <div className="flex items-center">
              {user.profileImage && <Image src={`${user.profileImage}`} alt="profile" width={75} height={75} className="rounded-xl"/>}
              <div className="h-full flex items-center justify-center text-2xl ml-2">
                {user.name}
              </div>
            </div>
            <div className="flex items-center justify-center flex-col space-y-2 px-4">
              <Keys address={addresses[0]} privateKey={privateKeys[0]} ticker="eth"/>
              <Keys address={addresses[1]} privateKey={privateKeys[1]} ticker="sol"/>
              <Keys address={addresses[2]} privateKey={privateKeys[2]} ticker="xtz"/>
              <Keys address={addresses[3]} privateKey={privateKeys[3]} ticker="strk"/>
            </div>
            <div className="flex items-center justify-end">
              <Button onClick={logout} variant="destructive">Logout</Button>
            </div>
          </div>
        </div>
         {/* <AlertDialog>
        <AlertDialogTrigger className="scale-150">
        <div className="w-40 border border-gray-600 rounded-full h-[6vh] bg-primary/20 flex items-center justify-center">
        <Fuel size={18} color="gray"/>
        <div className="ml-2">
          {gas} USDC
        </div>
        <div className="rounded-full bg-secondary ml-2">
          <Plus size={14} color="black" className="m-1"/>
        </div>
      </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supply in this vault?</AlertDialogTitle>
            <AlertDialogDescription>
              You can top up a gas amount.
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
            USDC
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
            Solde: {gas}
            <span
              className="ml-1 text-secondary/80 cursor-pointer"
              onClick={() => setSupplyAmount(gas)}
            >
              Max
            </span>
          </div>
        </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-secondary/90 text-primary-foreground hover:bg-secondary/60" onClick={async () => {
              await topUpGas(supplyAmount!,dispatch);
            }}>
            Supply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </main>
  )
}

const Keys : React.FC<{address: string, privateKey: string, ticker: string}> = ({address, privateKey,ticker}) => {
  return (
    <div className="rounded-lg bg-gray-600 p-2 flex items-center justify-center">
      <Image src={`https://cryptofonts.com/img/icons/${ticker}.svg`} width={30} height={30} alt="eth" className="mr-2"/>
      <div className="flex items-center justify-center flex-col space-y-2">
        <div className="flex items-center justify-center">
          <div className="truncate w-32">
            {address}
          </div> 
          <Copy className="ml-2 cursor-pointer" size={16} 
            onClick={()=>{
              navigator.clipboard.writeText(address);
              toast.success(ticker+' address copied to clipboard');
            }}/>
        </div>
        {/* <div className="flex items-center justify-center">
          <div className="truncate w-32">
            {privateKey}
          </div> 
          <Copy className="ml-2 cursor-pointer" size={16} 
            onClick={()=>{
              navigator.clipboard.writeText(privateKey);
              toast.success(ticker+' private key copied to clipboard');
            }}/>
        </div> */}
      </div>
    </div>
  )
}