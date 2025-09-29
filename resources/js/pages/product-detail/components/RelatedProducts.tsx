import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
}

interface RelatedProductsProps {
  products: Product[];
  onAddToWishlist: (productId: number) => void;
}

const RelatedProducts = ({ products, onAddToWishlist }: RelatedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 320; // Width of one card plus gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">You Might Also Like</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="w-10 h-10"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="w-10 h-10"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products?.map((product) => (
          <div
            key={product?.id}
            className="flex-shrink-0 w-80 bg-background rounded-lg border border-border overflow-hidden hover:shadow-elevation-md transition-hover group"
          >
            <div className="relative aspect-square overflow-hidden">
              <Link href={`/products?id=${product?.id}`}>
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                type="button"
                onClick={() => onAddToWishlist(product?.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-hover"
                aria-label="Add to wishlist"
                title="Add to wishlist"
              >
                <Icon name="Heart" size={16} className="text-muted-foreground hover:text-error" />
              </button>
              {product?.discount && (
                <div className="absolute top-3 left-3 bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
                  -{product?.discount}%
                </div>
              )}
            </div>

            <div className="p-4">
              <Link href={`/products?id=${product?.id}`}>
                <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-hover line-clamp-2">
                  {product?.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(product?.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">${product?.price}</span>
                  {product?.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product?.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ShoppingCart"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
