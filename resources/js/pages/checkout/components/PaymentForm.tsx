import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';
import { CheckoutFormData, PaymentMethod, User, CartSummary } from '../../../types';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaymentFormProps {
  onBack: () => void;
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  paymentMethods: PaymentMethod[];
  cartSummary: CartSummary;
  auth?: {
    user?: User | null;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onBack,
  formData,
  setFormData,
  paymentMethods,
  cartSummary,
  auth
}) => {
  const [paymentMethod, setPaymentMethod] = useState(formData?.payment?.method || 'card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use dynamic payment methods if provided, otherwise fallback to default ones
  const availablePaymentMethods = paymentMethods?.length > 0 ? paymentMethods : [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'apple_pay', name: 'Apple Pay' }
  ];

  const getPaymentIcon = (methodId: string) => {
    switch(methodId) {
      case 'card': return 'CreditCard';
      case 'paypal': return 'Wallet';
      case 'apple_pay': return 'Smartphone';
      default: return 'CreditCard';
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId);
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev?.payment,
        method: methodId
      }
    }));
  };

  const initializePayment = async () => {
    if (!auth?.user?.email) {
      toast.error('User email is required for payment');
      return;
    }

    if (!cartSummary?.total) {
      toast.error('Invalid cart total');
      return;
    }

    // Validate required shipping information
    if (!formData?.shipping?.fullName || !formData?.shipping?.address || !formData?.shipping?.city) {
      toast.error('Please complete shipping information before payment');
      return;
    }

    setIsProcessing(true);

    try {
      // Get CSRF token
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Transform form data to match backend expectations
      const orderData = {
        shipping: {
          full_name: formData?.shipping?.fullName || auth?.user?.name || '',
          address_line_1: formData?.shipping?.address || '',
          address_line_2: '',
          city: formData?.shipping?.city || '',
          state: formData?.shipping?.state || '',
          postal_code: formData?.shipping?.zipCode || '',
          phone: formData?.shipping?.phone || '',
          country: formData?.shipping?.country || 'NG'
        },
        delivery: {
          name: formData?.delivery?.name || 'Standard Shipping',
          price: formData?.delivery?.price || 0,
          option: formData?.delivery?.option || 'standard'
        },
        billing: formData?.shipping,
        payment: {
          method: paymentMethod
        }
      };
      
      const response = await fetch('/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
        },
        body: JSON.stringify({
          order_data: orderData,
          amount: cartSummary.total * 100,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        if (data.data.authorization_url) {
          sessionStorage.removeItem('fromCart');
          
          // Show loading message
          toast.success('Redirecting to Paystack payment page...');
          
          // Redirect to Paystack's hosted checkout
          window.location.href = data.data.authorization_url;
        } else {
          throw new Error('No authorization URL received from Paystack');
        }
      } else {
        // Log the response for debugging
        console.error('Payment initialization failed:', { response: response.status, data });
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  const handleInitiatePayment = () => {
    if (paymentMethod === 'card') {
      initializePayment();
    } else {
      toast.error('Payment method not yet supported');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Payment Information</h2>
        <p className="text-muted-foreground mb-6">Complete your payment to finalize the order</p>
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
              onClick={() => handleMethodSelect(method.id)}
            >
              <Icon name={getPaymentIcon(method.id)} size={24} className="mx-auto mb-2" />
              <div className="font-medium text-foreground">{method.name}</div>
            </div>
          ))}
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-medium text-foreground mb-4">Card Payment via Paystack</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Icon name="Shield" size={20} className="text-success" />
              <div className="text-sm">
                <span className="text-muted-foreground">You'll be redirected to Paystack's secure payment page</span>
                {auth?.user?.email && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Payment email: {auth.user.email}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount:</span>
                <span className="text-lg font-semibold text-foreground">₦{cartSummary?.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium mb-1">Payment Process:</p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Click "Pay with Paystack" to continue</li>
                    <li>• You'll be redirected to checkout.paystack.com</li>
                    <li>• Complete your payment securely on Paystack</li>
                    <li>• You'll be redirected back after payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="p-6 border border-border rounded-lg text-center">
          <Icon name="Wallet" size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="font-medium text-foreground mb-2">PayPal Payment</h3>
          <p className="text-muted-foreground mb-4">
            Coming Soon...
          </p>
        </div>
      )}

      {paymentMethod === 'apple_pay' && (
        <div className="p-6 border border-border rounded-lg text-center">
          <Icon name="Smartphone" size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="font-medium text-foreground mb-2">Apple Pay</h3>
          <p className="text-muted-foreground mb-4">
            Coming Soon...
          </p>
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
          Back to Review
        </Button>
        <Button 
          onClick={handleInitiatePayment}
          loading={isProcessing}
          disabled={isProcessing || paymentMethod !== 'card'}
        >
          {isProcessing ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
