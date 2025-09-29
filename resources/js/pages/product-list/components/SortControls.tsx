import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';

interface SortOption {
  value: string;
  label: string;
  icon: string;
}

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sortValue: string) => void;
  onViewModeChange: (viewMode: "grid" | "list") => void;
  viewMode: string;
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
}

const SortControls = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProducts,
  currentPage,
  productsPerPage
}: SortControlsProps) => {
  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevance', icon: 'Target' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest Arrivals', icon: 'Clock' },
    { value: 'rating', label: 'Customer Rating', icon: 'Star' },
    { value: 'popularity', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'name-az', label: 'Name: A to Z', icon: 'ArrowUp' },
    { value: 'name-za', label: 'Name: Z to A', icon: 'ArrowDown' }
  ];

  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {startProduct}-{endProduct} of {totalProducts} products
      </div>
      {/* Sort and View Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value)}
            className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Sort products by"
            title="Sort products by"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          <Icon
            name="ChevronDown"
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-none border-0"
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-none border-0"
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
