import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/header';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import SortControls from './components/SortControls';
import Breadcrumb from './components/Breadcrumb';
import Pagination from './components/Pagination';
import QuickAddModal from './components/QuickAddModal';

import Button from '../../components/ui/button';

interface Color {
  name: string;
  hex: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
  category: string;
  gender: string;
  sizes: string[];
  colors: Color[];
  isWishlisted: boolean;
  selectedSize?: string;
}

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

interface User {
  id: number;
  name: string;
  email: string;
}

interface ProductListProps {
  categoryProp?: string;
  typeProp?: string;
  searchProp?: string;
  user?: User | null;
  cartCount?: number;
}

const ProductList = ({ categoryProp, typeProp, searchProp, user, cartCount = 0 }: ProductListProps = {}) => {
  // Get URL parameters from browser's current URL as fallback
  const urlParams = new URLSearchParams(window.location.search);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    price: { min: '', max: '' },
    sizes: [],
    brands: [],
    colors: []
  });

  const productsPerPage = 12;

  // Mock product data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      brand: "Nike",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.5,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      isNew: true,
      discount: 25,
      category: "tshirts",
      gender: "mens",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Navy", hex: "#1E3A8A" }
      ],
      isWishlisted: false
    },
    {
      id: 2,
      name: "Professional Polo Shirt",
      brand: "Adidas",
      price: 45.99,
      rating: 4.3,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
      isBestseller: true,
      category: "polos",
      gender: "mens",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Gray", hex: "#6B7280" },
        { name: "Green", hex: "#10B981" }
      ],
      isWishlisted: true
    },
    {
      id: 3,
      name: "Business Formal Shirt",
      brand: "Hugo Boss",
      price: 89.99,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      category: "corporate",
      gender: "mens",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Light Blue", hex: "#3B82F6" }
      ],
      isWishlisted: false
    },
    {
      id: 4,
      name: "Casual Chino Trousers",
      brand: "Levi's",
      price: 69.99,
      originalPrice: 79.99,
      rating: 4.2,
      reviewCount: 94,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
      discount: 12,
      category: "trousers",
      gender: "mens",
      sizes: ["30", "32", "34", "36", "38"],
      colors: [
        { name: "Khaki", hex: "#D2B48C" },
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 5,
      name: "Comfortable Jogger Pants",
      brand: "Puma",
      price: 39.99,
      rating: 4.1,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      isNew: true,
      category: "pants",
      gender: "mens",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gray", hex: "#6B7280" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 6,
      name: "Running Sneakers",
      brand: "Nike",
      price: 129.99,
      rating: 4.6,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      isBestseller: true,
      category: "sneakers",
      gender: "mens",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" },
        { name: "Red", hex: "#EF4444" }
      ],
      isWishlisted: true
    },
    {
      id: 7,
      name: "Leather Dress Shoes",
      brand: "Clarks",
      price: 159.99,
      rating: 4.4,
      reviewCount: 112,
      image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
      category: "shoes",
      gender: "mens",
      sizes: ["7", "8", "9", "10", "11"],
      colors: [
        { name: "Brown", hex: "#8B4513" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 8,
      name: "Summer Sandals",
      brand: "Birkenstock",
      price: 79.99,
      rating: 4.3,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
      category: "sandals",
      gender: "mens",
      sizes: ["7", "8", "9", "10", "11"],
      colors: [
        { name: "Brown", hex: "#8B4513" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 9,
      name: "Women's Casual T-Shirt",
      brand: "H&M",
      price: 24.99,
      rating: 4.2,
      reviewCount: 145,
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
      isNew: true,
      category: "tshirts",
      gender: "womens",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Pink", hex: "#EC4899" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 10,
      name: "Women's Polo Shirt",
      brand: "Ralph Lauren",
      price: 55.99,
      rating: 4.5,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      category: "polos",
      gender: "womens",
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Navy", hex: "#1E3A8A" },
        { name: "Pink", hex: "#EC4899" }
      ],
      isWishlisted: true
    },
    {
      id: 11,
      name: "Women's Blouse",
      brand: "Zara",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.1,
      reviewCount: 76,
      image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop",
      discount: 17,
      category: "corporate",
      gender: "womens",
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Light Blue", hex: "#3B82F6" }
      ],
      isWishlisted: false
    },
    {
      id: 12,
      name: "Women's Dress Pants",
      brand: "Ann Taylor",
      price: 79.99,
      rating: 4.3,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      category: "pants",
      gender: "womens",
      sizes: ["0", "2", "4", "6", "8", "10"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1E3A8A" }
      ],
      isWishlisted: false
    },
    {
      id: 13,
      name: "Women's High Heels",
      brand: "Jimmy Choo",
      price: 299.99,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
      isBestseller: true,
      category: "shoes",
      gender: "womens",
      sizes: ["5", "6", "7", "8", "9"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Red", hex: "#EF4444" }
      ],
      isWishlisted: true
    },
    {
      id: 14,
      name: "Women's Sneakers",
      brand: "Adidas",
      price: 89.99,
      rating: 4.4,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=400&fit=crop",
      category: "sneakers",
      gender: "womens",
      sizes: ["5", "6", "7", "8", "9"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Pink", hex: "#EC4899" }
      ],
      isWishlisted: false
    },
    {
      id: 15,
      name: "Women's Sandals",
      brand: "Teva",
      price: 69.99,
      rating: 4.2,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
      category: "sandals",
      gender: "womens",
      sizes: ["5", "6", "7", "8", "9"],
      colors: [
        { name: "Brown", hex: "#8B4513" },
        { name: "Black", hex: "#000000" }
      ],
      isWishlisted: false
    },
    {
      id: 16,
      name: "Women's Slippers",
      brand: "UGG",
      price: 89.99,
      rating: 4.6,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
      category: "slippers",
      gender: "womens",
      sizes: ["5", "6", "7", "8", "9"],
      colors: [
        { name: "Gray", hex: "#6B7280" },
        { name: "Pink", hex: "#EC4899" }
      ],
      isWishlisted: true
    }
  ];

  // Get current filters from URL params
  const category = categoryProp || urlParams.get('category');
  const type = typeProp || urlParams.get('type');
  const searchQuery = searchProp || urlParams.get('search');

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Apply URL-based filters
    if (category) {
      filtered = filtered?.filter(product => product?.gender === category);
    }
    if (type) {
      filtered = filtered?.filter(product => product?.category === type);
    }
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(query) ||
        product?.brand?.toLowerCase()?.includes(query) ||
        product?.category?.toLowerCase()?.includes(query)
      );
    }

    // Apply sidebar filters
    if (filters?.categories?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.categories?.includes(product?.category)
      );
    }
    if (filters?.brands?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.brands?.includes(product?.brand?.toLowerCase()?.replace(' ', ''))
      );
    }
    if (filters?.sizes?.length > 0) {
      filtered = filtered?.filter(product =>
        product?.sizes?.some(size => filters?.sizes?.includes(size?.toLowerCase()))
      );
    }
    if (filters?.colors?.length > 0) {
      filtered = filtered?.filter(product =>
        product?.colors?.some(color => filters?.colors?.includes(color?.name?.toLowerCase()))
      );
    }
    if (filters?.price?.min || filters?.price?.max) {
      const min = parseFloat(filters?.price?.min) || 0;
      const max = parseFloat(filters?.price?.max) || Infinity;
      filtered = filtered?.filter(product =>
        product?.price >= min && product?.price <= max
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        filtered?.sort((a, b) => (b?.isNew ? 1 : 0) - (a?.isNew ? 1 : 0));
        break;
      case 'popularity':
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
        break;
      case 'name-az':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-za':
        filtered?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);
  const currentProducts = filteredProducts?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Generate breadcrumb items
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/home' }];

    if (category) {
      items.push({
        label: category === 'mens' ? "Men's" : "Women's",
        href: `/product-list?category=${category}`
      });
    }

    if (type) {
      const typeLabels: { [key: string]: string } = {
        tshirts: 'T-Shirts',
        polos: 'Polos',
        corporate: 'Corporate Shirts',
        trousers: 'Trousers',
        pants: 'Pants',
        shoes: 'Shoes',
        sneakers: 'Sneakers',
        sandals: 'Sandals',
        slippers: 'Slippers'
      };
      items.push({ label: typeLabels[type] || type });
    } else if (searchQuery) {
      items.push({ label: `Search: "${searchQuery}"` });
    } else {
      items.push({ label: 'All Products' });
    }

    return items;
  };

  // Event handlers
  const handleFilterChange = (filterType: keyof Filters, value: string[] | { min: string; max: string }) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      price: { min: '', max: '' },
      sizes: [],
      brands: [],
      colors: []
    });
    setCurrentPage(1);
  };

  const handleWishlistToggle = (productId: number, isWishlisted: boolean) => {
    // In a real app, this would update the backend
    console.log(`Product ${productId} wishlist status: ${isWishlisted}`);
  };

  const handleAddToCart = (product: Product) => {
    if (product?.sizes && product?.sizes?.length > 0 && !product?.selectedSize) {
      setQuickAddProduct(product);
      return;
    }

    // In a real app, this would add to cart
    console.log('Added to cart:', product);
  };

  const handleQuickAddToCart = (productWithSelections: Product) => {
    // In a real app, this would add to cart with selections
    console.log('Added to cart with selections:', productWithSelections);
    setQuickAddProduct(null);
  };

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [category, type, searchQuery, filters, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, type, searchQuery, filters, sortBy]);

  return (
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
            productCount={filteredProducts?.length}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-6">
            {/* Breadcrumb */}
            <Breadcrumb items={getBreadcrumbItems()} />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` :
                   type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) :
                   category ? (category === 'mens' ? "Men's Products" : "Women's Products") :
                   'All Products'}
                </h1>
                <p className="text-muted-foreground">
                  Discover our collection of quality apparel and footwear
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
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalProducts={filteredProducts?.length}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
            />

            {/* Product Grid */}
            <ProductGrid
              products={currentProducts}
              loading={loading}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
  );
};

export default ProductList;
