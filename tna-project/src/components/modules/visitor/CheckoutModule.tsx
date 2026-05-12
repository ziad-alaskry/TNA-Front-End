import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useWalletStore } from '@/lib/store/useWalletStore';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';

export const CheckoutModule = ({
  total,
  tnaId,
  type,
}: {
  total: number;
  tnaId: string;
  type: string;
}) => {
  const { t } = useTranslation();
  const { balance, setBalance } = useWalletStore();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Luhn algorithm for card validation
  const isValidCardNumber = (num: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    // Remove spaces and dashes
    const cleaned = num.replace(/[-\s]/g, '');

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const isValidExpiry = (date: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return month >= 1 && month <= 12;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'credit-card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = t('auth.validation.field_required');
      } else if (!isValidCardNumber(cardNumber)) {
        newErrors.cardNumber = t('payment.invalid_card');
      }

      if (!expiry.trim()) {
        newErrors.expiry = t('auth.validation.field_required');
      } else if (!isValidExpiry(expiry)) {
        newErrors.expiry = t('payment.invalid_expiry');
      }

      if (!cvv.trim()) {
        newErrors.cvv = t('auth.validation.field_required');
      } else if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = t('payment.invalid_cvv');
      }

      if (!cardholderName.trim()) {
        newErrors.cardholderName = t('payment.name_required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTopUp = () => {
    if (!validateForm()) return;

    // Simulate successful top-up
    const amountToAdd = 5000; // Fixed amount for demo
    setBalance(balance + amountToAdd);
    toast.success(t('payment.top_up_success', { amount: amountToAdd }));

    // Auto-close Top Up modal after 1.5s
    setTimeout(() => {
      setIsTopUpModalOpen(false);
      // Reset form
      setCardNumber('');
      setExpiry('');
      setCVV('');
      setCardholderName('');
    }, 1500);
  };

  const handlePay = () => {
    if (balance >= total) {
      // Simulate successful payment
      setBalance(balance - total);
      toast.success(t('checkout.payment_success'));
      // In a real app, we would redirect to order confirmation
      // router.push(`/ar/order-confirmation?tna=${tnaId}&type=${type}`);
    } else {
      setIsTopUpModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <CheckoutOrderSummary
        total={total}
        tnaId={tnaId}
        type={type}
        balance={balance}
      />

      <div className="space-y-4">
        <p className="font-medium">{t('payment.method')}</p>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex gap-4"
        >
          <RadioGroupItem value="credit-card">
            {t('payment.credit_card')}
          </RadioGroupItem>
          <RadioGroupItem value="apple-pay" disabled>
            {t('payment.apple_pay')} ({t('payment.coming_soon')})
          </RadioGroupItem>
          <RadioGroupItem value="stc-pay" disabled>
            {t('payment.stc_pay')} ({t('payment.coming_soon')})
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {paymentMethod === 'credit-card' && (
        <div className="space-y-4">
          <InputField
            label={t('payment.card_number')}
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            error={errors.cardNumber}
            placeholder="4111 1111 1111 1111"
            inputClassName="monospace"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t('payment.expiry')}
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              error={errors.expiry}
              placeholder="MM/YY"
              maxLength={5}
            />

            <InputField
              label={t('payment.cvv')}
              value={cvv}
              onChange={e => setCVV(e.target.value)}
              error={errors.cvv}
              placeholder="123"
              type="password"
              maxLength={3}
            />
          </div>

          <InputField
            label={t('payment.cardholder_name')}
            value={cardholderName}
            onChange={e => setCardholderName(e.target.value)}
            error={errors.cardholderName}
            placeholder={t('payment.cardholder_placeholder')}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            // In a real app, we would go back to cart
            // router.goBack();
          }}
        >
          {t('common.goBack')}
        </Button>
        <Button
          onClick={handlePay}
          disabled={balance < total && paymentMethod !== 'credit-card'}
          className="ml-2"
        >
          {balance >= total ? t('checkout.pay') : t('payment.top_up')}
        </Button>
      </div>

      {/* Top Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-96">
            <h2 className="mb-4">{t('payment.top_up_title')}</h2>

            <InputField
              label={t('payment.card_number')}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              error={errors.cardNumber}
              placeholder="4111 1111 1111 1111"
              inputClassName="monospace"
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField
                label={t('payment.expiry')}
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                error={errors.expiry}
                placeholder="MM/YY"
                maxLength={5}
              />

              <InputField
                label={t('payment.cvv')}
                value={cvv}
                onChange={e => setCVV(e.target.value)}
                error={errors.cvv}
                placeholder="123"
                type="password"
                maxLength={3}
              />
            </div>

            <InputField
              label={t('payment.cardholder_name')}
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value)}
              error={errors.cardholderName}
              placeholder={t('payment.cardholder_placeholder')}
              className="mt-4"
            />

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setIsTopUpModalOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleTopUp}
                className="ml-2"
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
