'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { mockBindings, mockRentContracts, mockSubAddresses, mockProperties, mockUsers } from '@/lib/mock/index'
import { useMock } from '@/lib/hooks/useMock'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { 
  CheckCircle, 
  XCircle, 
  Info 
} from '@phosphor-icons/react'

export default function BindingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { locale, isRTL } = useLocale()

  const { data: bindings, isLoading: bindingsLoading } = useMock(mockBindings)
  const { data: rentContracts, isLoading: contractsLoading } = useMock(mockRentContracts)
  const { data: subAddresses, isLoading: unitsLoading } = useMock(mockSubAddresses)
  const { data: properties, isLoading: propsLoading } = useMock(mockProperties)

  if (bindingsLoading || contractsLoading || unitsLoading || propsLoading) {
    return <div className="p-12 text-center">Loading binding details...</div>
  }

  const binding = bindings?.find(b => b.binding_id === id) || null
  if (!binding) {
    return <div className="p-12 text-center text-error">Binding not found</div>
  }

  const subAddress = subAddresses?.find(sa => sa.sub_address_id === binding.sub_address_id) || null
  const property = properties?.find(p => p.na_id === binding.na_id) || null
  const visitor = mockUsers?.find(v => v.user_id === binding.visitor_id) || null
  const rentContract = rentContracts?.find(rc => rc.rent_contract_id === binding.rent_contract_id) || null

  const t = (key: string, param?: string): string => {
    const translations: Record<string, string> = {
      'bindingInformation': isRTL ? 'معلومات الربط' : 'Binding Information',
      'bindingDetailsDesc': isRTL ? 'تفاصيل طلب الربط بين TNA والوحدة' : 'Details of the binding request between TNA and unit',
      'financialContract': isRTL ? 'التفاصيل المالية' : 'Financial Contract',
      'financialDetailsDesc': isRTL ? 'تفاصيل توزيع المبلغ المالي للربط' : 'Breakdown of the financial distribution for the binding',
      'tnaCode': isRTL ? 'كود TNA' : 'TNA Code',
      'unit': isRTL ? 'الوحدة' : 'Unit',
      'property': isRTL ? 'العقار' : 'Property',
      'visitor': isRTL ? 'المستأجر' : 'Visitor',
      'status': isRTL ? 'الحالة' : 'Status',
      'startDate': isRTL ? 'تاريخ البداية' : 'Start Date',
      'endDate': isRTL ? 'تاريخ النهاية' : 'End Date',
      'createdAt': isRTL ? 'تاريخ الإنشاء' : 'Created At',
      'grossAmount': isRTL ? 'الإجمالي' : 'Gross Amount',
      'platformFee': isRTL ? 'رسوم المنصة' : 'Platform Fee',
      'authorityShare': isRTL ? 'حصة الهيئة' : 'Authority Share',
      'netOwnerAmount': isRTL ? 'صافي المبلغ للمالك' : 'Net Owner Amount',
      'approve': isRTL ? 'موافقة' : 'Approve',
      'reject': isRTL ? 'رفض' : 'Reject',
      'terminate': isRTL ? 'إنهاء' : 'Terminate',
      'actions': isRTL ? 'Actions' : 'Actions',
      'note': isRTL ? 'ملاحظة' : 'Note',
      'financialNote': isRTL ? 
        'تظهر تفاصيل المالية المبلغ النهائي الذي سيستلمه المالك بعد خصم جميع الرسوم.' : 
        'Financial details show the final amount the owner will receive after deducting all fees.',
      'statusTimeline': isRTL ? 'تemporal Timeline' : 'Status Timeline',
      'requestCreated': isRTL ? 'تم إنشاء طلب الربط' : 'Binding request created',
      'awaitingApproval': isRTL ? 'في انتظار موافقة المالك' : 'Awaiting owner approval',
      'requestApproved': isRTL ? 'تمت الموافقة على الطلب' : 'Request approved',
      'bindingActivated': isRTL ? 'تم تفعيل الربط' : 'Binding activated',
      'bindingTerminated': isRTL ? 'تم إنهاء الربط' : 'Binding terminated',
      'terminatedByAgreement': isRTL ? 'تم إنهاء الربط بالاتفاق' : 'Binding terminated by agreement',
    }
    
    const result = translations[key] || key
    
    // Handle terminationReason with parameter
    if (key === 'terminationReason' && param) {
      return isRTL ? `السبب: ${param}` : `Reason: ${param}`
    }
    
    return result
  }

  // Financial breakdown
  const gross_amount = rentContract?.gross_amount ?? 1500
  const platform_fee_amount = rentContract?.platform_fee_amount ?? 300
  const authority_share_amount = rentContract?.authority_share_amount ?? 200
  const net_owner_amount = rentContract?.net_owner_amount ?? binding.net_owner_amount ?? 1000

  const sections = [
    {
      title: t('bindingInformation'),
      description: t('bindingDetailsDesc'),
      items: [
        { 
          label: t('tnaCode'), 
          value: binding.tna_code || '-'
        },
        { 
          label: t('unit'), 
          value: subAddress?.label || '-'
        },
        { 
          label: t('property'), 
          value: property?.full_address || '-'
        },
        { 
          label: t('visitor'), 
          value: visitor?.full_name || visitor?.username || '-'
        },
        { 
          label: t('status'), 
          value: (
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
              binding.status === 'ACTIVE' ? "bg-success/10 text-success" : 
              binding.status === 'PENDING' ? "bg-warning/10 text-warning" :
              binding.status === 'COMPLETED' ? "bg-info/10 text-info" :
              binding.status === 'TERMINATED' ? "bg-error/10 text-error" :
              binding.status === 'CANCELLED' ? "bg-neutral-100 text-neutral-500" :
              "bg-neutral-100 text-neutral-400"
            )}>
              {binding.status}
            </span>
          )
        },
        { 
          label: t('startDate'), 
          value: binding.start_at ? new Date(binding.start_at).toLocaleDateString() : '-'
        },
        { 
          label: t('endDate'), 
          value: binding.end_at ? new Date(binding.end_at).toLocaleDateString() : '-'
        },
        { 
          label: t('createdAt'), 
          value: binding.created_at ? new Date(binding.created_at).toLocaleString() : '-'
        },
      ]
    },
    {
      title: t('financialContract'),
      description: t('financialDetailsDesc'),
      items: [
        { 
          label: t('grossAmount'), 
          value: `${gross_amount} SAR`,
          isHighlight: false
        },
        { 
          label: t('platformFee'), 
          value: `${platform_fee_amount} SAR`,
          isHighlight: false
        },
        { 
          label: t('authorityShare'), 
          value: `${authority_share_amount} SAR`,
          isHighlight: false
        },
        { 
          label: t('netOwnerAmount'), 
          value: `${net_owner_amount} SAR`,
          isHighlight: true
        },
      ]
    }
  ]

  const timeline = [
    {
      date: binding.created_at,
      title: t('requestCreated'),
      description: t('awaitingApproval')
    },
    ...(binding.approved_at ? [{
      date: binding.approved_at,
      title: t('requestApproved'),
      description: t('bindingActivated')
    }] : []),
    ...(binding.status === 'TERMINATED' && binding.updated_at ? [{
      date: binding.updated_at,
      title: t('bindingTerminated'),
      description: binding.termination_reason ? 
        t('terminationReason', binding.termination_reason) :
        t('terminatedByAgreement')
    }] : [])
  ]

  const sidebar = (
    <div className="space-y-6">
      {binding.status === 'PENDING' && (
        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('actions')}</h3>
          <div className="space-y-3">
            <Button 
              className="w-full py-4 shadow-glow-primary"
              onClick={() => {
                console.log('Approve binding:', id)
              }}
            >
              <span className="flex items-center justify-between">
                <span>{t('approve')}</span>
                <CheckCircle size={20} weight="bold" />
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-4 border-neutral-200"
              onClick={() => {
                console.log('Reject binding:', id)
              }}
            >
              <span className="flex items-center justify-between">
                <span>{t('reject')}</span>
                <XCircle size={20} weight="bold" />
              </span>
            </Button>
          </div>
        </div>
      )}
      
      {binding.status === 'ACTIVE' && (
        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('actions')}</h3>
          <div className="space-y-3">
            <Button 
              variant="outline"
              className="w-full py-4 border-error/20 text-error hover:bg-error/10"
              onClick={() => {
                console.log('Terminate binding:', id)
              }}
            >
              <span className="flex items-center justify-between">
                <span>{t('terminate')}</span>
                <XCircle size={20} weight="bold" />
              </span>
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
        <div className="flex items-center gap-2 text-info">
          <span className="flex items-center justify-between">
            <span>{t('note')}</span>
            <Info size={20} weight="fill" />
          </span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          {t('financialNote')}
        </p>
      </div>
    </div>
  )

  return (
    <AppShell role="Owner" header={isRTL ? 'تفاصيل الربط' : 'Binding Details'}>
      <DetailViewLayout
        title={`${binding.tna_code} - ${subAddress?.label}`}
        mainContent={sections}
        sidebar={sidebar}
        onBack={() => router.push(`/[locale]/owner/bindings`)}
      />
      
      {/* Timeline Section */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight">
          {t('statusTimeline')}
        </h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div>
                  <h4 className="font-bold text-neutral-900">{item.title}</h4>
                  <p className="text-xs text-neutral-500">{item.date ? new Date(item.date).toLocaleString() : '-'}</p>
                </div>
              </div>
              {item.description && (
                <p className="text-xs text-neutral-600 pl-4">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}