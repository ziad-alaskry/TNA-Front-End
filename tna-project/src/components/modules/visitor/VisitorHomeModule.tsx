'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Package as PackageIcon,
    MapPin,
    CaretLeft,
    DotsThree,
    Check,
    Circle,
    PlusCircle,
    Clock as ClockIcon,
    ArrowRight,
    ShieldWarning,
    IdentificationCard as IdentificationCardIcon,
    CheckCircle
} from '@phosphor-icons/react';
import { TNA, TNAResponse } from '@/lib/types/tna';
import { Delivery, DeliveryResponse } from '@/lib/types/deliveries';
import { Binding } from '@/lib/types/bindings';
import { useLocale } from '@/i18n/LocaleProvider';
import { SkeletonCard, SkeletonStatCard } from '@/components/ui/SkeletonCard';
import EmptyState from '@/components/ui/EmptyState';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { useBindingContext } from '@/context/BindingContext';
import './VisitorHomeModule.css';

const mockTnas: TNA[] = [
    { 
        tna_id: '1', 
        visitor_id: 'v-01', 
        issuance_request_id: 'ir-01', 
        tna_code: 'TNA-EMAA5083', 
        status: 'ACTIVE', 
        issued_at: '2024-04-18', 
        expires_at: '2024-10-18' 
    },
    { 
        tna_id: '2', 
        visitor_id: 'v-01', 
        issuance_request_id: 'ir-02', 
        tna_code: 'TNA-JKLM9278', 
        status: 'ACTIVE', 
        issued_at: '2024-04-23', 
        expires_at: '2024-10-23' 
    },
    { 
        tna_id: '3', 
        visitor_id: 'v-01', 
        issuance_request_id: 'ir-03', 
        tna_code: 'TNA-ALCT9837', 
        status: 'UNLINKED', 
        issued_at: '2024-04-15', 
        expires_at: '2024-10-15' 
    },
];

const mockDeliveries: Delivery[] = [
    { delivery_id: 'd1', tracking_no: '456327', carrier: 'Aramex', tna_code: 'TNA-EMAA5083', expected_at: '2024-10-18' },
    { delivery_id: 'd2', tracking_no: '15486633698', carrier: 'DHL', tna_code: 'TNA-JKLM9278', expected_at: '2024-10-23' },
];

const mockBindings: Binding[] = [
    { 
        binding_id: 'bind-101',
        tna_id: '1', 
        sub_address_id: 'sub-01', 
        rent_contract_id: 'rc-01',
        status: 'PENDING', 
        start_at: '2024-10-01', 
        end_at: '2025-01-01',
        approved_by_owner_id: undefined,
        approved_at: undefined,
        termination_reason: undefined,
        created_at: '2024-10-01',
        updated_at: '2024-10-01',
        tna_code: 'TNA-EMAA5083',
        na_id: 'na-01',
        visitor_id: 'v-01',
    },
];

