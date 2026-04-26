'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    NavigationArrow, 
    CheckCircle, 
    Clock, 
    MapPin, 
    Phone, 
    SelectionBackground,
    Package,
    ArrowRight
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

interface DriverTask {
    id: string;
    tna_code: string;
    customer: string;
    address: string;
    time: string;
    status: 'PENDING' | 'NAVIGATING' | 'DELIVERED';
    priority: 'HIGH' | 'NORMAL';
}

export default function DriverTasksPage() {
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const mockTasks: DriverTask[] = [
        { id: 'TSK-01', tna_code: 'TNA-667722', customer: t('carrier.driver.tasks.mock_customer_1'), address: t('carrier.driver.tasks.mock_address_1'), time: '١٠:٣٠ ص', status: 'NAVIGATING', priority: 'HIGH' },
        { id: 'TSK-02', tna_code: 'TNA-102938', customer: t('carrier.driver.tasks.mock_customer_2'), address: t('carrier.driver.tasks.mock_address_2'), time: '١١:١٥ ص', status: 'PENDING', priority: 'NORMAL' },
        { id: 'TSK-03', tna_code: 'TNA-229911', customer: t('carrier.driver.tasks.mock_customer_3'), address: t('carrier.driver.tasks.mock_address_3'), time: '١٢:٠٠ م', status: 'PENDING', priority: 'NORMAL' },
    ];

    return (
        <AppShell role="Carrier" header={t('carrier.driver.tasks.header')}>
            <div className="space-y-6">
                {/* Driver Stats Header */}
                <div className="flex items-center gap-4 p-6 bg-surface-200 rounded-md border border-neutral-200">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
                        <SelectionBackground size={32} weight="duotone" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{mockTasks.length}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">{t('carrier.driver.tasks.captain_name').replace('{name}', t('carrier.driver.tasks.mock_captain'))}</h2>
                        <p className="text-xs text-neutral-500 font-medium mt-1">{t('carrier.driver.tasks.today_date').replace('{date}', t('carrier.driver.tasks.mock_date'))}</p>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">{t('carrier.driver.tasks.scheduled_tasks')}</h3>
                    
                    {mockTasks.map((task) => (
                        <div key={task.id} className={`p-4 rounded-md border transition-all ${
                            task.status === 'NAVIGATING' ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' : 'border-neutral-200 bg-surface-200 hover:border-neutral-300'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-primary text-lg">{task.tna_code}</span>
                                    {task.priority === 'HIGH' && (
                                        <span className="px-2 py-0.5 bg-error/10 text-error text-[8px] font-bold rounded-pill">{t('carrier.driver.tasks.high_priority')}</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold text-neutral-400">{task.time}</span>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-neutral-400 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-neutral-900">{task.customer}</span>
                                        <span className="text-xs text-neutral-500 leading-relaxed">{task.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-neutral-100 flex gap-3">
                                {task.status === 'NAVIGATING' ? (
                                    <>
                                        <button 
                                            onClick={() => router.push(`/${locale}/carrier/driver/map?task=${task.id}`)}
                                            className="flex-1 h-11 bg-primary text-white text-sm font-bold rounded-sm flex items-center justify-center gap-2"
                                        >
                                            <NavigationArrow size={20} weight="fill" />
                                            {t('carrier.driver.tasks.resume_navigation')}
                                        </button>
                                        <button className="w-12 h-11 bg-success/10 text-success rounded-sm flex items-center justify-center">
                                            <CheckCircle size={24} weight="fill" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="flex-1 h-11 bg-neutral-900 text-white text-sm font-bold rounded-sm hover:bg-black transition-colors">
                                            {t('carrier.driver.tasks.start_task')}
                                        </button>
                                        <button className="w-12 h-11 bg-neutral-100 text-neutral-400 rounded-sm flex items-center justify-center">
                                            <Phone size={20} weight="fill" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
