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
  Info
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';

export default function TNABindingWizard() {
  const router = useRouter();
  const params = useParams();
  const { locale, isRTL } = useLocale();
  const tnaId = params.id as string;

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const tna = mockTNAs.find(t => t.tna_id === tnaId);

  // Filter properties based on search
  const filteredProperties = mockProperties.filter(p => 
    p.full_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const propertyVariants = selectedProperty 
    ? mockSubAddresses.filter(s => s.na_id === selectedProperty.na_id && s.is_available)
    : [];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const rentalFee = days * 50; // Mock 50 SAR per day
  const issuanceFee = 50;
  const totalFee = rentalFee + issuanceFee;

  if (!tna) return <div>TNA not found</div>;

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
              {s === 1 ? 'Search Address' : s === 2 ? 'Details & Period' : 'Review'}
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
                Find a National Address
              </h2>
              <p className="text-neutral-500">Search for a registered property to bind your TNA to.</p>
            </div>

            <div className="relative">
              <InputField 
                icon={MagnifyingGlass}
                placeholder="Search by city, district or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {filteredProperties.map((prop) => (
                <div 
                  key={prop.na_id}
                  onClick={() => setSelectedProperty(prop)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer group relative",
                    selectedProperty?.na_id === prop.na_id 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-neutral-100 hover:border-primary/30 bg-neutral-50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        selectedProperty?.na_id === prop.na_id ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500 group-hover:bg-primary/20 group-hover:text-primary"
                      )}>
                        <Buildings size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 leading-tight">{prop.full_address}</p>
                        <p className="text-xs text-neutral-500 mt-1">{prop.city}, {prop.district}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-warning">
                            <Star size={12} weight="fill" />
                            4.8 Rating
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase">
                            {mockSubAddresses.filter(s => s.na_id === prop.na_id && s.is_available).length} Units Available
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedProperty?.na_id === prop.na_id && (
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <CheckCircle weight="fill" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedProperty}
                className="px-8"
              >
                Next: Select Unit
                <ArrowRight className={cn("ml-2", isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Variant + Period */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">Select Unit & Period</h2>
              <p className="text-neutral-500">Choose a specific unit in the property and define your usage period.</p>
            </div>

            {/* Selected Property Summary */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <Buildings size={20} className="text-primary" />
              <div className="text-sm">
                <p className="font-bold text-neutral-900">{selectedProperty.full_address}</p>
                <p className="text-xs text-neutral-500">{selectedProperty.city}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Available Units</h3>
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
                    <p className="text-xs text-neutral-500 font-mono mt-1">Suffix: {v.suffix_code}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {days > 0 && (
              <div className="p-4 bg-info/5 border border-info/10 rounded-xl flex items-center gap-3">
                <CurrencyCircleDollar size={24} className="text-info" />
                <div>
                  <p className="text-sm font-bold text-info">Estimated Fee: SAR {totalFee.toFixed(2)}</p>
                  <p className="text-xs text-info/70">Based on {days} days duration + issuance fee.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className={cn("mr-2", isRTL && "rotate-180")} />
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedVariant || !startDate || !endDate || days <= 0}
                className="px-8"
              >
                Review Order
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">Final Review</h2>
              <p className="text-neutral-500">Please review your binding request before proceeding to payment.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 divide-y divide-neutral-200">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <IdentificationCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">TNA Address</p>
                      <p className="font-mono font-bold text-neutral-900">{tna.tna_code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Target Address</p>
                    <p className="font-bold text-neutral-900">{selectedVariant.suffix_code}</p>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Period</p>
                    <p className="text-sm font-bold text-neutral-900">{startDate} → {endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Total Duration</p>
                    <p className="text-sm font-bold text-neutral-900">{days} Days</p>
                  </div>
                </div>

                <div className="p-6 bg-primary text-white">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium opacity-80">Rental Fee ({days} days)</p>
                    <p className="font-bold">SAR {rentalFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-sm font-medium opacity-80">Issuance Fee</p>
                    <p className="font-bold">SAR {issuanceFee.toFixed(2)}</p>
                  </div>
                  <div className="h-px bg-white/20 mb-6" />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Amount</p>
                      <p className="text-4xl font-black tracking-tighter">SAR {totalFee.toFixed(2)}</p>
                    </div>
                    <CheckCircle size={40} className="opacity-40" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-3">
                <Info size={20} className="text-warning mt-0.5" />
                <p className="text-xs text-warning-dark leading-relaxed">
                  Submitting this request will reserve the unit for you. You will be redirected to the checkout page to finalize the payment using your digital wallet.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className={cn("mr-2", isRTL && "rotate-180")} />
                Back
              </Button>
              <Button 
                onClick={() => {
                  // Save order info to session/state and redirect
                  router.push(`/${locale}/visitor/checkout?type=binding&tna=${tnaId}&variant=${selectedVariant.sub_address_id}&total=${totalFee}`);
                }}
                className="px-10 py-6 text-lg shadow-glow-primary"
              >
                Confirm & Pay
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
