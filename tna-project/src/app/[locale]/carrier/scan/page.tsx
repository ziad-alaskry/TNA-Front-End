'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Scan, Package, QrCode, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import { useLocale } from '@/i18n/LocaleProvider';

export default function ScannerSimulator() {
  const router = useRouter();
  const { locale, isRTL } = useLocale();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2000));
    setIsScanning(false);
    setResult('TNA-ABCD1234');
  };

  return (
    <AppShell role="Carrier" header="Scanner Simulator">
      <div className="max-w-md mx-auto space-y-8 py-8 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 uppercase">Shipment Scanner</h2>
          <p className="text-neutral-500">Scan a TNA barcode to retrieve shipment information.</p>
        </div>

        <div className="relative aspect-square bg-neutral-900 rounded-3xl overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
          {/* Scanner Viewport UI */}
          <div className="absolute inset-8 border-2 border-primary/50 rounded-2xl">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
             
             {isScanning && (
               <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-glow-primary animate-scan-line" />
             )}
          </div>

          {!isScanning && !result && (
            <QrCode size={120} weight="thin" className="text-white/20" />
          )}

          {isScanning && (
             <p className="text-white text-xs font-bold animate-pulse">SEARCHING FOR BARCODE...</p>
          )}

          {result && (
            <div className="text-center space-y-4 p-8 animate-in zoom-in-95 duration-500">
               <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-success mx-auto">
                 <CheckCircle size={40} weight="fill" />
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">TNA Detected</p>
                 <p className="text-3xl font-black text-white font-mono">{result}</p>
               </div>
               <Button 
                className="w-full py-4 shadow-glow-primary"
                onClick={() => router.push(`/${locale}/carrier/shipments`)}
               >
                 Go to Shipment
               </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {!isScanning && !result && (
            <Button className="py-6 text-lg shadow-glow-primary" onClick={startScan}>
              <Scan size={24} weight="bold" />
              Simulate Scan
            </Button>
          )}
          
          {(isScanning || result) && (
            <Button variant="outline" className="py-4" onClick={() => { setIsScanning(false); setResult(null); }}>
              Reset Scanner
            </Button>
          )}

          <Button variant="ghost" className="text-neutral-400" onClick={() => router.back()}>
            <ArrowLeft className={isRTL ? "rotate-180" : ""} />
            Back
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </AppShell>
  );
}
