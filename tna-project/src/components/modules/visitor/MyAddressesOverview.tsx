'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useT } from '@/lib/hooks/useT';
import { Plus, House, MapPin } from '@phosphor-icons/react';

// Mock addresses data
const mockAddresses = [
    { id: '1', name: 'البيت', address: 'الرياض، حي الياسمين' },
    { id: '2', name: 'العمل', address: 'الرياض، حي العليا' },
    { id: '3', name: 'الاستراحة', address: 'الدرعية' },
    { id: '4', name: 'بيت الأهل', address: 'جدة، حي الشاطئ' },
    { id: '5', name: 'المكتب الجديد', address: 'الخبر، حي التعاون' },
];

export default function MyAddressesOverview() {
    const { t } = useT();
    const { role } = useAuthStore();

    const addressesCount = mockAddresses.length;
    const isLimitReached = addressesCount >= 5;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-tna-gray-900">عناويني المسجلة</h2>
                <span className="text-sm font-medium text-tna-gray-500">
                    ({addressesCount}/5)
                </span>
            </div>

            <div className="space-y-4">
                {mockAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 bg-white rounded-2xl border border-tna-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <House size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-tna-gray-900">{addr.name}</h3>
                            <p className="text-sm text-tna-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={14} />
                                {addr.address}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Button with 5 TNA Limit Logic */}
            <button
                disabled={isLimitReached}
                className={`w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${isLimitReached
                        ? 'bg-tna-gray-200 text-tna-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                    }`}
            >
                <Plus size={20} />
                <span>إنشاء عنوان وطني جديد</span>
            </button>

            {isLimitReached && (
                <p className="text-center text-sm text-tna-gray-500 font-medium">
                    لقد وصلت للحد الأقصى للعناوين (5 عناوين)
                </p>
            )}
        </div>
    );
}