'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TNAIssuanceRequest } from '@/lib/types/tna';
import { UserRole } from '@/lib/types/auth';

interface GovContextType {
  tnaData: TNAIssuanceRequest[];
  updateTnaStatus: (id: string, status: TNAIssuanceRequest['request_status']) => void;
  activeRole: UserRole;
}

const initialGovTnaData: TNAIssuanceRequest[] = [
    { request_id: 'tna-01', visitor_id: 'V1', request_status: 'PENDING', mode_at_submission: 'MODERATED', supporting_documents: [], created_at: new Date().toISOString() },
    { request_id: 'tna-02', visitor_id: 'V2', request_status: 'PENDING', mode_at_submission: 'MODERATED', supporting_documents: [], created_at: new Date().toISOString() },
    { request_id: 'tna-03', visitor_id: 'V3', request_status: 'PENDING', mode_at_submission: 'MODERATED', supporting_documents: [], created_at: new Date().toISOString() },
];

const GovContext = createContext<GovContextType | undefined>(undefined);

export const GovProvider = ({ children }: { children: ReactNode }) => {
  const [tnaData, setTnaData] = useState<TNAIssuanceRequest[]>(initialGovTnaData);
  const [activeRole] = useState<UserRole>('GOV_USER');

  const updateTnaStatus = (id: string, status: TNAIssuanceRequest['request_status']) => {
    setTnaData(current => current.map(tna => tna.request_id === id ? { ...tna, request_status: status } : tna));
  }

  return (
    <GovContext.Provider value={{ 
        tnaData,
        updateTnaStatus,
        activeRole
    }}>
      {children}
    </GovContext.Provider>
  );
};

export const useGovContext = () => {
  const context = useContext(GovContext);
  if (context === undefined) {
    throw new Error('useGovContext must be used within a GovProvider');
  }
  return context;
};
