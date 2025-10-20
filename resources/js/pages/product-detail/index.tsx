import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Header from '../../components/ui/header';
import Icon from '../../components/AppIcon';
import ImageCarousel from './components/ImageCarousel';
import ProductInfo from './components/ProductInfo';
import ProductDetails from './components/ProductDetails';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  category_slug: string;
  rating: number;
  review_count: number;
  description: string;
  short_description?: string;
  images: Array<{ url: string; alt: string; is_primary: boolean }>;
  sizes?: string[];
  colors?: string[];
  in_stock: boolean;
  stock_quantity?: number;
  features?: string[];
  care_instructions?: string[];
  brand?: string;
  material?: string;
  fit?: string;
  sku: string;
  slug: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
}

interface CartItem {
  productId: number;
  size: string;
  color: string;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface ProductDetailProps {
  product?: Product | null;
  related_products?: RelatedProduct[];
  reviews?: Review[];
  user?: User | null;
  cartCount?: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product: initialProduct,
  related_products = [],
  reviews: initialReviews = [],
  user,
  cartCount = 0
}) => {
    // Log props for debugging
    console.log('ProductDetail props:', { initialProduct, related_products, reviews: initialReviews, user, cartCount });

  // Convert Laravel product data to component expected format
  const adaptProduct = (product: Product | null) => {
    if (!product) {
      console.warn('No product data received');
      return null;
    }

    try {
        return {
        ...product,
        reviewCount: product.review_count,
        originalPrice: product.original_price,
        stock: product.stock_quantity || 0,
        sizes: [...new Set(product.sizes || [])], // Remove duplicates
        colors: [...new Set(product.colors || [])].map((color: string) => ({
            name: color,
            hex: getColorHex(color),
            available: true
        })),
        sizeAvailability: product.sizes?.reduce((acc: Record<string, boolean>, size: string) => {
            acc[size] = true; // Assume all sizes available for now
            return acc;
        }, {}) || {},
        images: product.images?.map(img => img.url) || [],
            };
        } catch (error) {
            console.error('Error adapting product data:', error);
            return null;
        }
    };

  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'Black': '#000000',
      'White': '#ffffff',
      'Blue': '#0066cc',
      'Navy': '#1e3a8a',
      'Red': '#dc2626',
      'Green': '#16a34a',
      'Gray': '#6b7280',
      'Grey': '#6b7280',
      'Brown': '#92400e',
      'Beige': '#f5f5dc',
    };
    return colorMap[colorName] || '#6b7280';
  };

  const [product] = useState(adaptProduct(initialProduct || null));
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading] = useState(false);

  // Return early if no product data
  if (!initialProduct) {
    console.warn('Rendering Product Not Found due to missing initialProduct');
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} cartCount={cartCount} />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/product-list" className="text-primary hover:underline">
              Browse All Products
            </Link>

          </div>
        </div>
      </div>
    );
  }



  const handleAddToCart = async (cartItem: CartItem) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      // Get CSRF token from meta tag
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
        },
        body: JSON.stringify({
          product_id: cartItem.productId,
          quantity: cartItem.quantity,
          size: cartItem.size || null,
          color: cartItem.color || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        toast.success(data.message || 'Item added to cart successfully!');

        // Optional: Update cart count in header if you have state management
        if (process.env.NODE_ENV === 'development') {
          console.log('Added to cart successfully:', cartItem);
        }
      } else {
        // Handle errors (like item already in cart)
        if (response.status === 409) {
          toast.error(data.message || 'This item is already in your cart.');
        } else {
          toast.error(data.message || 'Failed to add item to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred while adding to cart.');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product?.id) return;
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      return;
    }

    try {
      // Get CSRF token from meta tag
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          const productIdStr = product.id.toString();
          if (data.in_wishlist) {
            newWishlist.add(productIdStr);
          } else {
            newWishlist.delete(productIdStr);
          }
          return newWishlist;
        });
      } else {
        toast.error(data.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('An error occurred while updating wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} cartCount={cartCount} />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} cartCount={cartCount} />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/product-list" className="text-primary hover:underline">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} cartCount={cartCount} />
      <main className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/home" className="hover:text-foreground transition-hover">Home</Link>
          <Icon name="ChevronRight" size={16} />
          <Link href="/product-list" className="hover:text-foreground transition-hover">Products</Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-foreground">{product?.name}</span>
        </nav>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ImageCarousel
            images={product?.images || []}
            productName={product?.name}
          />
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={product?.id ? wishlist?.has(product.id.toString()) : false}
          />
        </div>

        {/* Product Details */}
        <div className="mb-3">
          <ProductDetails product={product} />
        </div>

        {/* Customer Reviews */}

        {/* Related Products */}
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date()?.getFullYear()} JPATHNEC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
