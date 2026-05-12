'use client';

import { useState, useEffect } from 'react';
import { mockBalances } from '@/lib/mock/financials.mock';
import { useAuthStore } from '@/lib/store/useAuthStore';

export function useWallet() {
  const { user } = useAuthStore();
  const userId = user?.user_id || 'user-visitor-1';
  
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const savedBalance = localStorage.getItem(`tna_wallet_balance_${userId}`);
    if (savedBalance !== null) {
      setBalance(parseFloat(savedBalance));
    } else {
      const initial = mockBalances[userId] || 0;
      setBalance(initial);
      localStorage.setItem(`tna_wallet_balance_${userId}`, initial.toString());
    }
  }, [userId]);

  const updateBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem(`tna_wallet_balance_${userId}`, newBalance.toString());
    // Dispatch event for other components to sync
    window.dispatchEvent(new Event('wallet-update'));
  };

  useEffect(() => {
    const handleUpdate = () => {
      const savedBalance = localStorage.getItem(`tna_wallet_balance_${userId}`);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
      }
    };
    window.addEventListener('wallet-update', handleUpdate);
    return () => window.removeEventListener('wallet-update', handleUpdate);
  }, [userId]);

  return { balance, updateBalance };
}
