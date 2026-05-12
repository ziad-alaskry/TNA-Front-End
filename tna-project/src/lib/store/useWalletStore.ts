import { create } from 'zustand';

interface WalletState {
  balance: number;
  setBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0, // initial balance, will be updated from auth/user data in a real app
  setBalance: (balance) => set({ balance }),
}));