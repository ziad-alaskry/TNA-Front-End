'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { useLocale } from '@/i18n/LocaleProvider';
import { 
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ChatCircleDots,
  ArrowLeft
} from '@phosphor-icons/react';
import { deliveriesApi } from '@/lib/api/deliveries';
import ErrorAlert from '@/components/ui/ErrorAlert';
import Button from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { cn } from '@/lib/utils/cn';
import type { Shipment, ShipmentStatusLog, ShipmentMessage } from '@/lib/types/deliveries';

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { locale, t, isRTL } = useLocale();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [logs, setLogs] = useState<ShipmentStatusLog[]>([]);
  const [messages, setMessages] = useState<ShipmentMessage[]>([]);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await deliveriesApi.getShipmentById(id as string);
        setShipment(data);
        // These fields need to be populated by backend; use fallback empty arrays
        setLogs(data.shipment_status_logs || []);
        setMessages(data.shipment_messages || []);
      } catch (err: any) {
        setError(err.response?.status === 404 
          ? t('shipments.error.not_found') || 'Shipment not found'
          : t('common.error_network') || 'Failed to load shipment'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id, t]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; class: string; icon: any }> = {
      'CREATED': { label: t('shipments.status.created') || 'Created', class: 'bg-neutral-100 text-neutral-500', icon: Package },
      'PICKED_UP': { label: t('shipments.status.picked_up') || 'Picked Up', class: 'bg-primary/10 text-primary', icon: Truck },
      'IN_TRANSIT': { label: t('shipments.status.in_transit') || 'In Transit', class: 'bg-info/10 text-info', icon: Truck },
      'OUT_FOR_DELIVERY': { label: t('shipments.status.out_for_delivery') || 'Out for Delivery', class: 'bg-warning/10 text-warning', icon: Truck },
      'DELIVERED': { label: t('shipments.status.delivered') || 'Delivered', class: 'bg-success/10 text-success', icon: CheckCircle },
      'FAILED': { label: t('shipments.status.failed') || 'Failed', class: 'bg-error/10 text-error', icon: Package },
      'RETURNED': { label: t('shipments.status.returned') || 'Returned', class: 'bg-neutral-100 text-neutral-500', icon: Package },
    };
    return configs[status] || configs['CREATED'];
  };

  if (loading) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor">
          <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-64" />
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  if (error || !shipment) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor">
          <div className="max-w-md mx-auto py-12">
            <ErrorAlert message={error || t('shipments.error.not_found') || 'Shipment not found'} />
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  const statusConfig = getStatusConfig(shipment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('shipments.detail.title') || 'Shipment Details'}>
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Package size={16} />
                  <span className="font-mono">{shipment.tracking_number}</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900">
                  {t('shipments.detail.to_address') || 'To'}: {shipment.tna_code || 'N/A'}
                </h1>
                {shipment.destination_address_full && (
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <MapPin size={16} className="text-neutral-400" />
                    {shipment.destination_address_full}
                  </p>
                )}
              </div>
              <div className={cn(
                "px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 w-fit",
                statusConfig.class
              )}>
                <StatusIcon size={20} weight="fill" />
                {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {logs.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Clock className="text-primary" />
                {t('shipments.detail.tracking_timeline') || 'Tracking Timeline'}
              </h2>
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-neutral-200 before:content-['']">
                {logs.map((log, idx) => (
                  <div key={log.log_id} className="relative flex items-center gap-4">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                      <CheckCircle size={18} weight="fill" />
                    </div>
                    <div className="flex-1 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-neutral-900">{log.status.replace('_', ' ')}</p>
                        <p className="text-xs text-neutral-500">
                          {new Date(log.logged_at).toLocaleString()}
                        </p>
                      </div>
                      {log.notes && <p className="text-sm text-neutral-600">{log.notes}</p>}
                      {log.location && (
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} /> {log.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Thread */}
          {messages.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <ChatCircleDots className="text-primary" />
                {t('shipments.detail.messages') || 'Messages'}
              </h2>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.message_id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{msg.sender_role}</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="text-neutral-800">{msg.message_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Details */}
          {shipment.package_details && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">
                {t('shipments.detail.package_info') || 'Package Information'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {shipment.package_details.weight && (
                  <div>
                    <p className="text-xs text-neutral-500">{t('shipments.detail.weight') || 'Weight'}</p>
                    <p className="font-bold">{shipment.package_details.weight} kg</p>
                  </div>
                )}
                {shipment.package_details.dimensions && (
                  <div>
                    <p className="text-xs text-neutral-500">{t('shipments.detail.dimensions') || 'Dimensions'}</p>
                    <p className="font-bold">{shipment.package_details.dimensions}</p>
                  </div>
                )}
                {shipment.package_details.contents && (
                  <div className="col-span-2">
                    <p className="text-xs text-neutral-500">{t('shipments.detail.contents') || 'Contents'}</p>
                    <p className="font-bold">{shipment.package_details.contents}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft size={16} className={cn(isRTL && "rotate-180")} />
              {t('common.back') || 'Back'}
            </Button>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
