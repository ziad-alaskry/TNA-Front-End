'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockProperties, mockSubAddresses } from '@/lib/mock/properties.mock';
import { mockTNAs } from '@/lib/mock/tnas.mock';
import { useLocale } from '@/i18n/LocaleProvider';
import { 
  MagnifyingGlass, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Calendar,
  Buildings,
  CheckCircle,
  CurrencyCircleDollar,
  WarningCircle,
  IdentificationCard,
  Star,
  Info,
CircleWavyCheckIcon
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { usePriceCatalogStore } from '@/lib/store/usePriceCatalogStore';
import { useBindingContext } from '@/context/BindingContext';
import { bindingsApi } from '@/lib/api/bindings';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { useToast } from '@/components/ui/Toast';
import type { RentalPeriodType } from '@/lib/types/rentals';

export default function TNABindingWizard() {
  const router = useRouter();
  const params = useParams();
  const { locale, isRTL, t } = useLocale();
  const toast = useToast();
  const tnaId = params.id as string;
  const { addPendingBinding } = useBindingContext();
  const quoteErrorMessage = t('binding.quote_error');

  const { getRentQuote, loading: quoteLoading } = usePriceCatalogStore();

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalPeriodType, setRentalPeriodType] = useState<RentalPeriodType>('MONTHLY');
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tna = mockTNAs.find(t => t.tna_id === tnaId);

  // Filter properties based on search - only verified properties
  const filteredProperties = mockProperties.filter(p => 
    p.ownership_proof_status === 'VERIFIED' && (
      p.full_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.building_number?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
  );

  const propertyVariants = selectedProperty 
    ? mockSubAddresses.filter(s => s.na_id === selectedProperty.na_id && s.is_available && s.is_verified)
    : [];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();

  // Fetch quote when period details change
  useEffect(() => {
    if (selectedVariant && startDate && endDate && days > 0) {
      const fetchQuote = async () => {
        setLoadingQuote(true);
        try {
          const quoteData = await getRentQuote({
            tna_id: tnaId,
            sub_address_id: selectedVariant.sub_address_id,
            rental_period_type: rentalPeriodType,
            rental_duration: days
          });
          setQuote(quoteData);
          setError(null);
        } catch (err: any) {
          setError(err.message || quoteErrorMessage);
          setQuote(null);
        } finally {
          setLoadingQuote(false);
        }
      };
      fetchQuote();
    }
  }, [selectedVariant, startDate, endDate, rentalPeriodType, days, tnaId, getRentQuote, quoteErrorMessage]);

  if (!tna) return <div>{t('tna.error.not_found')}</div>;

  const handleSubmit = async () => {
    if (!quote) return;
    setSubmitting(true);
    setError(null);
    try {
      // Create binding request
      const response = await bindingsApi.createBinding({
        tna_id: tnaId,
        sub_address_id: selectedVariant.sub_address_id,
        rental_period_type: rentalPeriodType,
        rental_duration: days
      });

      const { data: binding, rent_contract } = response;
      // Add binding to local context state so it can be activated after payment
      addPendingBinding(binding);
      toast.success(t('binding.created'));

      // Redirect to checkout page
      router.push(`/${locale}/visitor/checkout/${binding.binding_id}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(t('binding.conflict_error'));
      } else {
        setError(err.message || t('binding.create_error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step === s ? "bg-primary text-white shadow-glow-primary" : 
              step > s ? "bg-success text-white" : "bg-neutral-200 text-neutral-400"
            )}>
              {step > s ? <CheckCircle weight="bold" /> : s}
            </div>
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider hidden sm:block",
              step === s ? "text-primary" : "text-neutral-400"
            )}>
              {s === 1 ? t('binding.step1') : 
               s === 2 ? t('binding.step2') : 
               t('binding.step3')}
            </span>
            {s < 3 && <div className="w-8 h-0.5 bg-neutral-200 mx-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Step 1: Search National Address */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <MapPin className="text-primary" />
                {t('binding.find_address')}
              </h2>
              <p className="text-neutral-500">
                {t('binding.find_address_desc')}
              </p>
            </div>

            <div className="relative">
              <InputField 
                icon={MagnifyingGlass}
                placeholder={t('binding.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {filteredProperties.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  {t('binding.no_properties')}
                </div>
              ) : (
                filteredProperties.map((prop) => {
                  const isSelected = selectedProperty?.na_id === prop.na_id
                  return (
                    <div 
                      key={prop.na_id}
                      onClick={() => setSelectedProperty(prop)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all cursor-pointer group relative",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-neutral-100 hover:border-primary/30 bg-neutral-50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            isSelected ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500 group-hover:bg-primary/20 group-hover:text-primary"
                          )}>
                            <Buildings size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 leading-tight">{prop.full_address}</p>
                            <p className="text-xs text-neutral-500 mt-1">{prop.city}, {prop.district || ''}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-success">
                                <Star size={12} weight="fill" />
                                {t('binding.verified')}
                              </span>
                              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                {t('binding.units_available', { count: mockSubAddresses.filter(s => s.na_id === prop.na_id && s.is_available && s.is_verified).length })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                            <CheckCircle weight="fill" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedProperty}
                className="px-8 gap-2"
              >
                {t('common.next')}
                <ArrowRight className={cn(isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Variant + Period */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                {t('binding.select_unit_period')}
              </h2>
              <p className="text-neutral-500">
                {t('binding.select_unit_desc')}
              </p>
            </div>

            {/* Selected Property Summary */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <Buildings size={20} className="text-primary" />
              <div className="text-sm">
                <p className="font-bold text-neutral-900">{selectedProperty.full_address || selectedProperty.name}</p>
                <p className="text-xs text-neutral-500">{selectedProperty.city}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {t('binding.available_units')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {propertyVariants.map((v) => (
                  <div 
                    key={v.sub_address_id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all cursor-pointer",
                      selectedVariant?.sub_address_id === v.sub_address_id
                        ? "border-primary bg-primary/5"
                        : "border-neutral-100 bg-neutral-50 hover:border-primary/20"
                    )}
                  >
                    <p className="font-bold text-neutral-900">{v.label}</p>
                    <p className="text-xs text-neutral-500 font-mono mt-1">
                      {t('binding.suffix')}: {v.suffix_code}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                  {t('binding.start_date')} *
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                  {t('binding.end_date')} *
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {t('binding.period_type')} *
              </label>
              <div className="flex gap-3">
                {(['DAILY', 'MONTHLY', 'YEARLY'] as RentalPeriodType[]).map((period) => (
                  <Button
                    key={period}
                    type="button"
                    size="sm"
                    variant={rentalPeriodType === period ? "primary" : "outline"}
                    onClick={() => setRentalPeriodType(period)}
                  >
                    {t(`rental_period.${period.toLowerCase()}`)}
                  </Button>
                ))}
              </div>
            </div>

            {loadingQuote && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
                <p className="text-sm text-neutral-500">{t('binding.calculating')}</p>
              </div>
            )}

            {error && <ErrorAlert message={error} />}

            {quote && !loadingQuote && (
              <div className="p-4 bg-info/5 border border-info/10 rounded-xl flex items-start gap-3">
                <CurrencyCircleDollar size={24} className="text-info mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-info">
                    {t('binding.estimated_cost')}: {t('common.currency')} {quote.gross_amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-info/70">
                    {t('binding.breakdown')} - 
                    {t('binding.platform_fee')}: {t('common.currency')} {quote.platform_fee_amount.toFixed(2)} | 
                    {t('binding.authority_share')}: {t('common.currency')} {quote.authority_share_amount.toFixed(2)} | 
                    {t('binding.owner_net')}: {t('common.currency')} {quote.net_owner_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowLeft className={cn(isRTL && "rotate-180")} />
                {t('common.back')}
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedVariant || !startDate || !endDate || days <= 0 || !quote}
                className="px-8"
              >
                {t('common.review')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                {t('binding.review_title')}
              </h2>
              <p className="text-neutral-500">
                {t('binding.review_desc')}
              </p>
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 divide-y divide-neutral-200">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <IdentificationCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">{t('binding.tna_code')}</p>
                      <p className="font-mono font-bold text-neutral-900">{tna.tna_code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">{t('binding.target_address')}</p>
                    <p className="font-bold text-neutral-900">{selectedVariant?.suffix_code}</p>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">{t('binding.period')}</p>
                    <p className="text-sm font-bold text-neutral-900">{startDate} → {endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">{t('binding.duration')}</p>
                    <p className="text-sm font-bold text-neutral-900">{days} {t('units.days')}</p>
                  </div>
                </div>

                {quote && (
                  <>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-neutral-900 mb-3">
                        {t('binding.financial_breakdown')}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('binding.gross_amount')}</span>
                          <span className="font-medium">{t('common.currency')} {quote.gross_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            {t('binding.platform_fee')} ({quote.platform_fee_percentage}%)
                          </span>
                          <span className="font-medium text-error">- {t('common.currency')} {quote.platform_fee_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            {t('binding.authority_share')} ({quote.authority_share_percentage}%)
                          </span>
                          <span className="font-medium text-error">- {t('common.currency')} {quote.authority_share_amount.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-neutral-100 my-2" />
                        <div className="flex justify-between text-lg font-black text-primary">
                          <span>{t('binding.total_payable')}</span>
                          <span>{t('common.currency')} {quote.gross_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-500 pt-1">
                          <span>{t('binding.owner_net')}</span>
                          <span className="font-semibold text-success">+ {t('common.currency')} {quote.net_owner_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-neutral-100" />
                  </>
                )}

                <div className="p-6 bg-primary text-white">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium opacity-80">
                      {t('binding.total_amount')}
                    </p>
                    <p className="text-2xl font-bold">
                      {t('common.currency')} {quote?.gross_amount.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <CircleWavyCheckIcon size={16} weight="fill" />
                    {t('binding.escrow_notice')}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-3">
                <Info size={20} className="text-warning mt-0.5" />
                <p className="text-xs text-warning-dark leading-relaxed">
                  {t('binding.submit_notice')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(2)}
                disabled={submitting}
                className="gap-2"
              >
                <ArrowLeft className={cn(isRTL && "rotate-180")} />
                {t('common.back')}
              </Button>
              <Button 
                onClick={handleSubmit}
                isLoading={submitting}
                disabled={!quote}
                className="px-10 py-6 text-lg shadow-glow-primary"
              >
                {t('binding.submit_request')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
