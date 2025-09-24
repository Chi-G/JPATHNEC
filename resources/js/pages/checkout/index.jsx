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

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [formData, setFormData] = useState({
    shipping: {},
    delivery: {},
    payment: {}
  });

  const steps = [
    { id: 'shipping', title: 'Shipping' },
    { id: 'delivery', title: 'Delivery' },
    { id: 'payment', title: 'Payment' },
    { id: 'review', title: 'Review' }
  ];

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      size: "M",
      color: "Navy Blue",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Classic Polo Shirt",
      price: 45.99,
      quantity: 1,
      size: "L",
      color: "White",
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Running Sneakers",
      price: 89.99,
      quantity: 1,
      size: "10",
      color: "Black",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    }
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
          />
        );
      case 2:
        return (
          <PaymentForm
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
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
      <Header />

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
                Free standard delivery on orders over $75
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
