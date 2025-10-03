import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/select-temp';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import Icon from '../../../components/AppIcon';

const PaymentForm = ({ onNext, onBack, formData, setFormData, paymentMethods }) => {
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(formData?.payment?.method || (paymentMethods?.[0]?.id || 'card'));

  // Use dynamic payment methods if provided, otherwise fallback to default ones
  const availablePaymentMethods = paymentMethods?.length > 0 ? paymentMethods : [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'apple_pay', name: 'Apple Pay' }
  ];

  const getPaymentIcon = (methodId) => {
    switch(methodId) {
      case 'card': return 'CreditCard';
      case 'paypal': return 'Wallet';
      case 'apple_pay': return 'Smartphone';
      default: return 'CreditCard';
    }
  };

  const expiryMonths = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1)?.padStart(2, '0'),
    label: String(i + 1)?.padStart(2, '0')
  }));

  const expiryYears = Array.from({ length: 10 }, (_, i) => ({
    value: String(new Date()?.getFullYear() + i),
    label: String(new Date()?.getFullYear() + i)
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev?.payment,
        method: paymentMethod,
        [field]: value
      }
    }));

    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const payment = formData?.payment;

    if (paymentMethod === 'card') {
      if (!payment?.cardNumber?.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (payment?.cardNumber?.replace(/\s/g, '')?.length < 13) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!payment?.cardName?.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!payment?.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!payment?.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!payment?.cvv?.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (payment?.cvv?.length < 3) {
        newErrors.cvv = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Payment Information</h2>
        <p className="text-muted-foreground mb-6">Choose your payment method</p>
      </div>
      <div className="space-y-4">
        <div className={`grid grid-cols-1 ${availablePaymentMethods.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          {availablePaymentMethods.map((method) => (
            <div
              key={method.id}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all duration-200 text-center
                ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              `}
              onClick={() => setPaymentMethod(method.id)}
            >
              <Icon name={getPaymentIcon(method.id)} size={24} className="mx-auto mb-2" />
              <div className="font-medium text-foreground">{method.name}</div>
            </div>
          ))}
        </div>
      </div>
      {paymentMethod === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData?.payment?.cardNumber || ''}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e?.target?.value))}
            error={errors?.cardNumber}
            maxLength={19}
            required
          />

          <Input
            label="Cardholder Name"
            type="text"
            placeholder="Name as it appears on card"
            value={formData?.payment?.cardName || ''}
            onChange={(e) => handleInputChange('cardName', e?.target?.value)}
            error={errors?.cardName}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Month"
              placeholder="MM"
              options={expiryMonths}
              value={formData?.payment?.expiryMonth || ''}
              onChange={(value) => handleInputChange('expiryMonth', value)}
              error={errors?.expiryMonth}
              required
            />

            <Select
              label="Year"
              placeholder="YYYY"
              options={expiryYears}
              value={formData?.payment?.expiryYear || ''}
              onChange={(value) => handleInputChange('expiryYear', value)}
              error={errors?.expiryYear}
              required
            />

            <Input
              label="CVV"
              type="text"
              placeholder="123"
              value={formData?.payment?.cvv || ''}
              onChange={(e) => handleInputChange('cvv', e?.target?.value?.replace(/\D/g, ''))}
              error={errors?.cvv}
              maxLength={4}
              required
            />
          </div>

          <Checkbox
            label="Save this card for future purchases"
            checked={formData?.payment?.saveCard || false}
            onChange={(e) => handleInputChange('saveCard', e?.target?.checked)}
          />
        </form>
      )}
      {paymentMethod === 'paypal' && (
        <div className="p-6 border border-border rounded-lg text-center">
          <Icon name="Wallet" size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="font-medium text-foreground mb-2">PayPal Payment</h3>
          <p className="text-muted-foreground mb-4">
            You will be redirected to PayPal to complete your payment securely.
          </p>
          <Button variant="outline" className="w-full">
            Continue with PayPal
          </Button>
        </div>
      )}
      {paymentMethod === 'apple_pay' && (
        <div className="p-6 border border-border rounded-lg text-center">
          <Icon name="Smartphone" size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="font-medium text-foreground mb-2">Apple Pay</h3>
          <p className="text-muted-foreground mb-4">
            Use Touch ID or Face ID to pay with Apple Pay.
          </p>
          <Button variant="outline" className="w-full">
            Pay with Apple Pay
          </Button>
        </div>
      )}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back to Delivery
        </Button>
        <Button
          onClick={paymentMethod === 'card' ? handleSubmit : onNext}
          disabled={paymentMethod === 'card' && !validateForm()}
        >
          Review Order
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
