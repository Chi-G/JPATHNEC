import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import InputError from '../../../components/input-error';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { CheckoutFormData } from '../../../types';

interface ShippingFormProps {
  onNext: () => void;
  onBack: () => void;
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onNext, onBack, formData, setFormData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryOptions = [
    { value: 'NG', label: 'Nigeria' },
  ];

  const stateOptions = [
    { value: 'AB', label: 'Abia' },
    { value: 'AD', label: 'Adamawa' },
    { value: 'AK', label: 'Akwa Ibom' },
    { value: 'AN', label: 'Anambra' },
    { value: 'BA', label: 'Bauchi' },
    { value: 'BY', label: 'Bayelsa' },
    { value: 'BE', label: 'Benue' },
    { value: 'BO', label: 'Borno' },
    { value: 'CR', label: 'Cross River' },
    { value: 'DE', label: 'Delta' },
    { value: 'EB', label: 'Ebonyi' },
    { value: 'ED', label: 'Edo' },
    { value: 'EK', label: 'Ekiti' },
    { value: 'EN', label: 'Enugu' },
    { value: 'FC', label: 'Federal Capital Territory' },
    { value: 'GO', label: 'Gombe' },
    { value: 'IM', label: 'Imo' },
    { value: 'JI', label: 'Jigawa' },
    { value: 'KD', label: 'Kaduna' },
    { value: 'KN', label: 'Kano' },
    { value: 'KT', label: 'Katsina' },
    { value: 'KE', label: 'Kebbi' },
    { value: 'KO', label: 'Kogi' },
    { value: 'KW', label: 'Kwara' },
    { value: 'LA', label: 'Lagos' },
    { value: 'NA', label: 'Nasarawa' },
    { value: 'NI', label: 'Niger' },
    { value: 'OG', label: 'Ogun' },
    { value: 'ON', label: 'Ondo' },
    { value: 'OS', label: 'Osun' },
    { value: 'OY', label: 'Oyo' },
    { value: 'PL', label: 'Plateau' },
    { value: 'RI', label: 'Rivers' },
    { value: 'SO', label: 'Sokoto' },
    { value: 'TA', label: 'Taraba' },
    { value: 'YO', label: 'Yobe' },
    { value: 'ZA', label: 'Zamfara' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault();

    // Create a copy of formData with country defaulted to 'US' if not set
    const formDataWithDefaults = {
      ...formData,
      shipping: {
        ...formData?.shipping,
        country: formData?.shipping?.country || 'NG'
      }
    };

    // Update the actual formData state with the defaults
    setFormData(formDataWithDefaults);

    // Validate using the data with defaults
    const newErrors: Record<string, string> = {};
    const shipping = formDataWithDefaults?.shipping;

    if (!shipping?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!shipping?.address?.trim()) newErrors.address = 'Address is required';
    if (!shipping?.city?.trim()) newErrors.city = 'City is required';
    if (!shipping?.state) newErrors.state = 'State is required';
    if (!shipping?.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shipping?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!shipping?.country) newErrors.country = 'Country is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>

        <h3 className="text-sm font-medium text-foreground mb-3">Enter your shipping address</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData?.shipping?.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            required
          />
          <InputError message={errors?.fullName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            placeholder="Street address"
            value={formData?.shipping?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            required
          />
          <InputError message={errors?.address} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              placeholder="City"
              value={formData?.shipping?.city || ''}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              required
            />
            <InputError message={errors?.city} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              title="Select your country"
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={formData?.shipping?.country || 'NG'}
              onChange={(e) => handleInputChange('country', e.target.value)}
              required
            >
              <option value="">Select country</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <InputError message={errors?.country} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="ZIP code"
              value={formData?.shipping?.zipCode || ''}
              onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
              required
            />
            <InputError message={errors?.zipCode} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              title="Select your state"
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={formData?.shipping?.state || ''}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
            >
              <option value="">Select state</option>
              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <InputError message={errors?.state} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone number"
            value={formData?.shipping?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            required
          />
          <InputError message={errors?.phone} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveAddress"
            checked={formData?.shipping?.saveAddress || false}
            onCheckedChange={(checked) => handleInputChange('saveAddress', checked)}
          />
          <Label htmlFor="saveAddress">Save this address for future orders</Label>
        </div>

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
