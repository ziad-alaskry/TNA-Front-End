'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import { 
    CurrencyDollar,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    ArrowRight,
    Funnel,
    MagnifyingGlass,
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockGovAdjustments } from '@/lib/mock/gov.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { cn } from '@/lib/utils/cn'

interface SettlementAdjustment {
    adjustment_id: string;
    adjustment_type: string;
    amount: number;
    reason: string;
    initiated_by: string;
    created_at: string;
    status: string;
    approval_required: boolean;
}

export default function GovAdjustmentsPage() {
    const router = useRouter();
    const { locale, isRTL } = useLocale();
    const { data: adjustments, isLoading } = useMock(mockGovAdjustments);
    const [selectedAdjustment, setSelectedAdjustment] = useState<SettlementAdjustment | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const pendingAdjustments = adjustments?.filter(a => a.status === 'PENDING' && a.approval_required) || [];

    const columns: DataTableColumn<SettlementAdjustment>[] = [
        {
            key: 'adjustment_type',
            label: isRTL ? 'نوع التعديل' : 'Adjustment Type',
            width: '20%',
            render: (val) => (
                <span className="text-xs font-bold text-neutral-700">
                    {val === 'OWNER_CORRECTION' ? (isRTL ? 'تصحيح المالك' : 'Owner Correction') : 
                     val === 'SYSTEM_ERROR' ? (isRTL ? 'خطأ نظامي' : 'System Error') : val}
                </span>
            )
        },
        {
            key: 'amount',
            label: isRTL ? 'المبلغ' : 'Amount',
            width: '15%',
            render: (val) => (
                <span className={cn(
                    "font-mono font-bold",
                    val >= 0 ? "text-success" : "text-error"
                )}>
                    {val >= 0 ? '+' : ''}{val.toFixed(2)} SAR
                </span>
            )
        },
        {
            key: 'reason',
            label: isRTL ? 'السبب' : 'Reason',
            width: '30%',
            render: (val) => (
                <span className="text-xs text-neutral-600 line-clamp-2">{val}</span>
            )
        },
        {
            key: 'initiated_by',
            label: isRTL ? 'منفذ الطلب' : 'Initiated By',
            width: '15%',
            render: (val) => (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <User size={14} />
                    {val}
                </div>
            )
        },
        {
            key: 'created_at',
            label: isRTL ? 'تاريخ الإنشاء' : 'Created At',
            width: '15%',
            render: (val) => (
                <span className="text-xs text-neutral-500">{new Date(val).toLocaleDateString()}</span>
            )
        },
        {
            key: 'adjustment_id',
            label: '',
            width: '10%',
            render: (id, row) => (
                <div className="flex justify-end">
                    <Button 
                        onClick={() => {
                            setSelectedAdjustment(row);
                            setIsApproveModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-neutral-200"
                    >
                        {isRTL ? 'مراجعة' : 'Review'}
                        <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                    </Button>
                </div>
            )
        }
    ];

    const handleApprove = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsProcessing(false);
        setIsApproveModalOpen(false);
        setSelectedAdjustment(null);
    };

    return (
        <AppShell role="Gov" header={isRTL ? 'موافقة التعديلات المالية' : 'Settlement Adjustment Approval'}>
            <DataTableLayout
                title={isRTL ? 'طلبات التعديل المعلّقة' : 'Pending Adjustment Requests'}
                columns={columns}
                data={pendingAdjustments}
                isLoading={isLoading}
            >
                <div className="flex gap-2">
                    <div className="relative">
                        <MagnifyingGlass size={18} className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                            placeholder={isRTL ? 'بحث برقم المعرف...' : 'Search by ID...'} 
                            className="h-11 w-[240px] px-10 rounded-md border border-neutral-200 bg-white text-xs focus:ring-1 focus:ring-primary outline-offset-0"
                        />
                    </div>
                    <button className="h-11 px-6 rounded-md border border-neutral-200 bg-white font-bold text-xs flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                        <Funnel size={18} />
                        {isRTL ? 'تصفية' : 'Filter'}
                    </button>
                </div>
            </DataTableLayout>

            <Modal 
                isOpen={isApproveModalOpen} 
                onClose={() => setIsApproveModalOpen(false)}
                title={isRTL ? 'مراجعة طلب التعديل' : 'Review Adjustment Request'}
            >
                {selectedAdjustment && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-xs font-bold text-neutral-400 uppercase mb-2">{isRTL ? 'نوع التعديل' : 'Adjustment Type'}</p>
                                <p className="text-sm font-bold text-neutral-900">
                                    {selectedAdjustment.adjustment_type === 'OWNER_CORRECTION' ? (isRTL ? 'تصحيح المالك' : 'Owner Correction') : 
                                     selectedAdjustment.adjustment_type === 'SYSTEM_ERROR' ? (isRTL ? 'خطأ نظامي' : 'System Error') : selectedAdjustment.adjustment_type}
                                </p>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-xs font-bold text-neutral-400 uppercase mb-2">{isRTL ? 'المبلغ' : 'Amount'}</p>
                                <p className={cn(
                                    "text-2xl font-mono font-bold",
                                    selectedAdjustment.amount >= 0 ? "text-success" : "text-error"
                                )}>
                                    {selectedAdjustment.amount >= 0 ? '+' : ''}{selectedAdjustment.amount.toFixed(2)} SAR
                                </p>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-xs font-bold text-neutral-400 uppercase mb-2">{isRTL ? 'سبب التعديل' : 'Reason'}</p>
                                <p className="text-sm text-neutral-700">{selectedAdjustment.reason}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <Button 
                                onClick={handleApprove} 
                                isLoading={isProcessing}
                                className="flex-1"
                            >
                                <CheckCircle size={20} weight="bold" />
                                {isRTL ? 'موافقة' : 'Approve'}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsApproveModalOpen(false)}
                                className="flex-1"
                            >
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </AppShell>
    );
}