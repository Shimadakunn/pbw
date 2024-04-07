export type TokenType = {
    coin: string;
    name: string;
    network: string;
    address?: string;
    balance?: string;
    aave?: string;
    aaveBalance?: string;
    chart?: string;
    side?: string;
    mkcap?: string;
    logo?: string;
    price?: string;
    pool?: string;
    apy?: string;
    tvl?: string;
}


export const token: {
    [key: string]: TokenType;
  } = {
    // "ethereum-arbitrum-sepolia": {
    //     coin: "ETH",
    //     name: "Ethereum Sepolia",
    //     network : "Arbitrum Sepolia Testnet",
    //     price: "$3,256.67",
    //     chart: "1027",
    //     side: "isUp",
    //     mkcap: "$389,594,807,123",
    //     pool: "https://lido.fi/static/images/index/lido-dao/research-forum.svg",
    //     apy:"3.2%",
    //     tvl: "4.5M",
    //     aaveBalance: "0.0000"
    // },
    "fee-mumbai": {
        coin: "FEE",
        name: "Fee",
        network: "Polygon Mumbai Testnet",
        address: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
        price: "$0.9147",
        chart: "3890",
        side: "isUp",
        mkcap: "$9,061,963,663",
        pool: "https://cryptofonts.com/img/icons/aave.svg",
        apy:"9.3%",
        tvl: "783K"
    },
    "matic-mumbai": {
        coin: "MATIC",
        name: "Matic",
        network: "Polygon Mumbai Testnet",
        aave : "0xaCA5e6a7117F54B34B476aB95Bf3034c304e7a81",
        price: "$0.9147",
        chart: "3890",
        side: "isUp",
        mkcap: "$9,061,963,663",
        pool: "https://cryptofonts.com/img/icons/aave.svg",
        apy:"9.3%",
        tvl: "783K"
    },
    "dai-mumbai": {
        coin: "DAI",
        name: "Dai Mumbai",
        network: "Polygon Mumbai Testnet",
        address: "0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded",
        aave: "0x8903bbBD684B7ef734c01BEb00273Ff52703514F",
        price: "$0.9867",
        chart: "4943",
        side: "isDown",
        mkcap: "$4,951,681,576",
        pool: "https://cryptofonts.com/img/icons/mkr.svg",
        apy:"12.6%",
        tvl: "3.5M"
    },
    "usdc-mumbai": {
        coin: "USDC",
        name: "USD Coin Mumbai",
        network: "Polygon Mumbai Testnet",
        address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
        aave: "0x4086fabeE92a080002eeBA1220B9025a27a40A49",
        price: "$0.9964",
        chart: "3408",
        side: "isUp",
        mkcap: "$30,010,978,290",
        pool: "https://cryptofonts.com/img/icons/aave.svg",
        apy:"14.4%",
        tvl: "2.7M"
    },
    // "eurs-mumbai": {
    //     coin: "EURS",
    //     name: "EURS Mumbai",
    //     network: "Polygon Mumbai Testnet",
    //     address: "0xB516d30421d2A0524769A243BBE5e193E78ab35c",
    //     aave: "0x6fD1376295392f1F6F9EcCc89bff0e26dDB2aE74"
    // },
    "weth-mumbai": {
        coin: "WETH",
        name: "Wrapped Ether Mumbai",
        network: "Polygon Mumbai Testnet",
        address: "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
        aave: "0xAba444af64ad33A6d8575b8A353226997d6A126a",
        price: "$3,256.67",
        chart: "1027",
        side: "isUp",
        mkcap: "$389,594,807,123",
        pool: "https://cryptofonts.com/img/icons/aave.svg",
        apy:"3.2%",
        tvl: "4.5M"
    },
    "wbtc-mumbai": {
        // chart: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7",
        // price: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        coin: "WBTC",
        name: "Wrapped Bitcoin Mumbai",
        network: "Polygon Mumbai Testnet",
        address: "0x2Fa2e7a6dEB7bb51B625336DBe1dA23511914a8A",
        aave: "0xdA67e6C1171D4f0D522Db7f127B88405eA1535d4",
        price: "$64,410.69",
        chart: "1",
        side: "isUp",
        mkcap: "$1,266,757,322,314",
        pool: "https://cryptofonts.com/img/icons/aave.svg",
        apy:"2.5%",
        tvl: "1.2M"
    },
    // "avax-fuji": {
    //     coin: "AVAX",
    //     name: "Avalanche Fuji",
    //     network: "Avalanche Fuji Testnet",
    //     aave: "0x339f50bCbd874A892fb2c6A56Cf8D85Dd215Bf8e",
    //     price: "$49.48",
    //     chart: "5805",
    //     side: "isUp",
    //     mkcap: "$18,677,022,093",
    //     pool: "https://cryptofonts.com/img/icons/aave.svg",
    //     apy:"6.2%",
    //     tvl: "567K"
    // },
    "solana-devnet" :{
        coin: "SOL",
        name: "Solana Devnet",
        network: "Solana Devnet",
        price: "$178.09",
        chart: "5426",
        side: "isUp",
        mkcap: "$79,140,699,186",
        pool: "https://solend.fi/assets/tokens/slnd.png",
        apy:"5.3%",
        tvl: "459K",
        aaveBalance: "0.0000"
    },
    "mytoken-devnet" :{
        coin: "MTK",
        name: "MyToken Devnet",
        network: "Solana Devnet",
        price: "$178.09",
        chart: "5426",
        side: "isUp",
        mkcap: "$79,140,699,186",
        address: "HZv82jaPzVwkp7ASq7b9faqAYyZZ8Zfchb2vrABEWrNx",
        pool: "https://solend.fi/assets/tokens/slnd.png",
        apy:"5.3%",
        tvl: "459K",
        aaveBalance: "0.0000"
    },
    "starknet-goerli" :{
        coin: "STRK",
        name: "Starknet Goerli",
        network: "Starknet Goerli",
        address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        price: "$2.02",
        chart: "22691",
        side: "isUp",
        mkcap: "$1,470,086,769",
        pool: "https://s2.coinmarketcap.com/static/img/coins/64x64/22743.png",
        apy:"2.3%",
        tvl: "123K",
        aaveBalance: "0.0000"
    },
    "tezos-ghostnet" :{
        coin: "XTZ",
        name: "Tezos Ghostnet",
        network: "Tezos Ghostnet",
        price: "$1.31",
        chart: "2011",
        side: "isUp",
        mkcap: "$1,282,229,078",
        pool: "https://app.youves.com/assets/img/symbols/quipu.svg",
        apy:"1.4%",
        tvl: "64K",
        aaveBalance: "0.0000"
    },
    // "ethereum-sepolia": {
    //     coin: "ETH",
    //     name: "Ethereum Sepolia",
    //     decimals: 18,
    //     chainId: "0xaa36a7",
    //     network : "Sepolia Testnet"
    // },
    // "dai-sepolia": {
    //     coin: "DAI",
    //     name: "Dai Sepolia",
    //     decimals: 18,
    //     chainId: "0xaa36a7",
    //     network : "Sepolia Testnet",
    //     address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    //     aave: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8"
    // },
    // ethereum: {
    //     coin: "ETH",
    //     name: "Ethereum",
    //     decimals: 18,
    //     chainId: "0x1",
    //     network: "Ethereum",
    // },
    // usdc: {
    //     coin: "USDC",
    //     name: "USD Coin",
    //     decimals: 18,
    //     chainId: "0x1",
    //     network: "Ethereum",
    //     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // },
    // matic: {
    //     coin: "MATIC",
    //     name: "Matic",
    //     decimals: 18,
    //     chainId: "0x89",
    //     network: "Polygon",
    // },
    // solana :{
    //     coin: "SOL",
    //     name: "Solana",
    //     decimals: 9,
    //     chainId: "0x3",
    //     network: "Solana",
    // },
} 