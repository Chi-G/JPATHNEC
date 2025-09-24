import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';

interface Filters {
  categories: string[];
  price: { min: string; max: string };
  sizes: string[];
  brands: string[];
  colors: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string[] | { min: string; max: string }) => void;
  onClearAll: () => void;
  productCount: number;
}

type SectionKey = 'category' | 'price' | 'size' | 'brand' | 'color';

interface FilterSectionProps {
  title: string;
  section: SectionKey;
  children: React.ReactNode;
}

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  productCount
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    brand: true,
    color: true
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categories = [
    { id: 'tshirts', label: 'T-Shirts', count: 45 },
    { id: 'polos', label: 'Polos', count: 32 },
    { id: 'corporate', label: 'Corporate Shirts', count: 28 },
    { id: 'trousers', label: 'Trousers', count: 38 },
    { id: 'pants', label: 'Pants', count: 42 },
    { id: 'shoes', label: 'Shoes', count: 56 },
    { id: 'sneakers', label: 'Sneakers', count: 34 },
    { id: 'sandals', label: 'Sandals', count: 29 },
    { id: 'slippers', label: 'Slippers', count: 18 }
  ];

  const sizes = [
    { id: 'xs', label: 'XS', count: 23 },
    { id: 's', label: 'S', count: 67 },
    { id: 'm', label: 'M', count: 89 },
    { id: 'l', label: 'L', count: 78 },
    { id: 'xl', label: 'XL', count: 45 },
    { id: 'xxl', label: 'XXL', count: 34 }
  ];

  const brands = [
    { id: 'nike', label: 'Nike', count: 45 },
    { id: 'adidas', label: 'Adidas', count: 38 },
    { id: 'puma', label: 'Puma', count: 32 },
    { id: 'reebok', label: 'Reebok', count: 28 },
    { id: 'vans', label: 'Vans', count: 24 },
    { id: 'converse', label: 'Converse', count: 19 }
  ];

  const colors = [
    { id: 'black', label: 'Black', hex: '#000000', count: 67 },
    { id: 'white', label: 'White', hex: '#FFFFFF', count: 54 },
    { id: 'blue', label: 'Blue', hex: '#3B82F6', count: 43 },
    { id: 'red', label: 'Red', hex: '#EF4444', count: 32 },
    { id: 'green', label: 'Green', hex: '#10B981', count: 28 },
    { id: 'gray', label: 'Gray', hex: '#6B7280', count: 45 }
  ];

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    onFilterChange('price', {
      ...filters?.price,
      [type]: value
    });
  };

  const FilterSection = ({ title, section, children }: FilterSectionProps) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-primary transition-hover"
      >
        <span>{title}</span>
        <Icon
          name={expandedSections?.[section] ? "ChevronUp" : "ChevronDown"}
          size={16}
        />
      </button>
      {expandedSections?.[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 lg:w-64
        bg-background border-r border-border z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {productCount} items
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Clear All */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-full mb-6"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Clear All Filters
          </Button>

          {/* Category Filter */}
          <FilterSection title="Category" section="category">
            {categories?.map((category) => (
              <div key={category?.id} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters?.categories?.includes(category?.id) || false}
                    onCheckedChange={(checked: boolean) => {
                      const newCategories = checked
                        ? [...(filters?.categories || []), category?.id]
                        : (filters?.categories || [])?.filter(c => c !== category?.id);
                      onFilterChange('categories', newCategories);
                    }}
                  />
                  <span className="text-sm text-foreground">{category?.label}</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  ({category?.count})
                </span>
              </div>
            ))}
          </FilterSection>

          {/* Price Range Filter */}
          <FilterSection title="Price Range" section="price">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters?.price?.min || ''}
                  onChange={(e) => handlePriceChange('min', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters?.price?.max || ''}
                  onChange={(e) => handlePriceChange('max', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under $25', min: 0, max: 25 },
                  { label: '$25 - $50', min: 25, max: 50 },
                  { label: '$50 - $100', min: 50, max: 100 },
                  { label: 'Over $100', min: 100, max: null }
                ]?.map((range, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => onFilterChange('price', {
                      min: range?.min?.toString() || '',
                      max: range?.max?.toString() || ''
                    })}
                    className="px-3 py-1 text-xs border border-border rounded-full hover:bg-muted transition-hover"
                  >
                    {range?.label}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Size Filter */}
          <FilterSection title="Size" section="size">
            <div className="grid grid-cols-3 gap-2">
              {sizes?.map((size) => (
                <button
                  type="button"
                  key={size?.id}
                  onClick={() => {
                    const newSizes = filters?.sizes?.includes(size?.id)
                      ? (filters?.sizes || [])?.filter(s => s !== size?.id)
                      : [...(filters?.sizes || []), size?.id];
                    onFilterChange('sizes', newSizes);
                  }}
                  className={`
                    px-3 py-2 text-sm border rounded-md transition-hover
                    ${filters?.sizes?.includes(size?.id)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary'
                    }
                  `}
                >
                  {size?.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Brand Filter */}
          <FilterSection title="Brand" section="brand">
            {brands?.map((brand) => (
              <div key={brand?.id} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters?.brands?.includes(brand?.id) || false}
                    onCheckedChange={(checked: boolean) => {
                      const newBrands = checked
                        ? [...(filters?.brands || []), brand?.id]
                        : (filters?.brands || [])?.filter(b => b !== brand?.id);
                      onFilterChange('brands', newBrands);
                    }}
                  />
                  <span className="text-sm text-foreground">{brand?.label}</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  ({brand?.count})
                </span>
              </div>
            ))}
          </FilterSection>

          {/* Color Filter */}
          <FilterSection title="Color" section="color">
            <div className="grid grid-cols-4 gap-2">
              {colors?.map((color) => {
                const colorClass = color?.id;
                return (
                  <button
                    type="button"
                    key={color?.id}
                    onClick={() => {
                      const newColors = filters?.colors?.includes(color?.id)
                        ? (filters?.colors || [])?.filter(c => c !== color?.id)
                        : [...(filters?.colors || []), color?.id];
                      onFilterChange('colors', newColors);
                    }}
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition-hover
                      ${filters?.colors?.includes(color?.id)
                        ? 'border-primary scale-110' :'border-border hover:border-primary'
                      }
                      ${colorClass === 'black' ? 'bg-black' : ''}
                      ${colorClass === 'white' ? 'bg-white' : ''}
                      ${colorClass === 'blue' ? 'bg-blue-500' : ''}
                      ${colorClass === 'red' ? 'bg-red-500' : ''}
                      ${colorClass === 'green' ? 'bg-green-500' : ''}
                      ${colorClass === 'gray' ? 'bg-gray-500' : ''}
                    `}
                    title={color?.label}
                  >
                    {filters?.colors?.includes(color?.id) && (
                      <Icon
                        name="Check"
                        size={16}
                        className={`absolute inset-0 m-auto ${
                          color?.id === 'white' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