export default function VisitorHomeModule() {
    const router = useRouter();
    const { locale, isRTL } = useLocale();
    const { pendingBindings, terminateBinding, getActiveShipmentsForTNA } = useBindingContext();
    const [activeSlide, setActiveSlide] = useState(0);

    const { data: tnas, isLoading: tnasLoading, error: tnasError, refetch: refetchTnas } = useQuery<TNAResponse>({
        queryKey: ['tna', 'me'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000));
            return { data: mockTnas };
        },
    });

    const { data: deliveries, isLoading: deliveriesLoading, error: deliveriesError, refetch: refetchDeliveries } = useQuery<DeliveryResponse>({
        queryKey: ['deliveries', 'preview'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 800));
            return { data: mockDeliveries };
        },
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
    };

    const pendingApprovals = (pendingBindings || []).filter(b => b.status === 'PENDING');
    const activeTnas = tnas?.data.filter(t => t.status === 'ACTIVE') || [];
    const expiringSoon = activeTnas.filter(t => {
        const expiry = new Date(t.expires_at);
        const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 2 && daysLeft > 0;
    });
    const inTransitDeliveries = deliveries?.data.filter(d => d.expected_at && new Date(d.expected_at) > new Date()) || [];

    const urgentItems = [
        ...pendingApprovals.map(b => ({
            type: 'pending_binding' as const,
            title: 'Pending Binding Request',
            description: `${b.tna_code}: Awaiting owner approval`,
            action: () => router.push(`/${locale}/visitor/tnas/${b.tna_id}`),
            priority: 'high',
        })),
        ...expiringSoon.map(item => ({
            type: 'expiring_tna' as const,
            title: 'Expiring Soon',
            description: `${item.tna_code}: Expires ${formatDate(item.expires_at)}`,
            action: () => router.push(`/${locale}/visitor/tnas/${item.tna_id}`),
            priority: 'high',
        })),
    ];

    const formatTimeLeft = (dateStr: string) => {
        const expiry = new Date(dateStr);
        const diff = expiry.getTime() - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return 'Until date ' + formatDate(dateStr);
    };

    return (
        <div className="min-h-screen bg-surface-100" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* 1. TOP TIER: Urgent Widgets (40% height) */}
            {(urgentItems.length > 0 || activeTnas.length > 0) && (
                <section className="px-4 pt-6 pb-4">
                    <div className="bg-surface-200 rounded-md border border-neutral-200 shadow-card p-4">
                        <h2 className="text-body font-bold text-neutral-900 mb-3">
                            Urgent Alerts
                        </h2>
                        <div className="space-y-2">
                            {/* Active Proxy - High Visibility */}
                            {activeTnas.length > 0 && (
                                <div className="flex items-center justify-between p-3 rounded-sm bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white shadow-card">
                                            <IdentificationCardIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900">
                                                Active Proxy
                                            </p>
                                            <p className="text-lg font-mono font-bold text-primary">
                                                {activeTnas[0].tna_code}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/${locale}/visitor/tnas/${activeTnas[0].tna_id}`)}
                                        className="p-2 hover:bg-primary/20 rounded-sm transition-colors"
                                    >
                                        <ArrowRight size={20} className={`text-neutral-400 ${isRTL ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            )}
                            {/* Critical Alerts */}
                            {expiringSoon.length > 0 && (
                                <div className="flex items-start gap-3 p-3 rounded-sm bg-warning/10 border border-warning/30">
                                    <ShieldWarning size={20} className="text-warning mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-warning">
                                            Warning
                                        </p>
                                        <p className="text-caption text-neutral-600 mt-0.5">
                                            {expiringSoon.map(t => t.tna_code).join(', ')} Expires soon
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* Pending Bindings */}
                            {pendingApprovals.length > 0 && (
                                <div className="flex items-start gap-3 p-3 rounded-sm bg-info/10 border border-info/30">
                                    <ClockIcon size={20} className="text-info mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-info">
                                            {pendingApprovals.length} Pending Requests
                                        </p>
                                        <p className="text-caption text-neutral-600 mt-0.5">
                                            Awaiting owner approval
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* 2. MIDDLE TIER: Operational Summary & Shipment Feed (40% height) */}
            <section className="px-4 py-4">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface-200 rounded-md border border-neutral-200 p-3 shadow-card">
                        <div className="flex items-center gap-2 mb-1">
                            <IdentificationCardIcon size={16} className="text-primary" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Addresses
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">{activeTnas.length}</p>
                        <p className="text-[10px] text-neutral-400">Active</p>
                    </div>
                    <div className="bg-surface-200 rounded-md border border-neutral-200 p-3 shadow-card">
                        <div className="flex items-center gap-2 mb-1">
                            <PackageIcon size={16} className="text-primary" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Shipments
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">
                            {inTransitDeliveries.length}
                        </p>
                        <p className="text-[10px] text-neutral-400">In Transit</p>
                    </div>
                    <div className="bg-surface-200 rounded-md border border-neutral-200 p-3 shadow-card">
                        <div className="flex items-center gap-2 mb-1">
                            <Check size={16} className="text-success" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Linked
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">
                            {activeTnas.filter(t => t.status === 'ACTIVE').length}
                        </p>
                        <p className="text-[10px] text-neutral-400">Active</p>
                    </div>
                    <div className="bg-surface-200 rounded-md border border-neutral-200 p-3 shadow-card">
                        <div className="flex items-center gap-2 mb-1">
                            <ClockIcon size={16} className="text-pending" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Pending
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">
                            {pendingApprovals.length}
                        </p>
                        <p className="text-[10px] text-neutral-400">Pending</p>
                    </div>
                </div>

                {/* Shipment Feed */}
                <div className="text-start">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                                <PackageIcon size={14} />
                            </div>
                            <h3 className="text-sm font-bold text-neutral-900">
                                Shipments
                            </h3>
                        </div>
                        {deliveries?.data && deliveries?.data.length > 2 && (
                            <button
                                onClick={() => router.push(`/${locale}/visitor/shipments`)}
                                className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline"
                            >
                                View All
                                <CaretLeft size={14} className={!isRTL ? 'rotate-180' : ''} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {deliveriesLoading ? (
                            [1, 2].map(i => <SkeletonCard key={i} className="h-20" />)
                        ) : deliveriesError ? (
                            <ErrorAlert 
                                message="Loading failed" 
                                onRetry={() => refetchDeliveries()} 
                            />
                        ) : (!deliveries?.data || deliveries?.data.length === 0) ? (
                            <EmptyState 
                                compact 
                                icon={PackageIcon} 
                                title="No shipments"
                                description="No shipments to track at the moment"
                            />
                        ) : (
                            deliveries?.data.slice(0, 3).map((delivery) => (
                                <div 
                                    key={delivery.delivery_id} 
                                    className="bg-surface-200 border border-neutral-100 rounded-md p-3 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/${locale}/visitor/shipments`)}
                                >
                                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                        <PackageIcon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[11px] font-bold text-neutral-400 uppercase">
                                                {delivery.carrier}
                                            </p>
                                            <span className="text-[10px] text-neutral-400 ml-2 flex-shrink-0">
                                                {formatDate(delivery.expected_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm font-mono font-bold text-neutral-900">
                                            {delivery.tracking_no}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 truncate">
                                            To TNA: <span className="text-primary font-bold">{delivery.tna_code}</span>
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className={`text-neutral-300 flex-shrink-0 ${!isRTL ? 'rotate-180' : ''}`} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 3. BOTTOM TIER: Quick Actions (20% height area) */}
            <div className="px-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => router.push(`/${locale}/visitor/search`)}
                        className="flex flex-col items-center gap-2 p-4 rounded-md bg-surface-200 border border-neutral-200 shadow-card hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <PlusCircle size={22} weight="fill" />
                        </div>
                        <span className="text-[11px] font-bold text-neutral-700 text-center leading-tight">
                            Create New TNA
                        </span>
                    </button>
                    <button
                        onClick={() => router.push(`/${locale}/visitor/wallet`)}
                        className="flex flex-col items-center gap-2 p-4 rounded-md bg-surface-200 border border-neutral-200 shadow-card hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <CheckCircle size={20} weight="fill" />
                        </div>
                        <span className="text-[11px] font-bold text-neutral-700 text-center leading-tight">
                            Check Balance
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

