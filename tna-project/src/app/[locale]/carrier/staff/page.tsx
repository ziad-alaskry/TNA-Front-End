'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import {
  User,
  Phone,
  ShieldCheck,
  IdentificationCard,
  CheckCircle,
  WarningCircle,
  PlusCircle,
  Shield,
  ArrowsDownUp
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'

// Aligned with carrier_staff table from data model v2.1
interface StaffMember {
  staff_id: string;
  full_name: string;
  employee_id: string;
  position: 'DRIVER' | 'DISPATCHER' | 'MANAGER';
  mobile: string;
  is_active: boolean;
  national_id?: string;
  license_number?: string; // For drivers
  last_login_at?: string;
}

const mockStaff: StaffMember[] = [
  {
    staff_id: 'STF-001',
    full_name: 'محمد علي River',
    employee_id: 'EMP-1001',
    position: 'DRIVER',
    mobile: '0501234567',
    is_active: true,
    national_id: '1234567890',
    license_number: 'DL-9876543',
    last_login_at: '2026-05-09T08:30:00Z'
  },
  {
    staff_id: 'STF-002',
    full_name: 'إبراهيم حسن',
    employee_id: 'EMP-1002',
    position: 'DISPATCHER',
    mobile: '0509876543',
    is_active: true,
    last_login_at: '2026-05-10T06:15:00Z'
  },
  {
    staff_id: 'STF-003',
    full_name: 'خالد صالح',
    employee_id: 'EMP-1003',
    position: 'MANAGER',
    mobile: '0505551234',
    is_active: true,
    last_login_at: '2026-05-10T07:00:00Z'
  },
  {
    staff_id: 'STF-004',
    full_name: 'فهد السبيعي',
    employee_id: 'EMP-1004',
    position: 'DRIVER',
    mobile: '0507778888',
    is_active: false,
    national_id: '0987654321',
    license_number: 'DL-1234567',
    last_login_at: '2026-05-08T12:45:00Z'
  },
];

export default function CarrierStaffPage() {
  const { locale, t } = useLocale();

  const columns: DataTableColumn<StaffMember>[] = [
    {
      key: 'full_name',
      label: t('carrier.staff_page.columns.employee_name'),
      render: (_, row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User size={20} weight="bold" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-neutral-900 truncate">{t(`carrier.staff_page.names.${row.staff_id}`)}</span>
            <span className="text-[10px] text-neutral-400 truncate">ID: {row.staff_id}</span>
          </div>
        </div>
      )
    },
    {
      key: 'position',
      label: t('carrier.staff_page.columns.position'),
      width: '120px',
      render: (val) => {
        const position = val as StaffMember['position'];
        const labels: Record<StaffMember['position'], string> = {
          DRIVER: t('carrier.staff_page.positions.DRIVER'),
          DISPATCHER: t('carrier.staff_page.positions.DISPATCHER'),
          MANAGER: t('carrier.staff_page.positions.MANAGER'),
        };
        const icons: Record<StaffMember['position'], React.ReactNode> = {
          DRIVER: <ShieldCheck size={14} className="text-primary" />,
          DISPATCHER: <Phone size={14} className="text-secondary" />,
          MANAGER: <IdentificationCard size={14} className="text-success" />,
        };
        return (
          <div className="flex items-center gap-2">
            {icons[position]}
            <span className="text-sm font-semibold text-neutral-700">{labels[position]}</span>
          </div>
        );
      }
    },
    {
      key: 'mobile',
      label: t('carrier.staff_page.columns.mobile'),
      width: '120px',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-neutral-400 shrink-0" />
          <span className="text-xs text-neutral-600 font-mono">{val}</span>
        </div>
      )
    },
    {
      key: 'employee_id',
      label: t('carrier.staff_page.columns.employee_id'),
      width: '110px',
      render: (val) => (
        <span className="text-xs text-neutral-500 font-mono">{val}</span>
      )
    },
    {
      key: 'is_active',
      label: t('carrier.staff_page.columns.status'),
      width: '100px',
      render: (val) => {
        const status = val
          ? { label: 'نشط', class: 'bg-success-bg text-success', icon: <CheckCircle size={12} /> }
          : { label: t('carrier.staff_page.status.inactive'), class: 'bg-neutral-100 text-neutral-500', icon: <WarningCircle size={12} /> };
        if (val) status.label = t('carrier.staff_page.status.active');
        return (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-wider ${status.class}`}>
            {status.icon}
            {status.label}
          </div>
        );
      }
    },
    {
      key: 'last_login_at',
      label: t('carrier.staff_page.columns.last_login'),
      width: '120px',
      render: (val) => (
        <span className="text-xs text-neutral-400">{val ? new Date(val).toLocaleDateString(locale) : '—'}</span>
      )
    },
    {
      key: 'staff_id',
      label: '',
      width: '80px',
      render: () => (
        <div className="flex justify-end gap-1">
          <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 transition-colors" title={t('carrier.staff_page.actions.view_details')}>
            <ArrowsDownUp size={18} />
          </button>
          <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 transition-colors" title={t('carrier.staff_page.actions.more')}>
            <Shield size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AppShell role="Carrier" header={t('carrier.staff_page.header')}>
      <DataTableLayout
        title={t('carrier.staff_page.title')}
        columns={columns}
        data={mockStaff}
        onRowClick={(row) => console.log('View staff details:', row.staff_id)}
      >
        <button
          className="h-11 px-6 rounded-sm bg-primary text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-btn"
        >
          <PlusCircle size={20} weight="bold" />
          {t('carrier.staff_page.actions.add_staff')}
        </button>
      </DataTableLayout>
    </AppShell>
  );
}
