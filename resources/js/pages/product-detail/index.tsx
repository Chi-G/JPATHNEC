import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../components/ui/header';
import Icon from '../../components/AppIcon';
import ImageCarousel from './components/ImageCarousel';
import ProductInfo from './components/ProductInfo';
import ProductDetails from './components/ProductDetails';
import RelatedProducts from './components/RelatedProducts';
import CustomerReviews from './components/CustomerReviews';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  images: string[];
  sizes: string[];
  sizeAvailability: Record<string, boolean>;
  colors: Array<{ name: string; hex: string; available?: boolean }>;
  features: string[];
  material: string;
  fit: string;
  origin: string;
  sku: string;
  sizeChart: Array<{ size: string; chest: string; waist: string; length: string }>;
  careInstructions: string[];
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

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId = '1' }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Simulate API call
    const loadProductData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock product data - moved inside useEffect to avoid dependency issues
      const mockProductData = {
        id: parseInt(productId),
        name: "Premium Cotton Polo Shirt",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        rating: 4.6,
        reviewCount: 234,
        stock: 15,
        description: `Experience ultimate comfort and style with our Premium Cotton Polo Shirt. Crafted from 100% organic cotton with a modern slim fit, this versatile piece seamlessly transitions from casual weekends to business casual environments.\n\nFeaturing moisture-wicking technology and reinforced seams for durability, this polo combines classic design with contemporary performance features.`,
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop"
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        sizeAvailability: {
          'XS': true,
          'S': true,
          'M': true,
          'L': true,
          'XL': false,
          'XXL': true
        },
        colors: [
          { name: 'Navy Blue', hex: '#1e3a8a', available: true },
          { name: 'White', hex: '#ffffff', available: true },
          { name: 'Black', hex: '#000000', available: true },
          { name: 'Gray', hex: '#6b7280', available: false },
          { name: 'Burgundy', hex: '#7c2d12', available: true }
        ],
        features: [
          "100% Organic Cotton",
          "Moisture-Wicking Technology",
          "Reinforced Collar & Cuffs",
          "Machine Washable",
          "Wrinkle Resistant",
          "UV Protection",
          "Breathable Fabric",
          "Pre-Shrunk"
        ],
        material: "100% Organic Cotton with moisture-wicking finish",
        fit: "Modern Slim Fit - tailored through the body with a comfortable range of motion",
        origin: "Made in Portugal with sustainable manufacturing practices",
        sku: "POLO-COTTON-001",
        sizeChart: [
          { size: 'XS', chest: '34-36', waist: '28-30', length: '26' },
          { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
          { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
          { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
          { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
          { size: 'XXL', chest: '44-46', waist: '38-40', length: '31' }
        ],
        careInstructions: [
          "Machine wash cold with like colors",
          "Use mild detergent, avoid bleach",
          "Tumble dry low or hang to dry",
          "Iron on medium heat if needed",
          "Do not dry clean",
          "Store on hangers to maintain shape"
        ]
      };

      const mockRelatedProductsData = [
        {
          id: 2,
          name: "Classic Cotton T-Shirt",
          price: 29.99,
          originalPrice: 39.99,
          discount: 25,
          rating: 4.4,
          reviewCount: 156,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
        },
        {
          id: 3,
          name: "Business Casual Shirt",
          price: 79.99,
          rating: 4.7,
          reviewCount: 89,
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop"
        },
        {
          id: 4,
          name: "Casual Chino Pants",
          price: 69.99,
          originalPrice: 89.99,
          discount: 22,
          rating: 4.5,
          reviewCount: 203,
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop"
        },
        {
          id: 5,
          name: "Premium Sneakers",
          price: 129.99,
          rating: 4.8,
          reviewCount: 312,
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
        },
        {
          id: 6,
          name: "Leather Belt",
          price: 49.99,
          originalPrice: 69.99,
          discount: 29,
          rating: 4.6,
          reviewCount: 78,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
        }
      ];

      const mockReviewsData = [
        {
          id: '1',
          author: 'Michael Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          rating: 5,
          title: 'Excellent quality and fit!',
          content: `I've been wearing this polo for about 3 months now and it still looks brand new. The fabric is incredibly soft and breathable, perfect for both office wear and weekend activities. The fit is exactly as described - modern slim without being too tight.`,
          date: '2025-01-15',
          verified: true,
          helpfulCount: 12,
          images: [
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&h=200&fit=crop'
          ]
        },
        {
          id: '2',
          author: 'Sarah Williams',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          rating: 4,
          title: 'Great shirt, runs slightly small',
          content: `Beautiful polo shirt with excellent construction. The organic cotton feels premium and the color is exactly as shown. I would recommend sizing up if you prefer a more relaxed fit. The moisture-wicking feature works well during warmer days.`,
          date: '2025-01-10',
          verified: true,
          helpfulCount: 8
        },
        {
          id: '3',
          author: 'David Chen',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          rating: 5,
          title: 'Perfect for business casual',
          content: `This has become my go-to polo for business casual days. The quality is outstanding and it maintains its shape even after multiple washes. The navy blue color is versatile and pairs well with both khakis and dress pants.`,
          date: '2025-01-05',
          verified: true,
          helpfulCount: 15
        },
        {
          id: '4',
          author: 'Emily Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
          rating: 4,
          title: 'Bought for my husband - he loves it!',
          content: `Purchased this as a gift for my husband and he absolutely loves it. The fabric quality is impressive and it's held up well to regular wear and washing. The only minor issue is that it wrinkles slightly more than expected.`,
          date: '2024-12-28',
          verified: true,
          helpfulCount: 6
        }
      ];

      setProduct(mockProductData);
      setRelatedProducts(mockRelatedProductsData);
      setReviews(mockReviewsData);
      setLoading(false);
    };

    loadProductData();
  }, [productId]);

  const handleAddToCart = async (cartItem: CartItem) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Added to cart:', cartItem);
    // In a real app, this would update the cart state/context
  };

  const handleToggleWishlist = () => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist?.has(productId)) {
        newWishlist?.delete(productId);
      } else {
        newWishlist?.add(productId);
      }
      return newWishlist;
    });
  };

  const handleAddToWishlist = (id: number) => {
    setWishlist(prev => new Set([...prev, id.toString()]));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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
        <Header />
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
      <Header />
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
          <ImageCarousel images={product?.images} productName={product?.name} />
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist?.has(productId)}
          />
        </div>

        {/* Product Details */}
        <div className="mb-12">
          <ProductDetails product={product} />
        </div>

        {/* Customer Reviews */}
        <div className="mb-12">
          <CustomerReviews
            reviews={reviews}
            averageRating={product?.rating}
            totalReviews={product?.reviewCount}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts}
          onAddToWishlist={handleAddToWishlist}
        />
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
