import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

const SavedItems = ({ savedItems, onMoveToCart, onRemoveFromSaved }) => {
  const [movingItems, setMovingItems] = useState(new Set());

  const handleMoveToCart = async (itemId) => {
    setMovingItems(prev => new Set([...prev, itemId]));
    try {
      await onMoveToCart(itemId);
    } finally {
      setMovingItems(prev => {
        const newSet = new Set(prev);
        newSet?.delete(itemId);
        return newSet;
      });
    }
  };

  if (!savedItems || savedItems?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No saved items yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Saved for Later ({savedItems?.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedItems?.map((item) => (
          <div key={item?.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <Link to={`/product-detail?id=${item?.id}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover hover:scale-105 transition-hover"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link
                to={`/product-detail?id=${item?.id}`}
                className="font-medium text-foreground hover:text-primary transition-hover line-clamp-2 mb-2"
              >
                {item?.name}
              </Link>

              <div className="flex flex-wrap gap-1 mb-2 text-xs">
                {item?.size && (
                  <span className="bg-muted px-2 py-1 rounded text-muted-foreground">
                    Size: {item?.size}
                  </span>
                )}
                {item?.color && (
                  <span className="bg-muted px-2 py-1 rounded text-muted-foreground">
                    Color: {item?.color}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-primary">${item?.price?.toFixed(2)}</span>
                {item?.originalPrice && item?.originalPrice > item?.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item?.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleMoveToCart(item?.id)}
                  loading={movingItems?.has(item?.id)}
                  className="flex-1"
                >
                  <Icon name="ShoppingCart" size={16} className="mr-1" />
                  Add to Cart
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromSaved(item?.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedItems;
