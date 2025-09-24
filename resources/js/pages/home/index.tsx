import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Header from '../../components/ui/header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryShowcase from './components/CategoryShowcase';
import NewsletterSection from './components/NewsletterSection';
import TrustSignals from './components/TrustSignals';
import { buildProductListUrl } from '../../utils/routes';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  discount?: number;
  colors: string[];
  isWishlisted: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  product_count: number;
}

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  link: string;
  badge?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface HomeProps {
  featured_products?: {
    new_arrivals?: Product[];
    best_sellers?: Product[];
    trending?: Product[];
  };
  categories?: Category[];
  hero_slides?: HeroSlide[];
  auth?: {
    user?: User | null;
  };
  cartCount?: number;
}

const Home: React.FC<HomeProps> = ({ featured_products, categories: _categories, hero_slides: _heroSlides, auth, cartCount = 0 }) => {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  // Use data from Laravel controller or fallback to mock data for development
  const newArrivals = featured_products?.new_arrivals || [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      category: "Men\\'s Clothing",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.5,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      isNew: true,
      discount: 25,
      colors: ["#000000", "#FFFFFF", "#1E3A8A", "#10B981"],
      isWishlisted: false
    },
    {
      id: 2,
      name: "Professional Polo Shirt",
      category: "Women\\'s Clothing",
      price: 34.99,
      rating: 4.8,
      reviewCount: 89,
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400&h=400&fit=crop",
      isNew: true,
      colors: ["#DC2626", "#1E3A8A", "#FFFFFF"],
      isWishlisted: false
    },
    {
      id: 3,
      name: "Classic Running Sneakers",
      category: "Men\\'s Footwear",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.6,
      reviewCount: 256,
      image: "https://images.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg?w=400&h=400&fit=crop",
      discount: 25,
      colors: ["#000000", "#FFFFFF", "#1E3A8A"],
      isWishlisted: false
    },
    {
      id: 4,
      name: "Elegant Sandals",
      category: "Women\\'s Footwear",
      price: 59.99,
      rating: 4.4,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
      colors: ["#8B4513", "#000000", "#D2691E"],
      isWishlisted: false
    }
  ];

  const bestSellers = featured_products?.best_sellers || [
    {
      id: 5,
      name: "Corporate Dress Shirt",
      category: "Men\\'s Corporate",
      price: 49.99,
      rating: 4.9,
      reviewCount: 342,
      image: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?w=400&h=400&fit=crop",
      colors: ["#FFFFFF", "#87CEEB", "#FFB6C1"],
      isWishlisted: false
    },
    {
      id: 6,
      name: "Comfortable Trousers",
      category: "Women\\'s Clothing",
      price: 44.99,
      originalPrice: 54.99,
      rating: 4.7,
      reviewCount: 198,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      discount: 18,
      colors: ["#000000", "#8B4513", "#1E3A8A"],
      isWishlisted: false
    },
    {
      id: 7,
      name: "Athletic Shoes",
      category: "Men\\'s Footwear",
      price: 79.99,
      rating: 4.5,
      reviewCount: 156,
      image: "https://images.pixabay.com/photo/2020/08/24/21/40/sneakers-5513198_1280.jpg?w=400&h=400&fit=crop",
      colors: ["#000000", "#FFFFFF", "#DC2626"],
      isWishlisted: false
    },
    {
      id: 8,
      name: "Casual Slippers",
      category: "Women\\'s Footwear",
      price: 24.99,
      rating: 4.3,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      colors: ["#FFB6C1", "#87CEEB", "#000000"],
      isWishlisted: false
    }
  ];

  const trendingNow = featured_products?.trending || [
    {
      id: 9,
      name: "Designer Pants",
      category: "Men\\'s Clothing",
      price: 69.99,
      originalPrice: 89.99,
      rating: 4.6,
      reviewCount: 234,
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=400&h=400&fit=crop",
      discount: 22,
      colors: ["#000000", "#8B4513", "#1E3A8A"],
      isWishlisted: false
    },
    {
      id: 10,
      name: "Stylish Corporate Shirt",
      category: "Women\\'s Corporate",
      price: 39.99,
      rating: 4.8,
      reviewCount: 167,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
      isNew: true,
      colors: ["#FFFFFF", "#87CEEB", "#FFB6C1"],
      isWishlisted: false
    },
    {
      id: 11,
      name: "Premium Sneakers",
      category: "Men\\'s Footwear",
      price: 129.99,
      rating: 4.9,
      reviewCount: 445,
      image: "https://images.pixabay.com/photo/2016/03/27/22/16/fashion-1284496_1280.jpg?w=400&h=400&fit=crop",
      colors: ["#FFFFFF", "#000000", "#1E3A8A"],
      isWishlisted: false
    },
    {
      id: 12,
      name: "Comfortable Sandals",
      category: "Women\\'s Footwear",
      price: 49.99,
      rating: 4.4,
      reviewCount: 123,
      image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&h=400&fit=crop",
      colors: ["#8B4513", "#000000", "#D2691E"],
      isWishlisted: false
    }
  ];

  const handleAddToWishlist = (product: { id: string | number }) => {
    const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
    const isCurrentlyWishlisted = wishlistItems.includes(productId);

    if (isCurrentlyWishlisted) {
      setWishlistItems(prev => prev.filter(id => id !== productId));
    } else {
      setWishlistItems(prev => [...prev, productId]);
    }
  };

  const handleAddToCart = (product: { id: string | number }) => {
    const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
    setCartItems(prev => [...prev, productId]);
  };

  useEffect(() => {
    // Load wishlist and cart from localStorage on component mount
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');

    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <>
      <Header user={auth?.user} cartCount={cartCount} />
      <Head title="JPATHNEC - Premium Men's & Women's Apparel and Footwear">
        <meta
          name="description"
          content="Discover premium quality men's and women's clothing and footwear at JPATHNEC. Shop t-shirts, polos, corporate shirts, trousers, shoes, sneakers, and more with free shipping on orders over $75."
        />
        <meta name="keywords" content="men's clothing, women's clothing, footwear, t-shirts, polos, corporate shirts, sneakers, sandals, fashion, apparel" />
        <meta property="og:title" content="JPATHNEC - Premium Fashion & Footwear" />
        <meta property="og:description" content="Shop premium quality apparel and footwear for men and women. New arrivals, best sellers, and trending styles." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/home" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection />

        {/* New Arrivals */}
        <FeaturedProducts
          title="New Arrivals"
          products={newArrivals}
          viewAllLink={buildProductListUrl({ filter: 'new' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* Category Showcase */}
        <CategoryShowcase />

        {/* Best Sellers */}
        <FeaturedProducts
          title="Best Sellers"
          products={bestSellers}
          viewAllLink={buildProductListUrl({ filter: 'bestsellers' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* Trending Now */}
        <FeaturedProducts
          title="Trending Now"
          products={trendingNow}
          viewAllLink={buildProductListUrl({ filter: 'trending' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* Trust Signals */}
        <TrustSignals />

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </>
  );
};

export default Home;
