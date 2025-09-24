import React, { useState } from 'react';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderReview = ({ onNext, onBack, formData, cartItems }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const deliveryFee = formData?.delivery?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!acceptTerms) return;

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Review Your Order</h2>
        <p className="text-muted-foreground mb-6">Please review all details before placing your order</p>
      </div>
      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Order Items</h3>
        <div className="space-y-3">
          {cartItems?.map((item) => (
            <div key={item?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item?.name}</h4>
                <div className="text-sm text-muted-foreground">
                  Size: {item?.size} | Color: {item?.color}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quantity: {item?.quantity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">
                  ${(item?.price * item?.quantity)?.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${item?.price?.toFixed(2)} each
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Shipping Address</h3>
        <div className="p-4 border border-border rounded-lg">
          <div className="font-medium text-foreground">{formData?.shipping?.fullName}</div>
          <div className="text-muted-foreground mt-1">
            {formData?.shipping?.address}<br />
            {formData?.shipping?.city}, {formData?.shipping?.state} {formData?.shipping?.zipCode}<br />
            {formData?.shipping?.phone}
          </div>
        </div>
      </div>
      {/* Delivery Method */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Delivery Method</h3>
        <div className="p-4 border border-border rounded-lg">
          <div className="font-medium text-foreground">{formData?.delivery?.name}</div>
          <div className="text-muted-foreground mt-1">
            Estimated delivery: {formData?.delivery?.estimatedDate}
          </div>
        </div>
      </div>
      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Payment Method</h3>
        <div className="p-4 border border-border rounded-lg">
          {formData?.payment?.method === 'card' ? (
            <div>
              <div className="font-medium text-foreground">Credit Card</div>
              <div className="text-muted-foreground mt-1">
                **** **** **** {formData?.payment?.cardNumber?.slice(-4)}
              </div>
            </div>
          ) : (
            <div className="font-medium text-foreground capitalize">
              {formData?.payment?.method}
            </div>
          )}
        </div>
      </div>
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Order Summary</h3>
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">${subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
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
      </div>
      {/* Terms and Conditions */}
      <div className="space-y-4">
        <Checkbox
          label={`I agree to the Terms & Conditions and Privacy Policy`}
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e?.target?.checked)}
          required
        />
      </div>
      {/* Security Notice */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Secure Checkout</h4>
            <p className="text-sm text-muted-foreground">
              Your order is protected by SSL encryption. All personal and payment information is secure.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
        >
          Back to Payment
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={!acceptTerms || isProcessing}
          loading={isProcessing}
          className="min-w-32"
        >
          {isProcessing ? 'Processing...' : `Place Order - $${total?.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;
