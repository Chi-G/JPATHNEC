import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import { Product } from '../../../types';
import formatPrice from '../../../lib/formatPrice';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        // Show toast notification
        toast.success(data.message);
        // Remove the redundant call to onWishlistToggle that was causing double toggle
      } else {
        // Handle error
        toast.error(data.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('An error occurred while updating wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={14} className="text-amber-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="Star" size={14} className="text-amber-400 fill-current opacity-50" />
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
    <Link
      href={`/products/${product.id}`}
      className="group block bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-elevation-md hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded">
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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full shadow-sm transition-all duration-200 hover:bg-opacity-100 hover:scale-110"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
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
        {isHovered && (
          <div className="absolute bottom-2 left-2 right-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">{renderStars(product.rating || 0)}</div>
          <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > (product.price || 0) && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Available Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-muted-foreground mr-1">Colors:</span>
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Available Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Sizes:</span>
            <span className="text-xs text-foreground">{product.sizes.join(', ')}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
