'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { User } from '@/lib/types/auth';

interface QuickLoginProps {
  locale: string;
}

export const QuickLogin: React.FC<QuickLoginProps> = ({ locale }) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  if (process.env.NODE_ENV !== 'development') return null;

  const quickLogins = [
    { 
      label: 'Visitor', 
      role: 'visitor', 
      color: 'bg-blue-500',
      user_role: 'VISITOR' as const,
    },
    { 
      label: 'Owner', 
      role: 'owner', 
      color: 'bg-green-500',
      user_role: 'OWNER' as const,
    },
    { 
      label: 'Carrier', 
      role: 'carrier', 
      color: 'bg-purple-500',
      user_role: 'CARRIER_STAFF' as const,
    },
    { 
      label: 'Gov', 
      role: 'gov', 
      color: 'bg-red-500',
      user_role: 'GOV_USER' as const,
    },
  ];

  const handleQuickLogin = (login: typeof quickLogins[0]) => {
    // Build mock user for the selected role
    const mockUser: User = {
      user_id: `dev-${login.role}-1`,
      username: `dev_${login.role}`,
      email: `${login.role}@example.com`,
      user_role: login.user_role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      full_name: `Demo ${login.label}`,
      nationality: 'SA',
      document_number: '1234567890',
    };

    // Set auth state with a dummy token
    setAuth(mockUser, 'mock-jwt-token-' + login.role);
    router.push(`/${locale}/${login.role}/home`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-white p-4 rounded-md shadow-xl border border-neutral-200 flex flex-col gap-2 max-w-[200px]">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-1">
        Dev Quick Login
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickLogins.map((login) => (
          <button
            key={login.role}
            onClick={() => handleQuickLogin(login)}
            className={`${login.color} text-white text-[10px] font-bold py-2 px-1 rounded-sm hover:opacity-90 transition-opacity`}
          >
            {login.label}
          </button>
        ))}
      </div>
    </div>
  );
};
