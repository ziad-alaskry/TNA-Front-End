'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Truck,
  CheckCircle,
  XCircle,
  WarningCircle,
  ArrowLeft,
  ChatCircle,
  FileText
} from '@phosphor-icons/react'
import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveriesApi } from '@/lib/api/deliveries'
import type { Shipment, ShipmentStatusLog, ShipmentMessage } from '@/lib/types/deliveries'
import { useToast } from '@/components/ui/Toast'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/formatDate'
import { useMock } from '@/lib/hooks/useMock'
import { mockShipments } from '@/lib/mock/shipments.mock'
import { useTranslation } from 'react-i18next';

const statusConfig: Record<string, { labelAr: string; labelEn: string; color: string; icon: React.ReactNode }> = {
  CREATED: {
    labelAr: 'تم الإنشاء',
    labelEn: 'Created',
    color: 'bg-neutral-100 text-neutral-600',
    icon: <FileText size={16} />
  },
  PICKED_UP: {
    labelAr: 'تم الاستلام',
    labelEn: 'Picked Up',
    color: 'bg-primary/10 text-primary',
    icon: <Package size={16} />
  },
  IN_TRANSIT: {
    labelAr: 'في الطريق',
    labelEn: 'In Transit',
    color: 'bg-secondary/10 text-secondary',
    icon: <Truck size={16} />
  },
  OUT_FOR_DELIVERY: {
    labelAr: 'خارج للتوصيل',
    labelEn: 'Out for Delivery',
    color: 'bg-warning/10 text-warning',
    icon: <Truck size={16} />
  },
  DELIVERED: {
    labelAr: 'تم التوصيل',
    labelEn: 'Delivered',
    color: 'bg-success/10 text-success',
    icon: <CheckCircle size={16} />
  },
  FAILED: {
    labelAr: 'فشل التوصيل',
    labelEn: 'Failed',
    color: 'bg-error/10 text-error',
    icon: <XCircle size={16} />
  },
  RETURNED: {
    labelAr: 'مُعاد',
    labelEn: 'Returned',
    color: 'bg-neutral-100 text-neutral-600',
    icon: <XCircle size={16} />
  }
}

