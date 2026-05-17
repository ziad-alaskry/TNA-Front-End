'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TNA, TNAStatus } from '@/lib/types/tna';
import { Binding } from '@/lib/types/bindings';
import { OwnerAccount } from '@/lib/types/naOwner';
import { Property } from '@/lib/types/owner';
import { FinancialTransaction } from '@/lib/types/ledger';
import { ShipmentStatus } from '@/lib/types/deliveries';

interface BindingContextType {
  visitorTnas: TNA[];
  addVisitorTna: (tna: Partial<TNA>) => void;
  acceptBindingRequest: (id: string, fee: number) => void;
  initiateBindingRequest: (tnaId: string, subAddressId: string) => Promise<void>;
  processPayment: (bindingId: string, amount?: number) => Promise<boolean>;
  verifyPayment: (bindingId: string) => Promise<boolean>;
  activateBinding: (bindingId: string) => Promise<void>;
  terminateBinding: (bindingId: string) => Promise<{ success: boolean; error?: string }>;
  getActiveShipmentsForTNA: (tnaId: string) => any[];
  toggleAutoAccept: (propertyId: string) => void;
  ownerAccount: OwnerAccount;
  realEstateObjects: Property[];
  financialTransactions: FinancialTransaction[];
  pendingBindings: Binding[];
  addPendingBinding: (binding: Binding) => void;
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
      status: 'ACTIVE',
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      tna_id: 'vtna-3',
      tna_code: 'TNA-EMAA5083',
      visitor_id: 'visitor-01',
      issuance_request_id: 'req-03',
      status: 'PENDING_OWNER_APPROVAL',
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
    currency: '\u20C1',
    payout_method: 'BANK_TRANSFER',
    payout_details: undefined,
    last_payout_at: undefined,
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
      auto_accept: false,
    },
    {
      id: 'prop-02',
      name: 'عمارة النرجس',
      building_number: '5566',
      sector_id: 'NR-01',
      is_verified: true,
      auto_accept: true,
    }
  ]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([
    {
      transaction_id: 'txn-001',
      user_id: 'visitor-01',
      user_role: 'VISITOR',
      transaction_type: 'TNA_ISSUANCE_FEE',
      amount: 150,
      currency: '\u20C1',
      status: 'COMPLETED',
      description: 'TNA issuance fee',
      metadata: { tna_code: 'TNA-667722' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      transaction_id: 'txn-002',
      user_id: 'visitor-01',
      user_role: 'VISITOR',
      transaction_type: 'RENTAL_PAYMENT',
      amount: 75,
      currency: '\u20C1',
      status: 'COMPLETED',
      description: 'Monthly rental payment',
      metadata: { tna_code: 'TNA-667722' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]);
  const [pendingBindings, setPendingBindings] = useState<Binding[]>([
    {
      binding_id: 'bind-101',
      tna_id: 'vtna-3',
      sub_address_id: 'sub-01',
      rent_contract_id: 'rc-01',
      status: 'PENDING',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tna_code: 'TNA-EMAA5083',
      na_id: 'na-01',
      visitor_id: 'visitor-01',
    },
  ]);

  // --- Persistence Logic ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedTnas = localStorage.getItem('tna_visitor_tnas');
        const savedAccount = localStorage.getItem('tna_owner_account');
        const savedBindings = localStorage.getItem('tna_pending_bindings');
        const savedTxns = localStorage.getItem('tna_financial_txns');

        if (savedTnas) {
            try { setVisitorTnas(JSON.parse(savedTnas)); } catch (e) { console.error('Failed to parse visitorTnas', e); }
        }
        if (savedAccount) {
            try { setOwnerAccount(JSON.parse(savedAccount)); } catch (e) { console.error('Failed to parse ownerAccount', e); }
        }
        if (savedBindings) {
            try { setPendingBindings(JSON.parse(savedBindings)); } catch (e) { console.error('Failed to parse pendingBindings', e); }
        }
        if (savedTxns) {
            try { setFinancialTransactions(JSON.parse(savedTxns)); } catch (e) { console.error('Failed to parse financialTxns', e); }
        }
    }
  }, []);

  useEffect(() => { localStorage.setItem('tna_visitor_tnas', JSON.stringify(visitorTnas)); }, [visitorTnas]);
  useEffect(() => { localStorage.setItem('tna_owner_account', JSON.stringify(ownerAccount)); }, [ownerAccount]);
  useEffect(() => { localStorage.setItem('tna_pending_bindings', JSON.stringify(pendingBindings)); }, [pendingBindings]);
  useEffect(() => { localStorage.setItem('tna_financial_txns', JSON.stringify(financialTransactions)); }, [financialTransactions]);

  const addVisitorTna = (tna: Partial<TNA>) => {
    const newTna: TNA = {
      ...tna,
      tna_id: `vtna-${Math.random().toString(36).substr(2, 9)}`,
      status: tna.status || 'UNLINKED',
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    } as TNA;
    setVisitorTnas(prev => [...prev, newTna]);
  };

  const initiateBindingRequest = async (tnaId: string, subAddressId: string) => {
    const newBinding: Binding = {
      binding_id: `bind-${Date.now()}`,
      tna_id: tnaId,
      sub_address_id: subAddressId,
      rent_contract_id: `rc-${Date.now()}`,
      status: 'PENDING',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tna_code: visitorTnas.find(t => t.tna_id === tnaId)?.tna_code || '',
      na_id: subAddressId,
      visitor_id: 'visitor-01',
    };
    setPendingBindings(prev => [newBinding, ...prev]);
  };

  const processPayment = async (bindingId: string, amount?: number): Promise<boolean> => {
    try {
      const binding = pendingBindings.find(b => b.binding_id === bindingId);
      if (!binding) { throw new Error('Binding not found'); }
      const txnAmount = amount || 150;
      const newTxn: FinancialTransaction = {
        transaction_id: `txn-${Date.now()}`,
        order_id: `ord-${Date.now()}`,
        binding_id: bindingId,
        user_id: 'visitor-01',
        user_role: 'VISITOR',
        transaction_type: 'RENTAL_PAYMENT',
        amount: txnAmount,
        currency: '\u20C1',
        status: 'COMPLETED',
        description: 'Binding rental payment',
        metadata: { tna_code: binding.tna_code },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setFinancialTransactions(prev => [newTxn, ...prev]);
      setOwnerAccount(prev => ({
        ...prev,
        current_balance: prev.current_balance + txnAmount,
        total_earned: prev.total_earned + txnAmount,
        updated_at: new Date().toISOString(),
      }));
      return true;
    } catch (err) { return false; }
  };

  const addPendingBinding = (binding: Binding) => {
    setPendingBindings(prev => [binding, ...prev]);
  };

  const verifyPayment = async (bindingId: string): Promise<boolean> => {
    const bindingTxns = financialTransactions.filter(t => t.binding_id === bindingId && t.transaction_type === 'RENTAL_PAYMENT');
    return bindingTxns.some(t => t.status === 'COMPLETED');
  };

  const activateBinding = async (bindingId: string) => {
    const hasPaid = await verifyPayment(bindingId);
    if (!hasPaid) { throw new Error('Payment not completed'); }
    setVisitorTnas(current =>
      current.map(tna =>
        pendingBindings.some(b => b.binding_id === bindingId && b.tna_id === tna.tna_id)
          ? { ...tna, status: 'ACTIVE' as TNAStatus }
          : tna
      )
    );
    setPendingBindings(current =>
      current.map(b => b.binding_id === bindingId
        ? { ...b, status: 'ACTIVE' as 'ACTIVE', approved_at: new Date().toISOString(), approved_by_owner_id: 'owner-01', updated_at: new Date().toISOString() }
        : b
      )
    );
  };

  const getActiveShipmentsForTNA = (tnaId: string) => [];

   const terminateBinding = async (bindingId: string) => {
     const binding = pendingBindings.find(b => b.binding_id === bindingId);
     if (!binding) { return { success: false, error: 'Binding not found' }; }
     const inTransitShipments = getActiveShipmentsForTNA(binding.tna_id);
     if (inTransitShipments.length > 0) {
       return { success: false, error: 'Cannot unlink: Active deliveries in progress (409 Conflict)' };
     }
     setVisitorTnas(current =>
       current.map(tna => tna.tna_id === binding.tna_id ? { ...tna, status: 'UNLINKED' as TNAStatus } : tna)
     );
     setPendingBindings(current =>
       current.map(b => b.binding_id === bindingId
         ? { ...b, status: 'TERMINATED' as 'TERMINATED', termination_reason: 'User requested', updated_at: new Date().toISOString() }
         : b
       )
     );
     return { success: true };
   };

   const acceptBindingRequest = (id: string, fee: number) => {
    setPendingBindings(current =>
      current.map(b => b.binding_id === id ? { ...b, status: 'ACTIVE' } : b)
    );
    setOwnerAccount(prev => ({
      ...prev,
      current_balance: prev.current_balance + fee,
      total_earned: prev.total_earned + fee,
      updated_at: new Date().toISOString(),
    }));
  };

  const toggleAutoAccept = (propertyId: string) => {
    setRealEstateObjects(prev => prev.map(prop =>
      prop.id === propertyId ? { ...prop, auto_accept: !prop.auto_accept } : prop
    ));
  };

  return (
    <BindingContext.Provider value={{
        visitorTnas,
        addVisitorTna,
        acceptBindingRequest,
        initiateBindingRequest,
        processPayment,
        verifyPayment,
        activateBinding,
        terminateBinding,
        getActiveShipmentsForTNA,
        toggleAutoAccept,
        ownerAccount,
        realEstateObjects,
        financialTransactions,
        pendingBindings,
        addPendingBinding,
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
