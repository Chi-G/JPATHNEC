import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';
import { Product } from '../../../types';
import formatPrice from '../../../lib/formatPrice';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string | number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted ?? false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get CSRF token from meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    try {
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
        setIsWishlisted(data.in_wishlist);
        toast.success(data.message);
        // Remove the redundant call to onAddToWishlist that was causing double toggle
      } else {
        toast.error(data.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('An error occurred while updating wishlist');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await onAddToCart?.(product.id);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  const renderStars = (rating: number = 0) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="Star" size={14} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-elevation-sm hover:shadow-elevation-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image ?? '/images/placeholder-product.jpg'}
            alt={product.name ?? 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                New
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded">
                -{product.discount}%
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                Bestseller
              </span>
            )}
          </div>
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
        <div className="p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}
          <div className="mb-2">
            <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name ?? 'Untitled Product'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category ?? 'Uncategorized'}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">({product.reviewCount ?? 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > (product.price ?? 0) && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-3">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                  title={`Available in ${color.name}`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 4} more
                </span>
              )}
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground mr-1">Sizes:</span>
              <span className="text-xs text-foreground">{product.sizes.join(', ')}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
