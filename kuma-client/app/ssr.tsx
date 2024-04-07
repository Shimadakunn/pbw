"use client";
import { chain } from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";

import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {
  const { octaneTransfer } = useWeb3Auth();
  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="flex items-center justify-between px-6">
          <div className="w-28">Token</div>
          <div className="w-28 text-center">Last 7 days</div>
          <div className="w-28 text-center">Market Cap</div>
          <div className="w-28 text-center">Price</div>
          <div className="w-20 text-right">Balance</div>
          <Button
            onClick={async () => {
              await octaneTransfer!();
            }}
          />
        </div>
        <ScrollArea className="h-[75vh]">
          {Object.keys(token).map((key) => (
            key !== "fee-mumbai" && <Token key={key} tok={key} />
          ))}
        </ScrollArea>
      </div>
    </main>
  );
}
type Pool = {
  tok: string;
};
const Token: React.FC<Pool> = ({ tok }) => {
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-6 my-1">
      <div className="w-28 flex items-center justify-start">
        <Image
          src={
            token[tok].logo ||
            `https://cryptofonts.com/img/icons/${token[
            tok
          ].coin.toLowerCase()}.svg`}
          width={40}
          height={40}
          alt={tok}
          className="mr-2"
        />
        {token[tok].coin}
      </div>
      <div className="w-28 text-center">
        <Image
            src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/${token[tok].chart}.svg`}
            width={150}
            height={150}
            alt={tok}
            className={`${token[tok].side}`}
          />
      </div>
      <div className="w-28 text-center font-thin text-base text-slate-400 font-[SFPro]">
        {token[tok].mkcap}
      </div>
      <div className="w-28 text-center font-thin text-base text-slate-400 font-[SFPro]">
        {token[tok].price}
      </div>
      <div className="w-20 text-right">
        {token[tok].balance ? token[tok].balance!.slice(0, 6) : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
    </div>
  );
};