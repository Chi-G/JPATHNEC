import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Header from '../../components/ui/header';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import SortControls from './components/SortControls';
import Breadcrumb from './components/Breadcrumb';
import Pagination from './components/Pagination';
import QuickAddModal from './components/QuickAddModal';
import Button from '../../components/ui/button';
import { Product, User } from '../../types';

interface Filters {
  categories: string[];
  price: { min: string; max: string };
  sizes: string[];
  brands: string[];
  colors: string[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
}

interface ProductListProps {
  products: PaginatedProducts;
  categories: { id: string; name: string; children: { id: string; name: string }[] }[];
  filters: {
    price_ranges: { min: number; max: number | null; label: string }[];
    sizes: string[];
    colors: string[];
  };
  current_category?: string;
  current_filter?: string;
  search_query?: string;
  user?: User | null;
  cartCount?: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  filters: availableFilters,
  current_category,
  current_filter,
  search_query,
  user,
  cartCount = 0,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<Filters>({
    categories: current_category ? [current_category] : [],
    price: { min: '', max: '' },
    sizes: [],
    brands: [],
    colors: [],
  });

  // Sync filters and sort with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFilters({
      categories: current_category ? [current_category] : [],
      price: {
        min: urlParams.get('price_min') || '',
        max: urlParams.get('price_max') || '',
      },
      sizes: urlParams.get('sizes')?.split(',') || [],
      brands: urlParams.get('brands')?.split(',') || [],
      colors: urlParams.get('colors')?.split(',') || [],
    });
    setSortBy(urlParams.get('sort') || 'relevance');
  }, [current_category]);

  // Update URL when filters or sort change
  const applyFiltersAndSort = () => {
    setLoading(true);
    const query: { [key: string]: string } = {};

    if (filters.categories.length > 0) {
      query.category = filters.categories[0];
    }
    if (filters.price.min) query.price_min = filters.price.min;
    if (filters.price.max) query.price_max = filters.price.max;
    if (filters.sizes.length > 0) query.sizes = filters.sizes.join(',');
    if (filters.brands.length > 0) query.brands = filters.brands.join(',');
    if (filters.colors.length > 0) query.colors = filters.colors.join(',');
    if (search_query) query.search = search_query;
    if (sortBy !== 'relevance') query.sort = sortBy;

    router.get('/product-list', query, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setLoading(false),
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof Filters, value: string[] | { min: string; max: string }) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    applyFiltersAndSort();
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      price: { min: '', max: '' },
      sizes: [],
      brands: [],
      colors: [],
    });
    setSortBy('relevance');
    router.get('/product-list', { search: search_query || undefined }, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setLoading(false),
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFiltersAndSort();
  };

  // Handle wishlist toggle
  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.visit('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !product.selectedSize) {
      setQuickAddProduct(product);
      return;
    }

    try {
      // Get CSRF token from meta tag
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          size: product.selectedSize || null,
          color: product.selectedColor || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Product added to cart!');
        router.reload({ only: ['cartCount'] }); // Refresh cartCount prop
      } else if (response.status === 409) {
        // 409 Conflict - item already exists
        toast.error(data.message || 'This item is already in your cart.');
      } else {
        toast.error(data.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      toast.error('An error occurred while adding to cart.');
      console.error('Add to cart error:', error);
    }
  };

  // Handle quick add to cart
  const handleQuickAddToCart = async (productWithSelections: Product) => {
    if (!user) {
      router.visit('/login');
      return;
    }

    try {
      // Get CSRF token from meta tag
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
        },
        body: JSON.stringify({
          product_id: productWithSelections.id,
          quantity: 1,
          size: productWithSelections.selectedSize || null,
          color: productWithSelections.selectedColor || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Product added to cart!');
        router.reload({ only: ['cartCount'] }); // Refresh cartCount prop
        setQuickAddProduct(null);
      } else if (response.status === 409) {
        // 409 Conflict - item already exists
        toast.error(data.message || 'This item is already in your cart.');
      } else {
        toast.error(data.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      toast.error('An error occurred while adding to cart.');
      console.error('Add to cart error:', error);
    }
  };

  // Generate breadcrumb items
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/home' }];

    if (current_category) {
      items.push({
        label: current_category === 'mens-clothing' ? "Men's" : current_category === 'womens-clothing' ? "Women's" : 'Unisex',
        href: `/product-list?category=${current_category}`,
      });
    }

    if (current_filter) {
      const filterLabels: { [key: string]: string } = {
        'new-arrivals': 'New Arrivals',
        'bestsellers': 'Best Sellers',
        'featured': 'Featured',
      };
      items.push({ label: filterLabels[current_filter] || current_filter });
    } else if (search_query) {
      items.push({ label: `Search: "${search_query}"` });
    } else {
      items.push({ label: 'All Products' });
    }

    return items;
  };

  return (
    <>
      <Head title="JPATHNEC - Shop Products">
        <meta
          name="description"
          content="Browse premium men's and women's clothing and footwear at JPATHNEC. Filter by category, price, size, and more."
        />
        <meta
          name="keywords"
          content="men's clothing, women's clothing, footwear, t-shirts, polos, corporate shirts, sneakers, sandals, fashion, apparel"
        />
        <meta property="og:title" content="JPATHNEC - Shop Products" />
        <meta
          property="og:description"
          content="Explore our collection of premium apparel and footwear."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/product-list" />
      </Head>
      <div className="min-h-screen bg-background">
        <Header user={user} cartCount={cartCount} />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-6">
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <FilterSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              productCount={products.total}
              categories={categories}
              availableFilters={availableFilters}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-6">
              {/* Breadcrumb */}
              <Breadcrumb items={getBreadcrumbItems()} />

              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {search_query
                      ? `Search Results for "${search_query}"`
                      : current_filter
                        ? current_filter.charAt(0).toUpperCase() + current_filter.slice(1).replace('-', ' ')
                        : current_category
                          ? current_category === 'mens-clothing'
                            ? "Men's Products"
                            : current_category === 'womens-clothing'
                              ? "Women's Products"
                              : 'Unisex Products'
                          : 'All Products'}
                  </h1>
                  <p className="text-muted-foreground">
                    Discover our collection of quality apparel and footwear
                    <span className="ml-2">({products.total} products)</span>
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  iconName="Filter"
                  iconPosition="left"
                >
                  Filters
                </Button>
              </div>

              {/* Sort Controls */}
              <SortControls
                sortBy={sortBy}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalProducts={products.total}
                currentPage={products.current_page}
                productsPerPage={12}
              />

              {/* Product Grid */}
              <ProductGrid
                products={products.data}
                loading={loading}
                onAddToCart={handleAddToCart}
              />

              {/* Pagination */}
              <Pagination
                currentPage={products.current_page}
                totalPages={products.last_page}
                onPageChange={(page) => {
                  setLoading(true);
                  router.get(
                    '/product-list',
                    {
                      page,
                      category: current_category,
                      filter: current_filter,
                      search: search_query,
                      // add more filters here if needed
                    },
                    { preserveState: true, preserveScroll: true, onFinish: () => setLoading(false) }
                  );
                }}
              />
            </div>
          </div>
        </div>
        {/* Quick Add Modal */}
        <QuickAddModal
          product={quickAddProduct}
          isOpen={!!quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
          onAddToCart={handleQuickAddToCart}
        />
      </div>
    </>
  );
};

export default ProductList;
