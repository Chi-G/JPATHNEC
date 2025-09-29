import React from 'react';
import { Link } from '@inertiajs/react';
import { routes } from '../../../utils/routes';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

const EmptyCart = () => {

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
        <Link href={routes.productList}>
          <Button variant="default" className="min-w-[200px]">
            <Icon name="Search" size={18} className="mr-2" />
            Browse Products
          </Button>
        </Link>

        <Link href={routes.home}>
          <Button variant="outline" className="min-w-[200px]">
            <Icon name="Home" size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
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
