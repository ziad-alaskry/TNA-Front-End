'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { AppShell } from '@/components/layout/AppShell'
import { 
    MagnifyingGlass, 
    MapPin, 
    CheckCircle, 
    WarningCircle,
    ArrowRight,
    MapTrifold,
    Funnel
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/utils/cn'

export default function VisitorSearchPage() {
  const router = useRouter()
  const { locale, isRTL, t } = useLocale()
  const { realEstateObjects } = useBindingContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedObjId, setSelectedObjId] = useState<string | null>(null)

  const getPropertyName = (id: string, fallback: string) => {
    const key = `visitor.search.properties.${id}.name`
    const value = t(key)
    return value === key ? fallback : value
  }

  const filteredObjects = realEstateObjects.filter(
    (obj) => {
      const query = searchQuery.toLowerCase()
      return (
      getPropertyName(obj.id, obj.name).toLowerCase().includes(query) ||
      obj.building_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  )

  const selectedObject = useMemo(
    () => realEstateObjects.find((a) => a.id === selectedObjId) ?? null,
    [selectedObjId, realEstateObjects]
  )

  const handleProceedToRequest = () => {
    if (!selectedObject) return
    router.push(`/${locale}/visitor/request?obj_id=${selectedObject.id}`)
  }

  const sidebar = (
    <div className="space-y-6 text-start">
      <div>
        <h3 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Funnel size={18} />
            {t('visitor.search.filter_results')}
        </h3>
        <div className="relative group">
            <MagnifyingGlass
              size={20}
              className={cn(
                'absolute top-3 text-neutral-400 group-focus-within:text-primary transition-colors',
                isRTL ? 'right-3' : 'left-3'
              )}
            />
            <input
            type="text"
            placeholder={t('visitor.search.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full rounded-sm border border-neutral-200 bg-surface-100 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none',
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            )}
            />
        </div>
      </div>
      
      <div className="pt-4 border-t border-neutral-100">
        <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
            <WarningCircle size={14} className={cn('inline-block text-warning', isRTL ? 'ml-1' : 'mr-1')} weight="fill" />
            {t('visitor.search.binding_note')}
        </p>
      </div>
    </div>
  )

  return (
    <AppShell role="Visitor" header={t('visitor.search.header')}>
      <DetailViewLayout
        title={t('visitor.search.title')}
        breadcrumb={[t('visitor.search.breadcrumb_home'), t('visitor.search.breadcrumb_search')]}
        mainContent={[]}
        sidebar={sidebar}
        actions={
          <button
            type="button"
            disabled={!selectedObjId}
            onClick={handleProceedToRequest}
            className="rounded-pill bg-btn-primary px-6 h-10 text-sm font-bold text-white shadow-btn flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t('visitor.search.continue_request')}
            <ArrowRight size={18} className={cn(isRTL && 'rotate-180')} />
          </button>
        }
      >
        <div className="rounded-md border border-neutral-200 bg-surface-200 shadow-card">
          <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <MapPin size={22} className="text-primary" weight="fill" />
                {t('visitor.search.available_properties', { count: filteredObjects.length })}
            </h2>
            <div className="flex gap-2">
                <button className="p-2 bg-neutral-100 rounded-sm text-neutral-500 hover:text-primary transition-colors">
                    <MapTrifold size={20} />
                </button>
            </div>
          </div>
          
          <ul className="divide-y divide-neutral-100">
            {filteredObjects.length === 0 ? (
                <li className="p-12 text-center text-neutral-500">
                    {t('visitor.search.no_results')}
                </li>
            ) : (
                filteredObjects.map((obj) => {
                const isSelected = selectedObjId === obj.id
                const cityKey = `visitor.search.properties.${obj.id}.city`
                const districtKey = `visitor.search.properties.${obj.id}.district`
                const city = t(cityKey) === cityKey ? t('visitor.search.default_city') : t(cityKey)
                const district = t(districtKey) === districtKey ? t('visitor.search.default_district') : t(districtKey)
                return (
                    <li
                    key={obj.id}
                    onClick={() => setSelectedObjId(obj.id)}
                    className={cn(
                        "px-6 py-6 cursor-pointer transition-all",
                        isRTL ? 'border-r-4' : 'border-l-4',
                        isSelected
                        ? "bg-primary/5 border-primary shadow-inner"
                        : "hover:bg-neutral-50 border-transparent"
                    )}
                    >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1 text-start">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-neutral-900 group-hover:text-primary transition-colors">
                                {getPropertyName(obj.id, obj.name)}
                            </h3>
                            <span className="px-2 py-0.5 bg-success-bg text-success text-[10px] font-bold rounded">{t('visitor.search.available_badge')}</span>
                        </div>
                        <p className="text-xs text-neutral-600 flex items-center gap-1">
                            <MapPin size={14} className="text-neutral-400" />
                            {t('visitor.search.address_line', { sector: obj.sector_id, city, district })}
                        </p>
                        <div className="mt-3 flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-neutral-400">{t('visitor.search.building_number')}</span>
                                <span className="text-xs font-mono font-bold text-neutral-700">{obj.building_number}</span>
                            </div>
                        </div>
                        </div>
                        
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected ? "border-primary bg-primary" : "border-neutral-200"
                        )}>
                            {isSelected && <CheckCircle size={16} weight="fill" className="text-white" />}
                        </div>
                    </div>
                    </li>
                )
                })
            )}
          </ul>
        </div>
      </DetailViewLayout>
    </AppShell>
  )
}
