import { create } from "zustand";

type WalletRefreshStore = {
  refreshKey: number;
  refreshWallet: () => void;
};

export const useWalletRefresh = create<WalletRefreshStore>((set) => ({
  refreshKey: 0,
  refreshWallet: () =>
    set((state) => ({
      refreshKey: state.refreshKey + 1,
    })),
}));