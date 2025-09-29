import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from './ProductCard';
import Button from '../../../components/ui/button';
import { Product } from '../../../types';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  onAddToWishlist: (productId: string | number, isWishlisted: boolean) => void;
  onAddToCart: (productId: string | number) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title, products, viewAllLink, onAddToWishlist, onAddToCart }) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">
              Discover our curated selection of premium products
            </p>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button variant="outline" iconName="ArrowRight" iconPosition="right">
                View All
              </Button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              onAddToWishlist={onAddToWishlist}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        {viewAllLink && (
          <div className="mt-8 text-center lg:hidden">
            <Link href={viewAllLink}>
              <Button variant="outline" size="lg" iconName="ArrowRight" iconPosition="right">
                View All {title}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
