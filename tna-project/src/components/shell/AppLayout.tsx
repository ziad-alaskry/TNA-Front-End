'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
    children: React.ReactNode;
}

const roleThemes: Record<string, string> = {
    visitor: 'bg-white',
    owner: 'bg-black text-white',
    gov: 'bg-gray-100',
    carrier: 'bg-yellow-50',
};

export default function AppLayout({ children }: AppLayoutProps) {
    const { userType } = useAuthStore();
    const themeClass = userType ? roleThemes[userType] || 'bg-white' : 'bg-white';

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