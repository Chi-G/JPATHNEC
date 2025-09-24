import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../components/ui/header';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import SavedItems from './components/SavedItems';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  category: string;
}

interface SavedItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string;
  image: string;
  category: string;
}

// Mock cart data (moved outside component to prevent recreation on every render)
const mockCartItems = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt - Classic Fit",
    price: 29.99,
    originalPrice: 39.99,
    quantity: 2,
    size: "L",
    color: "Navy Blue",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Men's T-Shirts"
  },
  {
    id: 2,
    name: "Professional Polo Shirt - Business Casual",
    price: 49.99,
    quantity: 1,
    size: "M",
    color: "White",
    image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?w=400&h=400&fit=crop",
    category: "Men's Polos"
  },
  {
    id: 3,
    name: "Athletic Running Sneakers - Performance Series",
    price: 89.99,
    originalPrice: 119.99,
    quantity: 1,
    size: "10",
    color: "Black/White",
    image: "https://images.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg?w=400&h=400&fit=crop",
    category: "Men's Shoes"
  }
];

const mockSavedItems = [
  {
    id: 4,
    name: "Women's Casual Shirt - Relaxed Fit",
    price: 39.99,
    size: "S",
    color: "Light Blue",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    category: "Women's Shirts"
  },
  {
    id: 5,
    name: "Comfortable Sandals - Summer Collection",
    price: 34.99,
    originalPrice: 49.99,
    size: "8",
    color: "Brown",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=400&h=400&fit=crop",
    category: "Women's Sandals"
  }
];

// Valid promo codes
// const validPromoCodes = {
//   'SAVE10': { discount: 10, type: 'percentage', description: '10% off your order' },
//   'WELCOME20': { discount: 20, type: 'percentage', description: '20% off for new customers' },
//   'FREESHIP': { discount: 9.99, type: 'fixed', description: 'Free shipping' },
//   'SUMMER25': { discount: 25, type: 'percentage', description: '25% summer discount' }
// };

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>(undefined);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showSavedItems, setShowSavedItems] = useState(false);

  useEffect(() => {
    // Simulate loading cart data
    const loadCartData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCartItems(mockCartItems);
      setSavedItems(mockSavedItems);
      setIsLoading(false);
    };

    loadCartData();
  }, []); // Now this is safe because mockCartItems and mockSavedItems are outside the component

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping - promoDiscount;
  const itemCount = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems?.map(item =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = async (itemId: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCartItems(prevItems => prevItems?.filter(item => item?.id !== itemId));
  };

  const handleMoveToWishlist = async (itemId: number) => {
    const itemToMove = cartItems?.find(item => item?.id === itemId);
    if (itemToMove) {
      // Remove from cart and add to saved items
      setCartItems(prevItems => prevItems?.filter(item => item?.id !== itemId));
      setSavedItems(prevItems => [...prevItems, { ...itemToMove, quantity: 1 }]);
    }
  };

  const handleMoveToCart = async (itemId: number) => {
    const itemToMove = savedItems?.find(item => item?.id === itemId);
    if (itemToMove) {
      // Remove from saved and add to cart
      setSavedItems(prevItems => prevItems?.filter(item => item?.id !== itemId));
      setCartItems(prevItems => [...prevItems, { ...itemToMove, quantity: 1 }]);
    }
  };

  const handleRemoveFromSaved = (itemId: number) => {
    setSavedItems(prevItems => prevItems?.filter(item => item?.id !== itemId));
  };

  const handleApplyPromoCode = async (code: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const promoInfo = validPromoCodes?.[code?.toUpperCase() as keyof typeof validPromoCodes];
    if (promoInfo) {
      setAppliedPromoCode(code?.toUpperCase());

      if (promoInfo?.type === 'percentage') {
        setPromoDiscount(subtotal * (promoInfo?.discount / 100));
      } else {
        setPromoDiscount(promoInfo?.discount);
      }

      return { success: true };
    } else {
      return { success: false, error: 'Invalid promo code' };
    }
  };
  const validPromoCodes = {
    'SAVE10': { discount: 10, type: 'percentage', description: '10% off your order' },
    'WELCOME20': { discount: 20, type: 'percentage', description: '20% off for new customers' },
    'FREESHIP': { discount: 9.99, type: 'fixed', description: 'Free shipping' },
    'SUMMER25': { discount: 25, type: 'percentage', description: '25% summer discount' }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/home" className="hover:text-primary transition-hover">Home</Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-foreground">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            {cartItems?.length > 0 && (
              <p className="text-muted-foreground mt-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {cartItems?.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSavedItems(!showSavedItems)}
                className="flex items-center gap-2"
              >
                <Icon name="Heart" size={16} />
                Saved Items ({savedItems?.length})
              </Button>
            </div>
          )}
        </div>

        {cartItems?.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems?.map((item) => (
                  <CartItem
                    key={item?.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Saved Items Section */}
              {showSavedItems && savedItems?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                  <SavedItems
                    savedItems={savedItems}
                    onMoveToCart={handleMoveToCart}
                    onRemoveFromSaved={handleRemoveFromSaved}
                  />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                total={total}
                itemCount={itemCount}
                onApplyPromoCode={handleApplyPromoCode}
                appliedPromoCode={appliedPromoCode}
                promoDiscount={promoDiscount}
              />
            </div>
          </div>
        )}

        {/* Trust Signals */}
        {cartItems?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Secure Checkout</h4>
                <p className="text-sm text-muted-foreground">SSL encrypted payment</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Truck" size={24} className="text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="RotateCcw" size={24} className="text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Easy Returns</h4>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Headphones" size={24} className="text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">Customer service</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
