import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Icon from '../../../components/AppIcon';

interface PromoResult {
  success: boolean;
  error?: string;
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
  shipping,
  total,
  itemCount,
  onApplyPromoCode,
  appliedPromoCode,
  promoDiscount
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculate service charge
  const serviceCharge = tax / 4;

  // Compute total (frontend calculation includes serviceCharge)
  const computedTotal =
    subtotal +
    tax +
    serviceCharge +
    (shipping || 0) -
    (promoDiscount || 0);

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

  const handleProceedToCheckout = () => {
    sessionStorage.setItem('fromCart', 'true');
    router.visit('/checkout');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-foreground font-medium">
            ₦{subtotal.toLocaleString()}
          </span>
        </div>

        {appliedPromoCode && promoDiscount && promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">
              Promo ({appliedPromoCode})
            </span>
            <span className="text-success font-medium">
              -₦{promoDiscount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="text-foreground font-medium">
            ₦{tax.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service Charge</span>
          <span className="text-foreground font-medium">
            ₦{serviceCharge.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground font-medium">
            {shipping === 0
              ? 'FREE'
              : shipping
              ? `₦${shipping.toLocaleString()}`
              : 'Calculating...'}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {(() => {
                if (typeof total === 'number') {
                  const tolerance = 0.5;
                  if (Math.abs(total - computedTotal) > tolerance) {
                    return `₦${computedTotal.toLocaleString()}`;
                  }
                  return `₦${total.toLocaleString()}`;
                }

                return `₦${computedTotal.toLocaleString()}`;
              })()}
            </span>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromoCode(e.target.value.toUpperCase())
              }
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

      {/* Checkout Button */}
      <Button
        variant="default"
        fullWidth
        className="mb-4"
        onClick={handleProceedToCheckout}
      >
        <Icon name="CreditCard" size={18} className="mr-2" />
        Proceed to Checkout
      </Button>

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
