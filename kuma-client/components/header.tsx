"use client";

import { token } from "@/config/tokenConfig";

import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import { usePathname } from "next/navigation";

import { Fuel,Plus } from 'lucide-react';

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
import { Input } from "@/components/ui/input";
import { useEffect, useReducer, useState } from "react";

const Header = () => {
  const { topUpGas } = useWeb3Auth();
  const path = usePathname();

  const [supplyAmount, setSupplyAmount] = useState<number>();
  const [reducer, dispatch] = useReducer(x => x+1, 0);

  const [gasTank, setGasTank] = useState<string>();
  useEffect(() => {
    setGasTank(token["fee-mumbai"].balance);
  }, [reducer]);

  return (
    <header className="w-full h-[10vh] flex items-center justify-between border-b border-foreground p-8">
      <div className="font-[Monument] text-4xl tracking-tight">
        {path === "/"
          ? "DASHBOARD"
          : path === "/swap"
          ? "CRYPTO"
          : path === "/stake"
          ? "FINANCE"
          : path === "/profile"
          ? "PROFILE"
          : path === "/send"
          ? "SEND / RECEIVE"
          : path === "/onramp"
          ? "ONRAMP"
          : ""}
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger>
        <div className="px-4 border border-gray-600 rounded-full h-[6vh] bg-primary/20 flex items-center justify-center">
        <Fuel size={18} color="gray"/>
        <div className="ml-2">
          {gasTank?.slice(0,6)} USDC
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
            Solde: {gasTank}
            <span
              className="ml-1 text-secondary/80 cursor-pointer"
              onClick={() => setSupplyAmount(parseFloat(gasTank!))}
            >
              Max
            </span>
          </div>
        </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-secondary/90 text-primary-foreground hover:bg-secondary/60" onClick={async () => {
              await topUpGas(supplyAmount!.toString(),dispatch);
            }}>
            Supply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </header>
  );
};

export default Header;