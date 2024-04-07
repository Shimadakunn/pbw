"use client";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";

import Background from "@/public/images/2-white.png";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import Logo from "@/public/logo-white.png";

const Landing = () => {
    const { login } = useWeb3Auth();
    return (
        <main className="relative h-screen w-screen">
            <header className="text-5xl font-[Monument] font-black tracking-tighter pl-8 pt-4 flex items-center justify-start">
                <Image src={Logo} width={50} height={50} alt="logo" className="mr-4"/>
                <div>KUMA</div> 
            </header>
            <div className="absolute left-0 bottom-0 h-[90vh] pl-28">
                <Image src={Background} alt="landing" className="w-full h-full object-cover"/>
                <div className="bg-primary w-full h-[80%] absolute left-0 bottom-0">
                </div>
            </div>
            <div className="absolute left-0 bottom-0 h-[90vh] pl-28">
                <Image src={Background} alt="landing" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-0 bottom-0 h-[90vh] w-[45%] flex items-start justify-center space-y-16 flex-col pl-12">
                <h1 className="text-5xl font-[Monument] font-black tracking-tighter">OWN YOUR MONEY</h1>
                <p className="text-2xl font-light tracking-tighter">Take control of your money and data</p>
                <Button className="bg-foreground rounded-none hover:bg-foreground/90 tracking-tighter" onClick={login}>GET STARTED</Button>
            </div>
        </main>
    );
}

export default Landing;