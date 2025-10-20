import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';
import { WhatsAppProductContact } from '../../../components/ui/whatsapp-contact';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import formatPrice from '../../../lib/formatPrice';

interface Color {
  name: string;
  hex: string;
  available?: boolean;
}

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
  sizes: string[];
  colors: Color[];
  features?: string[];
  sizeAvailability?: { [key: string]: boolean };
}

interface CartItem {
  productId: number;
  size: string;
  color: string;
  quantity: number;
}

interface ProductInfoProps {
  product: Product;
  onAddToCart: (item: CartItem) => Promise<void>;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}

const ProductInfo = ({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const sizeOptions = product?.sizes?.map((size, index) => ({
    value: size,
    label: size,
    disabled: !product?.sizeAvailability?.[size],
    key: `${size}-${index}` // Ensure unique keys
  }));

  const colorOptions = product?.colors?.map((color, index) => ({
    value: color?.name,
    label: color?.name,
    disabled: !color?.available,
    key: `${color?.name}-${index}` // Ensure unique keys
  }));

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      return;
    }

    setIsAddingToCart(true);
    await onAddToCart({
      productId: product?.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    setIsAddingToCart(false);
  };

  const canAddToCart = selectedSize && selectedColor && quantity > 0 && product?.stock > 0;

  return (
    <div className="space-y-6">
      {/* Product Title and Price */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{product?.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-2xl font-bold text-primary">{formatPrice(product?.price)}</span>
          {product?.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product?.originalPrice)}
            </span>
          )}
          {product?.discount && (
            <span className="bg-error text-error-foreground px-2 py-1 rounded text-sm font-medium">
              -{product?.discount}%
            </span>
          )}
        </div>
      </div>
      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)]?.map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={16}
              className={i < Math.floor(product?.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            {product?.rating} ({product?.reviewCount} reviews)
          </span>
        </div>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          title="Read customer reviews"
        >
          Read Reviews
        </button>
      </div>
      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <Icon
          name={product?.stock > 0 ? "CheckCircle" : "XCircle"}
          size={16}
          className={product?.stock > 0 ? 'text-success' : 'text-error'}
        />
        <span className={`text-sm font-medium ${product?.stock > 0 ? 'text-success' : 'text-error'}`}>
          {product?.stock > 0 ? `In Stock (${product?.stock} available)` : 'Out of Stock'}
        </span>
      </div>
      {/* Product Description */}
      <div>
        <h3 className="font-semibold text-foreground mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{product?.description}</p>
      </div>
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Size <span className="text-red-500">*</span>
        </label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions?.map((option) => (
              <SelectItem
                key={option.key}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          title="View size guide"
        >
          Size Guide
        </button>
      </div>
      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color <span className="text-red-500">*</span>
        </label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions?.map((option) => (
              <SelectItem
                key={option.key}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-hover"
            aria-label="Decrease quantity"
            title="Decrease quantity"
          >
            <Icon name="Minus" size={16} />
          </button>
          <span className="text-lg font-medium w-12 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product?.stock}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-hover"
            aria-label="Increase quantity"
            title="Increase quantity"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button
            variant="default"
            size="lg"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            loading={isAddingToCart}
            iconName="ShoppingCart"
            iconPosition="left"
            className="flex-1"
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onToggleWishlist}
            iconName="Heart"
            className={isInWishlist ? 'text-error border-error' : ''}
          >
            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>

        {/* WhatsApp Contact */}
        <div className="flex justify-center">
          <WhatsAppProductContact
            productName={product?.name}
            productId={product?.id?.toString()}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      {/* Product Features */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-foreground mb-4">Product Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
