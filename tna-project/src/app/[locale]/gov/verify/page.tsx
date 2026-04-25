'use client'

import React from 'react';
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'; 
import Button from '@/components/ui/Button'; 
import { useGovContext } from '@/context/GovContext'; 
import { TNAIssuanceRequest } from '@/lib/types/tna';

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

export default function GovVerifyPage() {
  // Consume global state for TNA data and update function
  const { tnaData, updateTnaStatus, activeRole } = useGovContext();

  // Define the columns for the DataTable
  const tnaColumns: DataTableColumn<TNAIssuanceRequest>[] = [
    {
      key: 'visitor_id',
      label: t('visitorId'),
    },
    {
      key: 'mode_at_submission',
      label: t('submissionMode'),
    },
    {
      key: 'created_at',
      label: t('requestDate'),
    },
    {
      key: 'request_id',
      label: t('actions'),
      render: (val, row) => {
        const tna = row;

        // Updated to use context function
        const handleApprove = () => {
          updateTnaStatus(tna.request_id, 'APPROVED');
          alert(`TNA Approved for ID: ${tna.request_id}`);
        };

        const handleReject = () => {
          updateTnaStatus(tna.request_id, 'REJECTED');
          alert(`TNA Rejected for ID: ${tna.request_id}`);
        };

        return (
          <div className="flex space-x-2 text-start">
            <Button onClick={handleApprove} variant="success">
              {t('approve')}
            </Button>
            <Button onClick={handleReject} variant="danger">
              {t('reject')}
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter out TNA requests that are no longer PENDING (e.g., already approved or rejected)
  const pendingTnas = tnaData.filter(tna => tna.request_status === 'PENDING');

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
