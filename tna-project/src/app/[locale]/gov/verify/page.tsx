'use client'

import React from 'react';
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'; 
import Button from '@/components/ui/Button'; 
import { useTNAContext } from '@/context/TNAContext'; 
import { PendingTna, ActiveRole } from '@/context/TNAContext';

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

export default function GovVerifyPage() {
  // Consume global state for TNA data and update function
  const { tnaData, updateTnaStatus, activeRole } = useTNAContext(); // Use activeRole for potential conditional rendering or logic

  // Define the columns for the DataTable
  const tnaColumns: DataTableColumn<PendingTna>[] = [
    {
      key: 'visitorName',
      label: t('visitorName'),
    },
    {
      key: 'propertyBuilding',
      label: t('propertyBuilding'),
    },
    {
      key: 'requestedDuration',
      label: t('requestedDuration'),
    },
    {
      key: 'id',
      label: t('actions'),
      render: (val, row) => {
        const tna = row;

        // Updated to use context function
        const handleApprove = () => {
          console.log(`Approving TNA ID: ${tna.id}`);
          updateTnaStatus(tna.id, 'APPROVED');
          alert(`TNA Approved for ${tna.visitorName}`);
        };

        const handleReject = () => {
          console.log(`Rejecting TNA ID: ${tna.id}`);
          updateTnaStatus(tna.id, 'REJECTED');
          alert(`TNA Rejected for ${tna.visitorName}`);
        };

        return (
          <div className="flex space-x-2 text-start">
            <Button onClick={handleApprove} variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
              {t('approve')}
            </Button>
            <Button onClick={handleReject} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              {t('reject')}
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter out TNA requests that are no longer PENDING (e.g., already approved or rejected)
  const pendingTnas = tnaData.filter(tna => tna.status === 'PENDING');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6 text-slate-800 border-b-2 border-blue-600">{t('pendingTnaVerifications')}</h1>
      <DataTableLayout
        title={t('pendingTnaVerifications')}
        columns={tnaColumns}
        data={pendingTnas} // Use data from context
        // Add search/filter options if needed
      />
    </div>
  );
}
