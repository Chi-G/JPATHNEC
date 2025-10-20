import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import type { Product } from '../../../types';
import formatPrice from '../../../lib/formatPrice';

type CartItem = Product & {
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
};

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: CartItem) => void;
}

const QuickAddModal = ({ product, isOpen, onClose, onAddToCart }: QuickAddModalProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;

    // If size is required but not selected, do not proceed
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }

    // If color is required but not selected, do not proceed
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      return;
    }

    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });

    onClose();
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Quick Add</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">{product?.name}</h3>
              <p className="text-lg font-semibold text-foreground">
                {formatPrice(product?.price)}
              </p>
              {product?.originalPrice !== undefined && product?.price !== undefined && product.originalPrice > product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product?.sizes && product?.sizes?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {product?.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-3 py-2 text-sm border rounded-md transition-all
                      ${selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product?.colors && product?.colors?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product?.colors?.map((color) => {
                  const colorClass = color?.name?.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <button
                      key={color?.name}
                      onClick={() => setSelectedColor(color?.name)}
                      className={`
                        relative w-10 h-10 rounded-full border-2 transition-all
                        ${selectedColor === color?.name
                          ? 'border-primary scale-110' :'border-border hover:border-primary'
                        }
                        ${colorClass === 'black' ? 'bg-black' : ''}
                        ${colorClass === 'white' ? 'bg-white' : ''}
                        ${colorClass === 'navy' ? 'bg-navy-600' : ''}
                        ${colorClass === 'gray' || colorClass === 'grey' ? 'bg-gray-500' : ''}
                        ${colorClass === 'green' ? 'bg-green-500' : ''}
                        ${colorClass === 'light-blue' ? 'bg-blue-300' : ''}
                        ${colorClass === 'khaki' ? 'bg-yellow-600' : ''}
                        ${colorClass === 'red' ? 'bg-red-500' : ''}
                        ${colorClass === 'pink' ? 'bg-pink-500' : ''}
                        ${colorClass === 'brown' ? 'bg-amber-800' : ''}
                        ${!['black', 'white', 'navy', 'gray', 'grey', 'green', 'light-blue', 'khaki', 'red', 'pink', 'brown'].includes(colorClass) ? 'bg-gray-400' : ''}
                      `}
                      title={color?.name}
                    >
                      {selectedColor === color?.name && (
                        <Icon
                          name="Check"
                          size={16}
                          className={`absolute inset-0 m-auto ${
                            color?.name === 'White' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="default"
            onClick={handleAddToCart}
            className="w-full"
            disabled={
              (product?.sizes && product?.sizes?.length > 0 && !selectedSize) ||
              (product?.colors && product?.colors?.length > 0 && !selectedColor)
            }
            iconName="ShoppingCart"
            iconPosition="left"
          >
            Add to Cart - {formatPrice(((product?.price ?? 0) * quantity))}
          </Button>

          {/* Requirements Note */}
          {((product?.sizes && product?.sizes?.length > 0) || (product?.colors && product?.colors?.length > 0)) && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              * Required selections
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
