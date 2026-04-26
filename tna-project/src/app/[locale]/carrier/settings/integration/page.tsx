'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    Api, 
    Link, 
    Key, 
    Webhook, 
    Copy, 
    CheckCircle, 
    WarningCircle,
    ArrowsClockwise,
    ShieldCheck
} from '@phosphor-icons/react'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function CarrierIntegrationPage() {
    const [apiKey, setApiKey] = useState('tna_live_51M4e7xS9W2v8J0Lp1Q3z5X7c9V1b3N5m7Q')
    const [isCopied, setIsCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleRegenerate = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setApiKey('tna_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
            setIsGenerating(false)
        }, 1500)
    }

    return (
        <AppShell role="Carrier" header="إعدادات الربط التقني (API)">
            <div className="max-w-4xl space-y-8 pb-20" dir="rtl">
                {/* Connection Status Card */}
                <div className="p-6 rounded-md border border-success/20 bg-success-bg flex items-center justify-between animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
                            <ShieldCheck size={24} weight="fill" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">حالة الربط: متصل</h3>
                            <p className="text-xs text-neutral-500 font-medium">نظامكم البريدي يستقبل التحديثات بشكل صحيح عبر الويب هوك.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-pill text-[10px] font-bold text-success border border-success/10">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        Live Endpoint
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* API Keys Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold">
                                <Key size={20} weight="bold" />
                            </div>
                            <h4 className="font-bold text-neutral-900">مفاتيح الوصول (API Keys)</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-label font-bold text-neutral-700 ps-1">Live Secret Key</label>
                                <div className="relative group">
                                    <input 
                                        type="password" 
                                        readOnly 
                                        value={apiKey}
                                        className="w-full h-input bg-surface-200 border border-neutral-300 rounded-sm px-4 text-start text-neutral-900 font-mono text-xs focus:outline-none"
                                    />
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                                        <button 
                                            onClick={handleCopy}
                                            className="p-2 text-neutral-400 hover:text-primary transition-colors"
                                        >
                                            {isCopied ? <CheckCircle size={18} weight="fill" className="text-success" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full gap-2 border-neutral-200 text-neutral-500"
                                onClick={handleRegenerate}
                                disabled={isGenerating}
                            >
                                <ArrowsClockwise size={16} className={isGenerating ? 'animate-spin' : ''} />
                                {isGenerating ? 'جاري التحديث...' : 'توليد مفتاح جديد'}
                            </Button>
                        </div>
                    </div>

                    {/* Webhook Configuration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold">
                                <Webhook size={20} weight="bold" />
                            </div>
                            <h4 className="font-bold text-neutral-900">تنبيهات الويب هوك (Webhooks)</h4>
                        </div>
                        <div className="space-y-4">
                            <InputField 
                                label="رابط الاستقبال (URL)" 
                                placeholder="https://api.yourcompany.com/tna-updates"
                                defaultValue="https://post.smsa-express.com/v1/webhooks"
                            />
                            <div className="p-4 bg-warning-bg border border-warning/10 rounded-md">
                                <p className="text-[10px] text-warning font-bold flex items-center gap-2">
                                    <WarningCircle size={14} weight="fill" />
                                    تأمين الاتصال
                                </p>
                                <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
                                    يجب أن يكون الرابط مشفراً (HTTPS) لدواعي أمنية وحماية خصوصية بيانات العناوين الوطنية.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integration Documentation Link */}
                <div className="p-6 rounded-md border border-neutral-200 bg-surface-200 group cursor-pointer hover:border-primary transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-md bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                                <Link size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-900">دليل الربط للمطورين</h4>
                                <p className="text-xs text-neutral-500">راجع مستندات API لمعرفة كيفية استقبال تحديثات العناوين وتتبع الشحنات.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">تحميل PDF</Button>
                    </div>
                </div>

                {/* Save Footer */}
                <div className="pt-8 border-t border-neutral-200 flex justify-end gap-3">
                    <Button variant="ghost" className="px-8">تجاهل</Button>
                    <Button className="px-12 ui-gradient-primary border-none shadow-glow-primary">حفظ التغييرات</Button>
                </div>
            </div>
        </AppShell>
    )
}
