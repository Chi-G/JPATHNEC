import React, { useState } from 'react';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { CartItem, CheckoutFormData } from '../../../types';

interface OrderReviewProps {
  onNext: () => void;
  onBack: () => void;
  formData: CheckoutFormData;
  cartItems: CartItem[];
  cartSummary?: {
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    item_count: number;
  };
}

const OrderReview: React.FC<OrderReviewProps> = ({ 
  onNext, 
  onBack, 
  formData, 
  cartItems, 
  cartSummary
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartSummary?.subtotal || cartItems?.reduce((sum, item) => sum + (item?.product?.price * item?.quantity), 0);
  const deliveryFee = cartSummary?.shipping || formData?.delivery?.price || 0;
  const tax = cartSummary?.tax || (subtotal * 0.08); // 8% tax
  const total = cartSummary?.total || (subtotal + deliveryFee + tax);

  const handlePlaceOrder = async () => {
    console.log('Place Order clicked');
    console.log('Accept Terms:', acceptTerms);
    console.log('Is Processing:', isProcessing);
    
    if (!acceptTerms) {
      console.log('Terms not accepted - returning');
      return;
    }

    // For now, just proceed to next step (which will be payment)
    console.log('Proceeding to payment step');
    setIsProcessing(true);
    
    // Small delay for UX
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 500);
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
                  src={item?.product?.image}
                  alt={item?.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item?.product?.name}</h4>
                <div className="text-sm text-muted-foreground">
                  Size: {item?.size} | Color: {item?.color}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quantity: {item?.quantity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">
                  ₦{(item?.product?.price * item?.quantity)?.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₦{item?.product?.price?.toFixed(2)} each
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
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Order Summary</h3>
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₦{subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">
              {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">₦{tax?.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₦{total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(!!checked)}
            required
          />
          <label 
            className="text-sm cursor-pointer flex-1"
            onClick={() => setAcceptTerms(!acceptTerms)}
          >
            I agree to the Terms & Conditions and Privacy Policy
          </label>
        </div>
        
        {/* Alternative method if checkbox fails */}
        <div className="text-xs text-muted-foreground">
          <button 
            type="button"
            onClick={() => setAcceptTerms(!acceptTerms)}
            className="underline hover:text-primary"
          >
            Click here to {acceptTerms ? 'uncheck' : 'check'} terms agreement
          </button>
        </div>
        
        {/* Debug info - remove this in production */}
        <div className="text-xs text-muted-foreground">
          Terms accepted: {acceptTerms ? 'Yes' : 'No'} | Button should be: {!acceptTerms || isProcessing ? 'Disabled' : 'Enabled'}
        </div>
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
          className={`min-w-32 ${!acceptTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
          variant="default"
        >
          {isProcessing ? 'Processing...' : `Continue to Payment`}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;
