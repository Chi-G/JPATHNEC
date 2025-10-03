import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderSummary = ({ cartItems, cartSummary, formData, promoCode, setPromoCode, applyPromo }) => {
  const subtotal = cartSummary?.subtotal || 0;
  const deliveryFee = formData?.delivery?.price || cartSummary?.shipping || 0;
  const discount = promoCode === 'SAVE10' ? subtotal * 0.1 : 0;
  const tax = cartSummary?.tax || 0;
  const total = subtotal + deliveryFee - discount + tax;

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
      {/* Items */}
      <div className="space-y-3 mb-6">
        {cartItems?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item?.product?.image}
                  alt={item?.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item?.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm truncate">{item?.product?.name}</div>
              <div className="text-xs text-muted-foreground">
                {item?.size && `${item.size}`}{item?.size && item?.color && ' | '}{item?.color && `${item.color}`}
              </div>
            </div>
            <div className="text-sm font-medium text-foreground">
              ${item?.total_price?.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e?.target?.value)}
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={applyPromo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
        {promoCode === 'SAVE10' && (
          <div className="mt-2 text-sm text-success flex items-center space-x-1">
            <Icon name="Check" size={16} />
            <span>Promo code applied successfully!</span>
          </div>
        )}
      </div>
      {/* Totals */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal?.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount (SAVE10)</span>
            <span className="text-success">-${discount?.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="text-foreground">
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee?.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">${tax?.toFixed(2)}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">${total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Security Badges */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={16} />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={16} />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
