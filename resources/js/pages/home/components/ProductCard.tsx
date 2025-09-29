import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';
import { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string | number, isWishlisted: boolean) => void;
  onAddToCart?: (productId: string | number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToWishlist, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product?.id, !isWishlisted);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsAddingToCart(true);

    try {
      await onAddToCart?.(product?.id);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  }; 

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-elevation-sm hover:shadow-elevation-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product?.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product?.isNew && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                New
              </span>
            )}
            {product?.discount && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded">
                -{product?.discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-hover shadow-sm"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Icon
              name="Heart"
              size={16}
              className={`transition-colors ${
                isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Quick Add to Cart - Shows on Hover */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              loading={isAddingToCart}
              size="sm"
              className="w-full"
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product?.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {product?.category}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product?.rating || 0)}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product?.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              ${product?.price}
            </span>
            {product?.originalPrice && product?.originalPrice > (product?.price || 0) && (
              <span className="text-sm text-muted-foreground line-through">
                ${product?.originalPrice}
              </span>
            )}
          </div>

          {/* Available Colors */}
          {product?.colors && product?.colors?.length > 0 && (
            <div className="flex items-center gap-1 mt-3">
              {product?.colors?.slice(0, 4)?.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={`Available in ${color}`}
                />
              ))}
              {product?.colors?.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product?.colors?.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
