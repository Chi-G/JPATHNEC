import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Header from '../../components/ui/header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryShowcase from './components/CategoryShowcase';
import NewsletterSection from './components/NewsletterSection';
import TrustSignals from './components/TrustSignals';
import { buildProductListUrl } from '../../utils/routes';
import { Product, Category, User } from '../../types';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  link: string;
  badge?: string;
  alt?: string;
}

interface HomeProps {
  featured_products: {
    new_arrivals: Product[];
    best_sellers: Product[];
    trending: Product[];
  };
  categories: Category[];
  hero_slides: HeroSlide[];
  auth?: {
    user?: User | null;
  };
  cartCount: number;
  verified?: boolean;
}

const Home: React.FC<HomeProps> = ({ featured_products, hero_slides, categories, auth, cartCount, verified }) => {
  const { new_arrivals, best_sellers, trending } = featured_products;

  // Show verification success toast
  useEffect(() => {
    if (verified) {
      toast.success('🎉 Email verified successfully! Welcome to JPATHNEC. Happy Shopping.', {
        duration: 5000,
        position: 'top-center',
      });
    }
  }, [verified]);

  const handleAddToCart = async (product: Product) => {
    if (!auth?.user) {
      router.visit('/login');
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
          product_id: product.id,
          quantity: 1,
          size: product.selectedSize || null,
          color: product.selectedColor || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Product added to cart!');
        router.reload({ only: ['cartCount'] }); // Refresh cartCount prop
      } else if (response.status === 409) {
        // 409 Conflict - item already exists
        toast.error(data.message || 'This item is already in your cart.');
      } else {
        toast.error(data.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      toast.error('An error occurred while adding to cart.');
      console.error('Add to cart error:', error);
    }
  };

  return (
    <>
      <Head title="JPATHNEC - Premium Men's & Women's Apparel and Footwear">
        <meta
          name="description"
          content="Discover premium quality men's and women's clothing and footwear at JPATHNEC. Shop t-shirts, polos, corporate shirts, trousers, shoes, sneakers, and more with free shipping on orders over $75."
        />
        <meta
          name="keywords"
          content="men's clothing, women's clothing, footwear, t-shirts, polos, corporate shirts, sneakers, sandals, fashion, apparel"
        />
        <meta property="og:title" content="JPATHNEC - Premium Fashion & Footwear" />
        <meta
          property="og:description"
          content="Shop premium quality apparel and footwear for men and women. New arrivals, best sellers, and trending styles."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/home" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header user={auth?.user} cartCount={cartCount} />
        <HeroSection heroSlides={hero_slides} />
        <FeaturedProducts
          title="New Arrivals"
          products={new_arrivals}
          viewAllLink={buildProductListUrl({ filter: 'new' })}
          onAddToCart={(productId) => {
            const product = new_arrivals.find((p) => p.id === productId);
            if (product) handleAddToCart(product);
          }}
        />
        <CategoryShowcase categories={categories} />
        <FeaturedProducts
          title="Best Sellers"
          products={best_sellers}
          viewAllLink={buildProductListUrl({ filter: 'bestsellers' })}
          onAddToCart={(productId) => {
            const product = best_sellers.find((p) => p.id === productId);
            if (product) handleAddToCart(product);
          }}
        />
        <FeaturedProducts
          title="Trending Now"
          products={trending}
          viewAllLink={buildProductListUrl({ filter: 'trending' })}
          onAddToCart={(productId) => {
            const product = trending.find((p) => p.id === productId);
            if (product) handleAddToCart(product);
          }}
        />
        <TrustSignals />
        <NewsletterSection />
      </div>
    </>
  );
};

export default Home;
