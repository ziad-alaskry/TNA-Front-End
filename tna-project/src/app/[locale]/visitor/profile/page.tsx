'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    User, 
    IdentificationCard, 
    MapPin, 
    ShieldCheck, 
    Bell, 
    Globe,
    PencilSimple,
    Key,
    SignOut
} from '@phosphor-icons/react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function VisitorProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const sections = [
        {
            title: 'المعلومات الشخصية',
            description: 'بياناتك الشخصية الأساسية كما هي مسجلة في النظام.',
            items: [
                { label: 'الاسم الكامل', value: <div className="flex items-center gap-2"><span>احمد محمد العتيبي</span><PencilSimple size={14} className="text-primary cursor-pointer" /></div> },
                { label: 'البريد الإلكتروني', value: user?.email || 'ahmed@example.com' },
                { label: 'رقم الجوال', value: '055XXXXX12' },
                { label: 'تاريخ الميلاد', value: '1990/05/12' },
            ]
        },
        {
            title: 'بيانات الهوية',
            description: 'تفاصيل وثيقة إثبات الشخصية المعتمدة.',
            items: [
                { label: 'نوع الوثيقة', value: 'هوية وطنية' },
                { label: 'رقم الوثيقة', value: <span className="font-mono">1029XXXX34</span> },
                { label: 'تاريخ الانتهاء', value: '1448/10/20' },
                { label: 'حالة التحقق', value: <div className="flex items-center gap-1 text-success font-bold"><ShieldCheck size={16} weight="fill" /><span>موثق عبر نفاذ</span></div> },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-8">
            <div className="text-center pb-6 border-b border-neutral-100">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border-2 border-primary/20">
                    <User size={40} weight="duotone" />
                </div>
                <h3 className="font-bold text-neutral-900">أحمد العتيبي</h3>
                <p className="text-xs text-neutral-500 mt-1">زائر • عضو منذ 2025</p>
            </div>

            <div className="space-y-2">
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-right">
                    <Bell size={20} className="text-neutral-400" />
                    <span>تفضيلات التنبيهات</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-right">
                    <Globe size={20} className="text-neutral-400" />
                    <span>تغيير اللغة</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-right">
                    <Key size={20} className="text-neutral-400" />
                    <span>تغيير كلمة المرور</span>
                </button>
                <div className="pt-4 mt-4 border-t border-neutral-100">
                    <button 
                        onClick={() => {
                            logout();
                            router.push('/login');
                        }}
                        className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-bold text-error hover:bg-error/5 transition-colors text-right"
                    >
                        <SignOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AppShell role="Visitor" header="الحساب الشخصي">
            <DetailViewLayout
                title="إعدادات الملف الشخصي"
                mainContent={sections}
                sidebar={sidebar}
            />
        </AppShell>
    );
}
