'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { 
    House, 
    Link as LinkIcon, 
    Wallet, 
    ArrowUpRight, 
    TrendUp, 
    PlusCircle,
    CaretRight,
    ChartLineUp
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'

export default function OwnerHomePage() {
  const { ownerAccount, realEstateObjects } = useBindingContext();
  const router = useRouter();
  const { locale } = useParams();

  const stats = [
    { 
        label: 'العقارات المسجلة', 
        value: realEstateObjects.length, 
        icon: <House size={24} weight="fill" className="text-primary" /> 
    },
    { 
        label: 'الارتباطات النشطة', 
        value: '14', 
        icon: <LinkIcon size={24} weight="fill" className="text-success" /> 
    },
    { 
        label: 'إجمالي الأرباح', 
        value: `${ownerAccount.total_earned.toFixed(2)} SAR`, 
        icon: <TrendUp size={24} weight="fill" className="text-secondary" /> 
    },
    { 
        label: 'الرصيد المتاح', 
        value: `${ownerAccount.current_balance.toFixed(2)} SAR`, 
        icon: <Wallet size={24} weight="fill" className="text-primary" /> 
    },
  ];

  const recentRequests = [
    {
        id: 'req-101',
        title: 'طلب ربط جديد',
        description: 'فيصل القحطاني يرغب بالربط بعقار "فيلا الملقا 12"',
        timestamp: 'منذ ١٥ دقيقة',
        status: 'pending' as const
    },
    {
        id: 'req-99',
        title: 'تم قبول الربط',
        description: 'اكتملت عملية السداد وربط العنوان لـ سارة محمد',
        timestamp: 'منذ ساعتين',
        status: 'success' as const
    }
  ];

  return (
    <AppShell role="Owner" header="لوحة التحكم">
      <DashboardLayout
        title="مرحباً بك، شريك النجاح"
        subtitle="إدارة عقاراتك، متابعة طلبات الربط، ومراقبة نمو أرباحك في منصة TNA."
        stats={stats}
        activity={recentRequests}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Main Action Card */}
            <div className="lg:col-span-2 p-8 rounded-md bg-btn-primary text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">سجل عقاراً جديداً</h3>
                    <p className="opacity-80 text-sm max-w-md leading-relaxed">
                        ابدأ بجني الأرباح عبر تسجيل عقاراتك في المنصة وإتاحتها للزوار والباحثين عن عناوين وطنية مؤقتة.
                    </p>
                </div>
                <div className="relative z-10 pt-6">
                    <button 
                        onClick={() => router.push(`/${locale}/owner/property/add`)}
                        className="h-12 px-8 rounded-pill bg-white text-primary font-bold flex items-center gap-2 hover:bg-neutral-50 transition-colors shadow-lg"
                    >
                        <PlusCircle size={20} weight="fill" />
                        إضافة عقار جديد
                    </button>
                </div>
                <House size={160} weight="duotone" className="absolute -bottom-10 -left-10 text-white/10 rotate-12 pointer-events-none" />
            </div>

            {/* Quick Balance Card */}
            <div className="p-6 rounded-md border border-neutral-200 bg-surface-200 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">سحب الرصيد</span>
                        <ArrowUpRight size={18} className="text-neutral-300" />
                    </div>
                    <p className="text-sm text-neutral-500 font-medium mb-1">رصيدك الحالي</p>
                    <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.current_balance.toFixed(2)} SAR</h4>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-100 flex gap-2">
                    <button 
                        onClick={() => router.push(`/${locale}/owner/earnings`)}
                        className="flex-1 h-10 text-xs font-bold text-primary hover:bg-primary/5 rounded-sm transition-colors border border-primary/20"
                    >
                        كشف حساب
                    </button>
                    <button className="flex-1 h-10 text-xs font-bold bg-neutral-900 text-white rounded-sm hover:bg-black transition-colors">
                        تحويل للبنك
                    </button>
                </div>
            </div>
        </div>

        {/* Revenue Analytics Preview */}
        <div className="mt-8 p-6 rounded-md border border-neutral-200 bg-surface-200">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-success/10 flex items-center justify-center text-success">
                        <ChartLineUp size={20} weight="bold" />
                    </div>
                    <h3 className="font-bold text-neutral-900">تحليلات الأرباح (آخر ٧ أيام)</h3>
                </div>
                <button className="text-xs font-bold text-neutral-400 hover:text-primary flex items-center gap-1 transition-colors">
                    مشاهدة التفاصيل
                    <CaretRight size={14} className="rotate-180" />
                </button>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-[200px] w-full bg-surface-100 rounded border border-neutral-100 border-dashed flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end px-4 pb-4 gap-2">
                    {[30, 45, 25, 60, 55, 80, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h*10} SAR
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-neutral-400 font-medium z-10 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-pill border border-neutral-200">سيتم تفعيل الرسوم البيانية التفاعلية قريباً</p>
            </div>
        </div>
      </DashboardLayout>
    </AppShell>
  )
}
