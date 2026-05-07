'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    ChartPie, 
    ChartLine, 
    WarningCircle, 
    CheckCircle, 
    Clock, 
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    DownloadSimple
} from '@phosphor-icons/react'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'

interface PerformanceMetric {
    id: string;
    label: string;
    value: string;
    trend: 'UP' | 'DOWN';
    percentage: string;
}

const metrics: PerformanceMetric[] = [
    { id: '1', label: 'نسبة التوصيل الناجح', value: '٩٨.٢٪', trend: 'UP', percentage: '+٢.٤٪' },
    { id: '2', label: 'متوسط وقت التوصيل', value: '٣٤ دقيقة', trend: 'DOWN', percentage: '-٥.١٪' },
    { id: '3', label: 'البلاغات المفتوحة', value: '٤ بلاغات', trend: 'DOWN', percentage: '-١٠٪' },
];

export default function CarrierReportsPage() {
    const columns: DataTableColumn<any>[] = [
        {
            key: 'title',
            label: 'عنوان التقرير',
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={18} weight="fill" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">{val}</span>
                </div>
            )
        },
        {
            key: 'type',
            label: 'النوع',
            render: (val) => <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{val}</span>
        },
        {
            key: 'date',
            label: 'تاريخ الإصدار',
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end">
                    <button className="h-8 px-4 rounded-sm bg-neutral-100 text-neutral-600 text-[10px] font-bold flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                        <DownloadSimple size={16} />
                        تحميل PDF
                    </button>
                </div>
            )
        }
    ];

    const reports = [
        { id: 'R-01', title: 'تقرير أداء السائقين الأسبوعي', type: 'PERFORMANCE', date: '٢٠٢٦/٠٤/٢٠' },
        { id: 'R-02', title: 'تحليل استهلاك الوقود - أبريل', type: 'OPERATIONAL', date: '٢٠٢٦/٠٤/١٥' },
        { id: 'R-03', title: 'إحصاءات وصول الشحنات للملقا', type: 'GEOGRAPHICAL', date: '٢٠٢٦/٠٤/١٠' },
    ];

    return (
        <AppShell role="Carrier" header="التقارير والتحليلات">
            <div className="space-y-8">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {metrics.map((m) => (
                        <div key={m.id} className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                            <p className="text-xs font-bold text-neutral-500 mb-2">{m.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold text-neutral-900">{m.value}</h3>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${m.trend === 'UP' ? 'text-success' : 'text-error'}`}>
                                    {m.trend === 'UP' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {m.percentage}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analytical Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-md border border-neutral-200 bg-surface-200 h-[300px] flex flex-col">
                        <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-6">
                            <ChartPie size={20} className="text-primary" weight="fill" />
                            توزيع الحالات اللوجستية
                        </h3>
                        <div className="flex-1 rounded border border-neutral-100 border-dashed flex items-center justify-center bg-surface-100">
                            <p className="text-xs text-neutral-400 font-medium">سيتم عرض توزيع الشحنات (تم التوصيل، قيد التنفيذ، تأخير)</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-md border border-neutral-200 bg-surface-200 h-[300px] flex flex-col">
                        <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-6">
                            <ChartLine size={20} className="text-primary" weight="fill" />
                            حجم العمليات الشهري
                        </h3>
                        <div className="flex-1 rounded border border-neutral-100 border-dashed flex items-center justify-center bg-surface-100">
                            <p className="text-xs text-neutral-400 font-medium">رسم بياني يوضح نمو الشحنات خلال الـ ٦ أشهر الماضية</p>
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <DataTableLayout
                    title="التقارير الجاهزة"
                    columns={columns}
                    data={reports}
                />
            </div>
        </AppShell>
    );
}
