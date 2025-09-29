import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';

interface CartItemData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  category: string;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => Promise<void>;
  onMoveToWishlist: (itemId: number) => Promise<void>;
}

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onMoveToWishlist }: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemoveItem(item?.id);
    setIsRemoving(false);
    setShowRemoveConfirm(false);
  };

  const handleMoveToWishlist = async () => {
    await onMoveToWishlist(item?.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-hover">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link href={`/products?id=${item?.id}`}>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover hover:scale-105 transition-hover"
              />
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex-1">
              <Link
                href={`/products?id=${item?.id}`}
                className="text-lg font-semibold text-foreground hover:text-primary transition-hover line-clamp-2"
              >
                {item?.name}
              </Link>

              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                {item?.size && (
                  <span className="bg-muted px-2 py-1 rounded">Size: {item?.size}</span>
                )}
                {item?.color && (
                  <span className="bg-muted px-2 py-1 rounded">Color: {item?.color}</span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-primary">${item?.price?.toFixed(2)}</span>
                {item?.originalPrice && item?.originalPrice > item?.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item?.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Price and Actions - Desktop */}
            <div className="flex flex-col items-end gap-2 sm:ml-4">
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">
                  ${(item?.price * item?.quantity)?.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${item?.price?.toFixed(2)} each
                </div>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Qty:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => handleQuantityChange(item?.quantity - 1)}
                  disabled={item?.quantity <= 1}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                  {item?.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => handleQuantityChange(item?.quantity + 1)}
                  disabled={item?.quantity >= 10}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMoveToWishlist}
                className="text-muted-foreground hover:text-primary"
              >
                <Icon name="Heart" size={16} className="mr-1" />
                Save for Later
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRemoveConfirm(true)}
                className="text-muted-foreground hover:text-destructive"
                disabled={isRemoving}
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-popover border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Remove Item</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to remove "{item?.name}" from your cart?
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(false)}
                disabled={isRemoving}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
                loading={isRemoving}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
