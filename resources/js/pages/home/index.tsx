import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Header from '../../components/ui/header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryShowcase from './components/CategoryShowcase';
import NewsletterSection from './components/NewsletterSection';
import TrustSignals from './components/TrustSignals';
import { buildProductListUrl } from '../../utils/routes';
import { Product, Category, User } from '../../../js/types';

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
}

const Home: React.FC<HomeProps> = ({ featured_products, hero_slides, categories, auth, cartCount }) => {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const { new_arrivals, best_sellers, trending } = featured_products;

  const handleAddToWishlist = (productId: string | number, isWishlisted: boolean) => {
    const id = typeof productId === 'string' ? parseInt(productId) : productId;
    setWishlistItems((prev) =>
      isWishlisted ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  const handleAddToCart = (productId: string | number) => {
    const id = typeof productId === 'string' ? parseInt(productId) : productId;
    setCartItems((prev) => [...prev, id]);
  };

  useEffect(() => {
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
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
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
        <HeroSection heroSlides={hero_slides} />
        <FeaturedProducts
          title="New Arrivals"
          products={new_arrivals}
          viewAllLink={buildProductListUrl({ filter: 'new' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />
        <CategoryShowcase categories={categories} />
        <FeaturedProducts
          title="Best Sellers"
          products={best_sellers}
          viewAllLink={buildProductListUrl({ filter: 'bestsellers' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />
        <FeaturedProducts
          title="Trending Now"
          products={trending}
          viewAllLink={buildProductListUrl({ filter: 'trending' })}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />
        <TrustSignals />
        <NewsletterSection />
      </div>
    </>
  );
};

export default Home;
