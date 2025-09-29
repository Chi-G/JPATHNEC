import React from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

const EmptyCart = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      category: "Men's T-Shirts"
    },
    {
      id: 2,
      name: "Professional Polo Shirt",
      price: 49.99,
      image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?w=300&h=300&fit=crop",
      category: "Men's Polos"
    },
    {
      id: 3,
      name: "Running Sneakers",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg?w=300&h=300&fit=crop",
      category: "Men's Shoes"
    },
    {
      id: 4,
      name: "Women's Casual Shirt",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
      category: "Women's Shirts"
    }
  ];

  return (
    <div className="text-center py-12">
      {/* Empty Cart Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link href="/product-list">
          <Button variant="default" className="min-w-[200px]">
            <Icon name="Search" size={18} className="mr-2" />
            Browse Products
          </Button>
        </Link>

        <Link href="/home">
          <Button variant="outline" className="min-w-[200px]">
            <Icon name="Home" size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      {/* Featured Products */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-foreground mb-6">You might like these</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts?.map((product) => (
            <Link
              key={product?.id}
              href={`/products?id=${product?.id}`}
              className="group"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-md transition-hover">
                <div className="aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-hover"
                  />
                </div>

                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{product?.category}</div>
                  <h4 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-hover">
                    {product?.name}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${product?.price}</span>
                    {product?.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product?.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Benefits Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Truck" size={24} className="text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On orders over $50</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="RotateCcw" size={24} className="text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">30-day return policy</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
