'use client';

import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Header />
            <main className="flex-1 w-full flex flex-col items-center">
                <div className="w-full ui-content-container px-4 md:px-6 py-6 md:py-8 flex-1 flex flex-col">
                    {children}
                </div>
            </main>
            <BottomNav />
            
            {/* Safe area spacer for mobile with BottomNav */}
            <div className="h-20 md:hidden bg-card" />
        </div>
    );
}