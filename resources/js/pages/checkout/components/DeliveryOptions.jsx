import React, { useState } from 'react';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

const DeliveryOptions = ({ onNext, onBack, formData, setFormData }) => {
  const [selectedOption, setSelectedOption] = useState(formData?.delivery?.option || 'standard');

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivered within 5-7 business days',
      price: 0,
      estimatedDate: 'Sep 28 - Oct 2, 2025',
      icon: 'Truck'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Delivered within 2-3 business days',
      price: 9.99,
      estimatedDate: 'Sep 24 - Sep 25, 2025',
      icon: 'Zap'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Delivered by next business day',
      price: 19.99,
      estimatedDate: 'Sep 23, 2025',
      icon: 'Clock'
    }
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    const option = deliveryOptions?.find(opt => opt?.id === optionId);
    setFormData(prev => ({
      ...prev,
      delivery: {
        option: optionId,
        name: option?.name,
        price: option?.price,
        estimatedDate: option?.estimatedDate
      }
    }));
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Delivery Options</h2>
        <p className="text-muted-foreground mb-6">Choose your preferred delivery method</p>
      </div>
      <div className="space-y-4">
        {deliveryOptions?.map((option) => (
          <div
            key={option?.id}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all duration-200
              ${selectedOption === option?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }
            `}
            onClick={() => handleOptionSelect(option?.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${selectedOption === option?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <Icon name={option?.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{option?.name}</h3>
                  <p className="text-sm text-muted-foreground">{option?.description}</p>
                  <p className="text-sm font-medium text-primary mt-1">{option?.estimatedDate}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">
                  {option?.price === 0 ? 'FREE' : `$${option?.price?.toFixed(2)}`}
                </div>
                <div className={`
                  w-5 h-5 rounded-full border-2 mt-2 flex items-center justify-center
                  ${selectedOption === option?.id
                    ? 'border-primary bg-primary' :'border-border'
                  }
                `}>
                  {selectedOption === option?.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Delivery Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All delivery times are estimates and may vary</li>
              <li>• Signature required for orders over $100</li>
              <li>• Free standard delivery on orders over $75</li>
              <li>• Express and overnight delivery available Monday-Friday</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back to Shipping
        </Button>
        <Button onClick={handleContinue}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default DeliveryOptions;