export default function ShipmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { locale, isRTL, t } = useLocale()
  const toast = useToast()
  const queryClient = useQueryClient()
  const shipmentId = params.id as string

  const [newMessage, setNewMessage] = useState('')

  // For now using mock data, would be real API
  const { data: shipments, isLoading } = useMock(mockShipments)
  const shipment = shipments?.find(s => s.shipment_id === shipmentId) || null

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      // TODO: Call real API
      return { status }
    },
    onSuccess: () => {
      toast.success(t('carrier.status_updated_7'))
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
    onError: () => {
      toast.error(t('carrier.failed_to_update_status_8'))
    }
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // TODO: Call real API
      return { message }
    },
    onSuccess: () => {
      toast.success(t('carrier.message_sent_9'))
      setNewMessage('')
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    }
  })

  if (isLoading) {
    return (
        <AppShell role="Carrier">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-neutral-200 rounded-2xl" />
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (!shipment) {
    return (
        <AppShell role="Carrier">
        <div className="text-center py-12 space-y-4">
          <WarningCircle size={64} className="text-warning mx-auto" weight="fill" />
          <h2 className="text-xl font-bold text-neutral-900">
            {t('carrier.shipment_not_found_12')}
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft size={20} className={isRTL ? "rotate-180 ml-2" : "mr-2"} />
            {t('carrier.go_back_14')}
          </Button>
        </div>
      </AppShell>
    )
  }

  const statusInfo = statusConfig[shipment.status] || statusConfig.CREATED

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft size={24} className={cn(isRTL && "rotate-180")} />
          </button>
          <span>{t('carrier.shipment_details_10')}</span>
        </div>
      }>
        <div className="space-y-6 pb-12">
        
        {/* Header Card */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className={cn(
            "p-6",
            shipment.status === 'DELIVERED' ? "bg-success/5" :
            shipment.status === 'FAILED' ? "bg-error/5" :
            "bg-primary/5"
          )}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package size={24} className="text-primary" weight="fill" />
                  <span className="text-sm font-mono font-bold text-neutral-500">{shipment.tracking_number}</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900">{shipment.tna_code}</h1>
                <p className="text-sm text-neutral-600">
                  {t('carrier.sender_16')}: {shipment.sender_name}
                </p>
                <p className="text-sm text-neutral-600">
                  {t('carrier.recipient_17')}: {shipment.recipient_name}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2",
                  statusInfo.color
                )}>
                  {statusInfo.icon}
                  {isRTL ? statusInfo.labelAr : statusInfo.labelEn}
                </span>
                <p className="text-xs text-neutral-500">
                  {t('carrier.created_18')}: {formatDate(shipment.created_at)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Info */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                <MapPin size={20} className="text-primary" weight="fill" />
                {t('carrier.delivery_address_19')}
              </h3>
              <div className="space-y-2 text-neutral-700">
                <p className="font-bold">{shipment.destination_address_full}</p>
                {shipment.estimated_delivery && (
                  <p className="text-sm text-neutral-500">
                    {t('carrier.expected_delivery_20')}: {formatDate(shipment.estimated_delivery)}
                  </p>
                )}
                {shipment.actual_delivery && (
                  <p className="text-sm text-success">
                    {t('carrier.delivered_at_21')}: {formatDate(shipment.actual_delivery)}
                  </p>
                )}
              </div>
            </section>

            {/* Package Details */}
            {shipment.package_details && (
              <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                  <Package size={20} className="text-secondary" weight="fill" />
                  {t('carrier.package_details_22')}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {shipment.package_details.weight && (
                    <div>
                      <span className="text-neutral-500">{t('carrier.weight_23')}:</span>
                      <span className="font-bold text-neutral-900 ms-2">{shipment.package_details.weight} kg</span>
                    </div>
                  )}
                  {shipment.package_details.dimensions && (
                    <div>
                      <span className="text-neutral-500">{t('carrier.dimensions_24')}:</span>
                      <span className="font-bold text-neutral-900 ms-2">{shipment.package_details.dimensions}</span>
                    </div>
                  )}
                </div>
                {shipment.package_details.contents && (
                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-neutral-500 text-sm">{t('carrier.contents_25')}:</span>
                    <p className="font-bold text-neutral-900 mt-1">{shipment.package_details.contents}</p>
                  </div>
                )}
              </section>
            )}

            {/* Status Timeline */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                <Clock size={20} className="text-secondary" weight="fill" />
                {t('carrier.status_history_26')}
              </h3>
              <div className="space-y-4">
                {shipment.shipment_status_logs?.map((log: ShipmentStatusLog, idx: number) => (
                  <div key={log.log_id} className="flex gap-4 relative">
                    {idx < (shipment.shipment_status_logs?.length || 0) - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-neutral-200" />
                    )}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                      statusConfig[log.status]?.color.replace('text-', 'bg-').replace('text-neutral-600', 'bg-neutral-200')
                    )}>
                      {statusConfig[log.status]?.icon || <Clock size={16} />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-neutral-900">
                          {isRTL ? statusConfig[log.status]?.labelAr : statusConfig[log.status]?.labelEn}
                        </span>
                        <span className="text-xs text-neutral-400">{formatDate(log.logged_at)}</span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-neutral-600 mt-1">{log.notes}</p>
                      )}
                      {log.location && (
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {log.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Messages Thread */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                 <ChatCircle size={20} className="text-primary" weight="fill" />
                {t('carrier.messages_27')}
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {shipment.shipment_messages?.map((msg: ShipmentMessage) => (
                  <div key={msg.message_id} className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    msg.sender_role === 'CARRIER' 
                      ? "bg-primary/5 ml-auto" 
                      : "bg-neutral-100"
                  )}>
                    <p className="text-sm text-neutral-900">{msg.message_text}</p>
                    <p className="text-[10px] text-neutral-400 mt-1 text-start">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <InputField
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('carrier.type_your_message_28')}
                  className="flex-1"
                />
                <Button
                  onClick={() => sendMessageMutation.mutate(newMessage)}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                   <ChatCircle size={20} weight="fill" />
                </Button>
              </div>
            </section>

          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            
            {/* Status Update */}
            {shipment.status !== 'DELIVERED' && shipment.status !== 'FAILED' && (
              <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">
                  {t('carrier.update_status_29')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => updateStatusMutation.mutate({ status: key })}
                      disabled={updateStatusMutation.isPending || shipment.status === key}
                      className={cn(
                        "w-full p-3 rounded-lg border text-start flex items-center gap-3 transition-all",
                        shipment.status === key
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-neutral-200 hover:border-primary/30"
                      )}
                    >
                      {config.icon}
                      <span className="text-sm font-bold">{isRTL ? config.labelAr : config.labelEn}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">
                {t('carrier.quick_actions_30')}
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone size={18} />
                  {t('carrier.call_customer_31')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin size={18} />
                  {t('carrier.open_in_maps_32')}
                </Button>
                {shipment.status === 'OUT_FOR_DELIVERY' && (
                  <Button 
                    className="w-full justify-start bg-success text-white hover:bg-success/90"
                    onClick={() => router.push(`/${locale}/carrier/driver/confirm?shipment=${shipmentId}`)}
                  >
                    <CheckCircle size={18} weight="fill" />
                    {t('carrier.confirm_delivery_33')}
                  </Button>
                )}
              </div>
            </section>

          </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  )
}
