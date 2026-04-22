'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTNAContext } from '@/context/TNAContext'; // Import the context
import { ActiveRole } from '@/context/TNAContext'; // Import the type
import Button from '@/components/ui/Button'; // Assuming Button component

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

interface TenantSwitcherProps {}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = () => {
  const { activeRole, setActiveRole } = useTNAContext();
  const router = useRouter();

  const handleRoleChange = (newRole: ActiveRole) => {
    setActiveRole(newRole);
    let redirectPath = '';

    switch (newRole) {
      case 'GOV':
        redirectPath = '/gov/verify';
        break;
      case 'CARRIER':
        redirectPath = '/carrier/fleet';
        break;
      case 'ADMIN':
        redirectPath = '/admin/dashboard'; // Assuming an admin dashboard path
        break;
      default:
        redirectPath = '/'; // Fallback
    }

    router.push(redirectPath);
  };

  const getButtonClasses = (role: ActiveRole) => {
    let baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200';
    let colorClasses = '';
    let hoverClasses = '';

    if (role === activeRole) {
      switch (role) {
        case 'GOV':
          colorClasses = 'bg-slate-800 text-white shadow-md';
          hoverClasses = ''; // No hover needed for active
          break;
        case 'CARRIER':
          colorClasses = 'bg-amber-500 text-white shadow-md';
          hoverClasses = '';
          break;
        case 'ADMIN':
          colorClasses = 'bg-gray-700 text-white shadow-md'; // Example neutral for Admin
          hoverClasses = '';
          break;
      }
    } else {
      switch (role) {
        case 'GOV':
          colorClasses = 'text-slate-800';
          hoverClasses = 'hover:bg-slate-100';
          break;
        case 'CARRIER':
          colorClasses = 'text-amber-500';
          hoverClasses = 'hover:bg-amber-50';
          break;
        case 'ADMIN':
          colorClasses = 'text-gray-600'; // Example neutral for Admin
          hoverClasses = 'hover:bg-gray-100';
          break;
      }
    }
    return `${baseClasses} ${colorClasses} ${hoverClasses}`;
  };

  return (
    // Changed space-x-4 to gap-4 for agnostic RTL spacing
    <div className="flex items-center gap-4 p-2"> 
      <span className="text-sm font-medium text-gray-600 ps-2">{t('switchRole')}:</span> {/* Logical start padding */}
      <Button onClick={() => handleRoleChange('GOV')} className={getButtonClasses('GOV')}>
        {t('government')}
      </Button>
      <Button onClick={() => handleRoleChange('CARRIER')} className={getButtonClasses('CARRIER')}>
        {t('carrier')}
      </Button>
      <Button onClick={() => handleRoleChange('ADMIN')} className={getButtonClasses('ADMIN')}>
        {t('admin')}
      </Button>
    </div>
  );
};
