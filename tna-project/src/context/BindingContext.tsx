'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TNA, TNAStatus } from '@/lib/types/tna';
import { Binding } from '@/lib/types/bindings';
import { OwnerAccount } from '@/lib/types/naOwner';
import { Property } from '@/lib/types/owner';

interface BindingContextType {
  visitorTnas: TNA[];
  addVisitorTna: (tna: Partial<TNA>) => void;
  acceptBindingRequest: (id: string, fee: number) => void;
  ownerAccount: OwnerAccount;
  realEstateObjects: Property[];
}

const BindingContext = createContext<BindingContextType | undefined>(undefined);

export const BindingProvider = ({ children }: { children: ReactNode }) => {
  const [visitorTnas, setVisitorTnas] = useState<TNA[]>([
    {
      tna_id: 'vtna-1',
      tna_code: 'TNA-667722',
      visitor_id: 'visitor-01',
      issuance_request_id: 'req-01',
      status: 'ACTIVE',
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      tna_id: 'vtna-2',
      tna_code: 'TNA-102938',
      visitor_id: 'visitor-01',
      issuance_request_id: 'req-02',
      status: 'ACTIVE', // Changed for testing navigation
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);
  const [ownerAccount, setOwnerAccount] = useState<OwnerAccount>({
    account_id: 'acc-01',
    owner_id: 'owner-01',
    current_balance: 450.75,
    pending_balance: 0,
    total_earned: 0,
    total_paid_out: 0,
    currency: 'SAR',
    payout_method: 'BANK_TRANSFER',
    account_status: 'ACTIVE',
    updated_at: new Date().toISOString(),
  });

  const [realEstateObjects, setRealEstateObjects] = useState<Property[]>([
    {
      id: 'prop-01',
      name: 'فيلا الملقا ١٢',
      building_number: '1029',
      sector_id: 'ML-04',
      is_verified: true,
    },
    {
      id: 'prop-02',
      name: 'عمارة النرجس',
      building_number: '5566',
      sector_id: 'NR-01',
      is_verified: true,
    }
  ]);

  // --- Persistence Logic ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedTnas = localStorage.getItem('tna_visitor_tnas');
        const savedAccount = localStorage.getItem('tna_owner_account');

        if (savedTnas) {
            try {
                setVisitorTnas(JSON.parse(savedTnas));
            } catch (e) {
                console.error('Failed to parse visitorTnas from localStorage', e);
            }
        }

        if (savedAccount) {
            try {
                setOwnerAccount(JSON.parse(savedAccount));
            } catch (e) {
                console.error('Failed to parse ownerAccount from localStorage', e);
            }
        }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tna_visitor_tnas', JSON.stringify(visitorTnas));
  }, [visitorTnas]);

  useEffect(() => {
    localStorage.setItem('tna_owner_account', JSON.stringify(ownerAccount));
  }, [ownerAccount]);

  const addVisitorTna = (tna: Partial<TNA>) => {
    const newTna: TNA = {
      ...tna,
      tna_id: `vtna-${Math.random().toString(36).substr(2, 9)}`,
      status: tna.status || 'UNLINKED',
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months default
    } as TNA;
    setVisitorTnas(prev => [...prev, newTna]);
  };

  const acceptBindingRequest = (id: string, fee: number) => {
    setVisitorTnas(currentTnas =>
      currentTnas.map(tna => {
        if (tna.tna_id === id) {
          setOwnerAccount(prev => ({
            ...prev,
            current_balance: prev.current_balance + fee,
            total_earned: prev.total_earned + fee,
            updated_at: new Date().toISOString(),
          }));
          return { ...tna, status: 'ACTIVE' };
        }
        return tna;
      })
    );
  };

  return (
    <BindingContext.Provider value={{ 
        visitorTnas,
        addVisitorTna,
        acceptBindingRequest,
        ownerAccount,
        realEstateObjects
    }}>
      {children}
    </BindingContext.Provider>
  );
};

export const useBindingContext = () => {
  const context = useContext(BindingContext);
  if (context === undefined) {
    throw new Error('useBindingContext must be used within a BindingProvider');
  }
  return context;
};
