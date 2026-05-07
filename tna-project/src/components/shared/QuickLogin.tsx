'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface QuickLoginProps {
  locale: string;
}

export const QuickLogin: React.FC<QuickLoginProps> = ({ locale }) => {
  const router = useRouter();

  if (process.env.NODE_ENV !== 'development') return null;

  const quickLogins = [
    { label: 'Visitor', role: 'visitor', color: 'bg-blue-500' },
    { label: 'Owner', role: 'owner', color: 'bg-green-500' },
    { label: 'Carrier', role: 'carrier', color: 'bg-purple-500' },
    { label: 'Gov', role: 'gov', color: 'bg-red-500' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-white p-4 rounded-md shadow-xl border border-neutral-200 flex flex-col gap-2 max-w-[200px]">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-1">
        Dev Quick Login
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickLogins.map((login) => (
          <button
            key={login.role}
            onClick={() => router.push(`/${locale}/${login.role}/home`)}
            className={`${login.color} text-white text-[10px] font-bold py-2 px-1 rounded-sm hover:opacity-90 transition-opacity`}
          >
            {login.label}
          </button>
        ))}
      </div>
    </div>
  );
};
