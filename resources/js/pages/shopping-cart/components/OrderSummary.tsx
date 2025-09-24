import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Icon from '../../../components/AppIcon';

interface PromoResult {
  success: boolean;
  error?: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  shipping?: number;
  total?: number;
  itemCount: number;
  onApplyPromoCode: (code: string) => Promise<PromoResult>;
  appliedPromoCode?: string;
  promoDiscount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  tax,
//   shipping,
//   total,
  itemCount,
  onApplyPromoCode,
  appliedPromoCode,
  promoDiscount
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 0,
      duration: '5-7 business days',
      description: 'Free standard shipping on orders over $50'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 9.99,
      duration: '2-3 business days',
      description: 'Faster delivery for urgent orders'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      duration: '1 business day',
      description: 'Next day delivery available'
    }
  ];

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    setPromoError('');

    try {
      const result = await onApplyPromoCode(promoCode.trim());
      if (!result.success) {
        setPromoError(result.error || 'Invalid promo code');
      } else {
        setPromoCode('');
      }
    } catch {
      setPromoError('Failed to apply promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleShippingChange = (shippingId: string) => {
    setSelectedShipping(shippingId);
  };

  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const finalShipping = selectedShippingOption?.price || 0;
  const finalTotal = subtotal - (promoDiscount || 0) + tax + finalShipping;

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {appliedPromoCode && promoDiscount && promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">
              Promo ({appliedPromoCode})
            </span>
            <span className="text-success font-medium">-${promoDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground font-medium">
            {finalShipping === 0 ? 'FREE' : `$${finalShipping.toFixed(2)}`}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Promo Code Section */}
      {!appliedPromoCode && (
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleApplyPromoCode}
              loading={isApplyingPromo}
              disabled={!promoCode.trim()}
            >
              Apply
            </Button>
          </div>
          {promoError && (
            <p className="text-sm text-red-600 mt-2">{promoError}</p>
          )}
        </div>
      )}
      {/* Shipping Options */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Shipping Options</h3>
        <div className="space-y-2">
          {shippingOptions.map((option: ShippingOption) => (
            <label
              key={option.id}
              className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-hover"
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedShipping === option.id}
                onChange={() => handleShippingChange(option.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{option.name}</div>
                    <div className="text-sm text-muted-foreground">{option.duration}</div>
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                  </div>
                  <div className="text-sm font-medium text-foreground ml-2">
                    {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Checkout Button */}
      <Link href="/checkout" className="block">
        <Button variant="default" fullWidth className="mb-4">
          <Icon name="CreditCard" size={18} className="mr-2" />
          Proceed to Checkout
        </Button>
      </Link>
      {/* Continue Shopping */}
      <Link href="/product-list">
        <Button variant="outline" fullWidth>
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Continue Shopping
        </Button>
      </Link>
      {/* Security Badge */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          <span>Secure SSL encrypted checkout</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
