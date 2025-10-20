import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import formatPrice from '../../../lib/formatPrice';
import type { Product, ShippingOption } from '../../../types';

interface ProductDetailsProps {
  product: Product & {
    shippingOptions?: ShippingOption[];
    returnShippingFee?: number | null;
    // allow snake_case fallbacks that sometimes come from the backend
    return_shipping_fee?: number | null;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Product Details', icon: 'Info' },
    { id: 'sizing', label: 'Size Guide', icon: 'Ruler' },
    { id: 'shipping', label: 'Shipping & Returns', icon: 'Truck' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Material</h4>
              <p className="text-muted-foreground">{product?.material}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Fit</h4>
              <p className="text-muted-foreground">{product?.fit}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Origin</h4>
              <p className="text-muted-foreground">{product?.origin}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">SKU</h4>
              <p className="text-muted-foreground font-mono">{product?.sku}</p>
            </div>
          </div>
        );
      case 'sizing':
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Size</th>
                    <th className="border border-border p-3 text-left">Chest (inches)</th>
                    <th className="border border-border p-3 text-left">Waist (inches)</th>
                    <th className="border border-border p-3 text-left">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.sizeChart?.map((size, index) => (
                    <tr key={index}>
                      <td className="border border-border p-3 font-medium">{size?.size}</td>
                      <td className="border border-border p-3">{size?.chest}</td>
                      <td className="border border-border p-3">{size?.waist}</td>
                      <td className="border border-border p-3">{size?.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Measurements are approximate and may vary by up to 1 inch.
            </p>
          </div>
        );
      case 'care':
        return (
          <div className="space-y-4">
            {product?.careInstructions?.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-muted-foreground">{instruction}</span>
              </div>
            ))}
          </div>
        );
      case 'shipping': {
        // sensible defaults if backend doesn't provide shipping data
        const defaultShippingOptions: ShippingOption[] = [
          { id: 'standard', name: 'Standard Shipping', price: 5.99, duration: '5-7 business days' },
          { id: 'express', name: 'Express Shipping', price: 12.99, duration: '2-3 business days' },
          { id: 'next_day', name: 'Next Day Delivery', price: 24.99, duration: '1 business day' }
        ];

        const shippingOptions: ShippingOption[] = (product?.shippingOptions && product.shippingOptions.length)
          ? product.shippingOptions
          : defaultShippingOptions;

        const returnFee = (product?.returnShippingFee ?? product?.return_shipping_fee) ?? 4.99;

        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Shipping Options</h4>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <div key={option.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">{option.duration}</p>
                    </div>
                    <span className="font-medium">{formatPrice(option.price)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Return Policy</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>• 30-day return window from delivery date</p>
                <p>• Items must be unworn with original tags</p>
                <p>• Free returns for defective items</p>
                <p>• Return shipping fee: {formatPrice(returnFee)} (deducted from refund)</p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-border mb-6">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-hover ${
              activeTab === tab?.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductDetails;
