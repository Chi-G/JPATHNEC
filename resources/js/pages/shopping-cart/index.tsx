import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Header from '../../components/ui/header';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import SavedItems from './components/SavedItems';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/button';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image: string;
    in_stock: boolean;
  };
  quantity: number;
  size: string | null;
  color: string | null;
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

interface ShoppingCartProps {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  user?: { id: number; name: string; email: string } | null;
  cartCount?: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, cartSummary, user, cartCount = 0 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>(undefined);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (!user) {
      router.visit('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Cart updated successfully!');
        router.reload({ only: ['cartItems', 'cartSummary', 'cartCount'] });
      } else {
        toast.error(data.message || 'Failed to update cart.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the cart.');
      console.error('Update cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!user) {
      router.visit('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Item removed from cart!');
        router.reload({ only: ['cartItems', 'cartSummary', 'cartCount'] });
      } else {
        toast.error(data.message || 'Failed to remove item.');
      }
    } catch (error) {
      toast.error('An error occurred while removing the item.');
      console.error('Remove item error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToWishlist = async (itemId: number) => {
    // Placeholder: Implement wishlist API
    toast.error('Wishlist functionality not implemented yet.');
  };

  const handleMoveToCart = async (itemId: number) => {
    // Placeholder: Implement wishlist API
    toast.error('Wishlist functionality not implemented yet.');
  };

  const handleRemoveFromSaved = (itemId: number) => {
    // Placeholder: Implement wishlist API
    toast.error('Wishlist functionality not implemented yet.');
  };

  const handleApplyPromoCode = async (code: string) => {
    // Placeholder: Implement promo code API
    toast.error('Promo code functionality not implemented yet.');
    return { success: false, error: 'Promo codes not supported.' };
  };

  if (isLoading && !cartItems.length) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} cartCount={cartCount} />
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
      <Header user={user} cartCount={cartCount} />
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
                {cartSummary.item_count} {cartSummary.item_count === 1 ? 'item' : 'items'} in your cart
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
                subtotal={cartSummary.subtotal}
                tax={cartSummary.tax}
                shipping={cartSummary.shipping}
                total={cartSummary.total}
                itemCount={cartSummary.item_count}
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
