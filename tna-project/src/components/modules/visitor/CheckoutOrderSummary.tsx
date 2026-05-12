import React from 'react';
import { useTranslation } from 'react-i18next';

interface CheckoutOrderSummaryProps {
  total: number;
  tnaId: string;
  type: string;
  balance: number;
}

export const CheckoutOrderSummary = ({
  total,
  tnaId,
  type,
  balance,
}: CheckoutOrderSummaryProps) => {
  const { t } = useTranslation();
  
  const isInsufficient = balance < total;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">{t('checkout.order_summary')}</h3>
        <span className={`font-mono text-sm ${isInsufficient ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isInsufficient ? t('checkout.insufficient') : t('checkout.available_balance')}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('checkout.binding_request')}:</span>
          <span>{tnaId}</span>
        </div>
        
        <div className="flex justify-between">
          <span>{t('checkout.type')}:</span>
          <span>{type}</span>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <span className="font-medium">{t('checkout.total_payable')}:</span>
          <span className="font-mono">{t('common.currency')} {total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <span className="font-medium">{t('checkout.wallet_balance')}:</span>
          <span className="font-mono">{t('common.currency')} {balance.toFixed(2)}</span>
        </div>
      </div>
      
      {isInsufficient && (
        <div className="mt-4 p-3 bg-warning/50 border border-warning rounded-lg">
          <small>{t('checkout.insufficient_funds', { amount: (total - balance).toFixed(2) })}</small>
        </div>
      )}
    </div>
  );
};