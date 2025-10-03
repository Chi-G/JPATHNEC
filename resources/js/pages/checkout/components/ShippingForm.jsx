import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/select-temp';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';

const ShippingForm = ({ onNext, onBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
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
    const newErrors = {};
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
            label="Country"
            placeholder="Select country"
            options={countryOptions}
            value={formData?.shipping?.country || 'NG'}
            onChange={(value) => handleInputChange('country', value)}
            error={errors?.country}
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
            label="State"
            placeholder="Select state"
            options={stateOptions}
            value={formData?.shipping?.state || ''}
            onChange={(value) => handleInputChange('state', value)}
            error={errors?.state}
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
