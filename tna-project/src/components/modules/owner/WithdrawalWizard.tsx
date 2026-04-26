'use client';

import React, { useState } from 'react';
import { 
    X, 
    Bank, 
    DeviceMobile, 
    CheckCircle, 
    ArrowRight,
    Wallet
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';

interface WithdrawalWizardProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
}

export default function WithdrawalWizard({ isOpen, onClose, balance }: WithdrawalWizardProps) {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'BANK' | 'STCPAY' | null>(null);

    if (!isOpen) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const resetAndClose = () => {
        setStep(1);
        setAmount('');
        setMethod(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <div className="bg-white w-full max-w-md rounded-lg shadow-modal overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-neutral-900">سحب الرصيد</h3>
                    <button onClick={resetAndClose} className="text-neutral-400 hover:text-neutral-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="p-4 bg-primary/5 rounded-md border border-primary/10 flex items-center gap-3">
                                <Wallet size={24} className="text-primary" weight="fill" />
                                <div>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase">الرصيد المتاح</p>
                                    <p className="text-xl font-bold text-neutral-900">{balance.toFixed(2)} SAR</p>
                                </div>
                            </div>
                            <InputField 
                                label="المبلغ المراد سحبه"
                                placeholder="0.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                helperText="الحد الأدنى للسحب 50 SAR"
                            />
                            <Button 
                                fullWidth 
                                disabled={!amount || parseFloat(amount) < 50 || parseFloat(amount) > balance}
                                onClick={handleNext}
                            >
                                التالي
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <p className="text-sm font-bold text-neutral-900">اختر طريقة السحب</p>
                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => setMethod('BANK')}
                                    className={cn(
                                        "p-4 border-2 rounded-md flex items-center gap-4 transition-all text-right",
                                        method === 'BANK' ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
                                    )}
                                >
                                    <div className={cn("w-10 h-10 rounded-md flex items-center justify-center", method === 'BANK' ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400")}>
                                        <Bank size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-neutral-900">تحويل بنكي (IBAN)</p>
                                        <p className="text-[10px] text-neutral-500">يصل خلال ٢٤-٤٨ ساعة عمل</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setMethod('STCPAY')}
                                    className={cn(
                                        "p-4 border-2 rounded-md flex items-center gap-4 transition-all text-right",
                                        method === 'STCPAY' ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
                                    )}
                                >
                                    <div className={cn("w-10 h-10 rounded-md flex items-center justify-center", method === 'STCPAY' ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400")}>
                                        <DeviceMobile size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-neutral-900">STC Pay</p>
                                        <p className="text-[10px] text-neutral-500">تحويل فوري عبر رقم الجوال</p>
                                    </div>
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" className="flex-1" onClick={handleBack}>رجوع</Button>
                                <Button className="flex-[2]" disabled={!method} onClick={handleNext}>تأكيد الطلب</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={48} weight="fill" className="text-success" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-neutral-900">تم استلام طلبك!</h4>
                                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                                    جاري معالجة طلب سحب مبلغ <span className="font-bold text-neutral-900">{amount} SAR</span> عبر <span className="font-bold text-neutral-900">{method === 'BANK' ? 'التحويل البنكي' : 'STC Pay'}</span>.
                                </p>
                            </div>
                            <Button fullWidth onClick={resetAndClose}>العودة للرئيسية</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
