import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Header from '../../components/ui/header';
import CheckoutProgress from './components/CheckoutProgress';
import ShippingForm from './components/ShippingForm';
import DeliveryOptions from './components/DeliveryOptions';
import PaymentForm from './components/PaymentForm';
import OrderReview from './components/OrderReview';
import OrderSummary from './components/OrderSummary';
import Icon from '../../components/AppIcon';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  in_stock: boolean;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  unit_price: number;
  total_price: number;
}

interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  item_count: number;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface CheckoutProps {
  auth?: {
    user?: User | null;
  };
  cartCount: number;
  cartItems: CartItem[];
  cartSummary: CartSummary;
  shippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
}

const Checkout: React.FC<CheckoutProps> = ({
  auth,
  cartCount,
  cartItems,
  cartSummary,
  shippingOptions,
  paymentMethods
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [formData, setFormData] = useState({
    shipping: {
      country: 'NG' // Set default country
    },
    delivery: {},
    payment: {}
  });

  const steps = [
    { id: 'shipping', title: 'Shipping' },
    { id: 'delivery', title: 'Delivery' },
    { id: 'payment', title: 'Payment' },
    { id: 'review', title: 'Review' }
  ];

  useEffect(() => {
    // Check if user came from cart, otherwise redirect
    const fromCart = sessionStorage.getItem('fromCart');
    if (!fromCart) {
      router.visit('/shopping-cart');
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Order completed, redirect to success page or home
      sessionStorage.removeItem('fromCart');
      router.visit('/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.visit('/shopping-cart');
    }
  };

  const applyPromo = () => {
    // Mock promo code validation
    if (promoCode?.toUpperCase() === 'SAVE10') {
      // Promo applied successfully
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ShippingForm
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 1:
        return (
          <DeliveryOptions
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
            shippingOptions={shippingOptions}
          />
        );
      case 2:
        return (
          <PaymentForm
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
            paymentMethods={paymentMethods}
          />
        );
      case 3:
        return (
          <OrderReview
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            cartItems={cartItems}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={auth?.user} cartCount={cartCount} />

      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <button
            type="button"
            onClick={() => router.visit('/home')}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <Icon name="ChevronRight" size={16} />
          <button
            type="button"
            onClick={() => router.visit('/shopping-cart')}
            className="hover:text-primary transition-colors"
          >
            Cart
          </button>
          <Icon name="ChevronRight" size={16} />
          <span className="text-foreground">Checkout</span>
        </div>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep={currentStep} steps={steps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              {renderStepContent()}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              cartSummary={cartSummary}
              formData={formData}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              applyPromo={applyPromo}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Truck" size={24} className="text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Free standard delivery on orders over ₦25,000
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="RotateCcw" size={24} className="text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">
                30-day return policy on all items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
