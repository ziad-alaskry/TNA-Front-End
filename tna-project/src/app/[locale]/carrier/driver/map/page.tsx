'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    NavigationArrow, 
    CheckCircle, 
    XCircle, 
    MapPin, 
    Phone, 
    Clock,
    ArrowRight,
    CaretLeft,
    WarningCircle,
    CaretRight
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

export default function DriverMapPage() {
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    return (
        <AppShell role="Carrier" header={t('carrier.driver.map.header')}>
            <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
                {/* Map Interface (Placeholder) */}
                <div className="flex-1 rounded-md border border-neutral-200 bg-surface-200 relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                    
                    {/* Simulated Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                        <path 
                            d="M 200,400 Q 300,300 400,450 T 600,350" 
                            fill="none" 
                            stroke="var(--color-primary)" 
                            strokeWidth="8" 
                            strokeLinecap="round"
                            strokeDasharray="16 12"
                            className="animate-pulse"
                        />
                    </svg>

                    {/* Ship Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="bg-white px-3 py-1 rounded shadow-lg border border-neutral-200 mb-2 whitespace-nowrap">
                            <span className="text-xs font-bold text-neutral-900">{t('carrier.driver.map.mock_full_address').split('،')[0]} - TNA-667722</span>
                        </div>
                        <div className="w-10 h-10 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
                            <MapPin size={24} weight="fill" />
                        </div>
                    </div>

                    <p className="text-xs text-neutral-400 font-medium z-10 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-pill border border-neutral-200">{t('carrier.driver.map.placeholder_text')}</p>
                </div>

                {/* Sidebar Details */}
                <div className="w-full md:w-[360px] flex flex-col gap-4">
                    <div className="p-6 rounded-md bg-neutral-900 text-white shadow-lg flex flex-col justify-between h-[200px]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{t('carrier.driver.map.current_task')}</span>
                                <div className="flex items-center gap-1.5 text-success">
                                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] font-bold">{t('carrier.driver.map.active_status')}</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-mono font-bold tracking-wider mb-1">TNA-667722</h3>
                            <p className="text-xs opacity-60">{t('carrier.driver.map.delivery_desc')}</p>
                        </div>
                        <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                            <div className="flex-1">
                                <p className="text-[10px] text-white/40 uppercase mb-0.5">{t('carrier.driver.map.distance')}</p>
                                <p className="text-sm font-bold">{t('carrier.driver.map.mock_distance')}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/40 uppercase mb-0.5">{t('carrier.driver.map.eta')}</p>
                                <p className="text-sm font-bold">{t('carrier.driver.map.mock_eta')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 rounded-md border border-neutral-200 bg-surface-200 flex flex-col overflow-y-auto">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{t('carrier.driver.map.delivery_date')}</p>
                                    <p className="text-sm font-bold text-neutral-900">{t('carrier.driver.map.mock_date')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{t('carrier.driver.map.delivery_address_tna')}</p>
                                    <p className="text-xs font-bold text-neutral-700 leading-relaxed">{t('carrier.driver.map.mock_full_address')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 space-y-3">
                            <button className="w-full h-12 bg-success text-white font-bold rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                <CheckCircle size={20} weight="bold" />
                                {t('carrier.driver.map.confirm_delivery')}
                            </button>
                            <div className="flex gap-2">
                                <button className="flex-1 h-12 bg-neutral-100 text-neutral-600 font-bold rounded-sm text-xs flex items-center justify-center gap-2">
                                    <Phone size={18} />
                                    {t('carrier.driver.map.call')}
                                </button>
                                <button className="flex-1 h-12 bg-error/5 text-error font-bold border border-error/10 rounded-sm text-xs flex items-center justify-center gap-2">
                                    <WarningCircle size={18} />
                                    {t('carrier.driver.map.report_issue')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.push(`/${locale}/carrier/driver/tasks`)}
                        className="h-12 w-full flex items-center justify-between px-6 bg-surface-200 border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors"
                    >
                        <span className="text-xs font-bold text-neutral-500">{t('carrier.driver.map.back_to_tasks')}</span>
                        <CaretRight size={18} weight="bold" className="rotate-180" />
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
