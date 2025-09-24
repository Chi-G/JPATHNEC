import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';

const ShippingForm = ({ onNext, onBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const [savedAddresses] = useState([
    {
      id: 1,
      name: "Home",
      fullName: "John Smith",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      name: "Office",
      fullName: "John Smith",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      phone: "+1 (555) 987-6543"
    }
  ]);

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' }
  ];

  const stateOptions = [
    { value: 'NY', label: 'New York' },
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev?.shipping,
        [field]: value
      }
    }));

    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddressSelect = (address) => {
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev?.shipping,
        fullName: address?.fullName,
        address: address?.address,
        city: address?.city,
        state: address?.state,
        zipCode: address?.zipCode,
        phone: address?.phone
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const shipping = formData?.shipping;

    if (!shipping?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!shipping?.address?.trim()) newErrors.address = 'Address is required';
    if (!shipping?.city?.trim()) newErrors.city = 'City is required';
    if (!shipping?.state) newErrors.state = 'State is required';
    if (!shipping?.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shipping?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!shipping?.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>

        {savedAddresses?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Saved Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedAddresses?.map((address) => (
                <div
                  key={address?.id}
                  className="p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-hover"
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="font-medium text-foreground">{address?.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {address?.fullName}<br />
                    {address?.address}<br />
                    {address?.city}, {address?.state} {address?.zipCode}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Or enter new address</h3>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.shipping?.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        <Input
          label="Address"
          type="text"
          placeholder="Street address"
          value={formData?.shipping?.address || ''}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          error={errors?.address}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="City"
            value={formData?.shipping?.city || ''}
            onChange={(e) => handleInputChange('city', e?.target?.value)}
            error={errors?.city}
            required
          />

          <Select
            label="State"
            placeholder="Select state"
            options={stateOptions}
            value={formData?.shipping?.state || ''}
            onChange={(value) => handleInputChange('state', value)}
            error={errors?.state}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ZIP Code"
            type="text"
            placeholder="ZIP code"
            value={formData?.shipping?.zipCode || ''}
            onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
            error={errors?.zipCode}
            required
          />

          <Select
            label="Country"
            placeholder="Select country"
            options={countryOptions}
            value={formData?.shipping?.country || 'US'}
            onChange={(value) => handleInputChange('country', value)}
            error={errors?.country}
            required
          />
        </div>

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Phone number"
          value={formData?.shipping?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Checkbox
          label="Save this address for future orders"
          checked={formData?.shipping?.saveAddress || false}
          onChange={(e) => handleInputChange('saveAddress', e?.target?.checked)}
        />

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back to Cart
          </Button>
          <Button type="submit">
            Continue to Delivery
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
