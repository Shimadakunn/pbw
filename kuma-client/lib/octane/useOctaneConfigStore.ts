import create, { State } from 'zustand';
import {loadOctaneConfig, OctaneConfig, TokenFee} from "./octane";

interface OctaneConfigStore extends State {
  config: OctaneConfig | null;
  fetchOctaneConfig: () => void
  // Update the return type to include `undefined` as a possible return value
  getTransferFeeConfig: (mint: string) => TokenFee | undefined,
  getATAFeeConfig: (mint: string) => TokenFee | undefined,
  getSwapFeeConfig: (mint: string) => TokenFee | undefined,
}

const findByMint = (fees: TokenFee[], mint) => fees.find(fee => fee.mint === mint);

const useOctaneConfigStore = create<OctaneConfigStore>((set, get) => ({
  config: null,

  fetchOctaneConfig: async () => {
    const config = await loadOctaneConfig();
    set((s) => {
      s.config = config;
      console.log(`loaded octane config: `, config);
    })
  },

  getTransferFeeConfig: (mint: string) => {
    console.log("config", get().config);
    return findByMint(get().config.endpoints.transfer.tokens, mint);
  },

  getATAFeeConfig: (mint: string) => {
    return findByMint(get().config.endpoints.createAssociatedTokenAccount.tokens, mint);
  },

  getSwapFeeConfig: (mint: string) => {
    return findByMint(get().config.endpoints.whirlpoolsSwap.tokens, mint);
  },
}));

export default useOctaneConfigStore;
