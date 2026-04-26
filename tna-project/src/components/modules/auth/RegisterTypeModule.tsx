'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaretRight, CaretLeft, Users, Briefcase, CheckCircle } from '@phosphor-icons/react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { UserRole } from '@/lib/types/auth';
import ProgressStepper from '@/components/ui/ProgressStepper';
import { cn } from '@/lib/utils/cn';

export default function RegisterTypeModule() {
    const router = useRouter();
    const { formData, updateFormData, setStep } = useRegistrationStore();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(formData.user_role || null);
    const [ownerType, setOwnerType] = useState<'INDIVIDUAL' | 'ENTITY'>('INDIVIDUAL');
    const [carrierType, setCarrierType] = useState<'STAFF' | 'COMPANY'>('STAFF');

    const roles: { id: UserRole; label: string; subLabel: string; icon: any }[] = [
        { 
            id: 'VISITOR', 
            label: 'زائر / سائح', 
            subLabel: 'الحصول على عنوان وطني مؤقت للشحنات', 
            icon: Users 
        },
        { 
            id: 'OWNER', 
            label: 'مالك عقار', 
            subLabel: 'تأجير المساحات البريدية للزوار', 
            icon: Briefcase 
        },
        { 
            id: 'CARRIER_STAFF', 
            label: 'موظف ناقل', 
            subLabel: 'إدارة وتوصيل الشحنات للزوار', 
            icon: CheckCircle 
        },
    ];

    const handleNext = () => {
        if (selectedRole) {
            updateFormData({ 
                user_role: selectedRole,
                is_entity: (selectedRole === 'OWNER' && ownerType === 'ENTITY') || (selectedRole === 'CARRIER_STAFF' && carrierType === 'COMPANY')
            } as any);
            setStep(2);
            router.push('/auth/register/personal');
        }
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm">
                <div className="w-10" />
                <div className="flex-1 flex justify-center">
                    <h1 className="text-heading font-bold text-neutral-900">إنشاء حساب جديد</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
                >
                    <CaretLeft size={24} />
                </button>
            </header>

            <ProgressStepper currentStep={1} label="تحديد نوع الحساب" />

            <main className="flex-1 px-6 pt-8 space-y-6">
                <p className="text-center text-body text-neutral-500 font-medium px-4">
                    اختر نوع الحساب المناسب لك للبدء في استخدام خدمات العنوان الوطني المؤقت
                </p>

                <div className="space-y-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={cn(
                                "w-full p-5 flex items-center gap-4 rounded-md border-2 transition-all duration-300 text-right group",
                                selectedRole === role.id
                                    ? "bg-primary/5 border-primary shadow-md"
                                    : "bg-surface-200 border-neutral-200 hover:border-neutral-300"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-md flex items-center justify-center transition-colors",
                                selectedRole === role.id ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200"
                            )}>
                                <role.icon size={24} weight={selectedRole === role.id ? "fill" : "regular"} />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn(
                                    "text-subheading font-bold transition-colors",
                                    selectedRole === role.id ? "text-primary" : "text-neutral-900"
                                )}>
                                    {role.label}
                                </h3>
                                <p className="text-caption text-neutral-500">{role.subLabel}</p>
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selectedRole === role.id ? "border-primary bg-primary" : "border-neutral-300"
                            )}>
                                {selectedRole === role.id && <CheckCircle size={16} weight="fill" className="text-white" />}
                            </div>
                        </button>
                    ))}
                </div>

                {selectedRole === 'OWNER' && (
                    <div className="p-6 bg-surface-200 border border-neutral-200 rounded-md space-y-4 animate-in slide-in-from-bottom duration-300">
                        <p className="text-sm font-bold text-neutral-900">نوع ملكية العقارات</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setOwnerType('INDIVIDUAL')}
                                className={cn(
                                    "p-3 rounded-sm border-2 text-xs font-bold transition-all",
                                    ownerType === 'INDIVIDUAL' ? "border-primary bg-primary/5 text-primary" : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                                )}
                            >
                                فرد / مواطن
                            </button>
                            <button 
                                onClick={() => setOwnerType('ENTITY')}
                                className={cn(
                                    "p-3 rounded-sm border-2 text-xs font-bold transition-all",
                                    ownerType === 'ENTITY' ? "border-primary bg-primary/5 text-primary" : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                                )}
                            >
                                فندق / وكالة سياحية
                            </button>
                        </div>
                    </div>
                )}
                {selectedRole === 'CARRIER_STAFF' && (
                    <div className="p-6 bg-surface-200 border border-neutral-200 rounded-md space-y-4 animate-in slide-in-from-bottom duration-300">
                        <p className="text-sm font-bold text-neutral-900">نوع التسجيل في قطاع النقل</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setCarrierType('STAFF')}
                                className={cn(
                                    "p-3 rounded-sm border-2 text-xs font-bold transition-all",
                                    carrierType === 'STAFF' ? "border-primary bg-primary/5 text-primary" : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                                )}
                            >
                                مندوب / فرد
                            </button>
                            <button 
                                onClick={() => setCarrierType('COMPANY')}
                                className={cn(
                                    "p-3 rounded-sm border-2 text-xs font-bold transition-all",
                                    carrierType === 'COMPANY' ? "border-primary bg-primary/5 text-primary" : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                                )}
                            >
                                شركة خدمات لوجستية
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-6 pb-10">
                <button
                    onClick={handleNext}
                    disabled={!selectedRole}
                    className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>التالي</span>
                    <CaretRight size={20} className="rotate-180" />
                </button>
            </footer>
        </div>
    );
}
