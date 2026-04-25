'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
    children: React.ReactNode;
}

const roleThemes: Record<string, string> = {
    VISITOR: 'bg-white',
    OWNER: 'bg-black text-white',
    GOV_USER: 'bg-gray-100',
    CARRIER_STAFF: 'bg-yellow-50',
};

export default function AppLayout({ children }: AppLayoutProps) {
    const { role } = useAuthStore();
    const themeClass = role ? roleThemes[role] || 'bg-white' : 'bg-white';

    return (
        <div className={`min-h-screen flex flex-col ${themeClass}`}>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}