import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { ChevronRight, Heart, ShoppingCart, X, Grid, List, Search, Filter, Eye } from 'lucide-react';
import Header from '../../components/ui/header';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { User } from '../../types';

// Wishlist-specific product interface that matches backend response
interface WishlistProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price?: number;
    description: string;
    images: string[];
    category: string;
    brand?: string;
    in_stock: boolean;
    stock_quantity: number;
    rating: number;
    reviews_count: number;
    added_to_wishlist_at: string;
}

interface WishlistProps {
    auth: {
        user: User;
    };
    products: WishlistProduct[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        sort?: string;
    };
    cartCount?: number;
    wishlistCount?: number;
}
export default function Wishlist({ auth, products, categories, filters, cartCount = 0, wishlistCount = 0 }: WishlistProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [removingItems, setRemovingItems] = useState<number[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        if (sortBy) params.append('sort', sortBy);
        
        router.get(`/wishlist?${params.toString()}`);
    };

    const removeFromWishlist = async (productId: number) => {
        setRemovingItems(prev => [...prev, productId]);
        
        try {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Product removed from wishlist');
                router.reload({ only: ['products'] });
            } else {
                toast.error(data.message || 'Failed to remove product from wishlist');
            }
        } catch {
            toast.error('An error occurred while removing from wishlist');
        } finally {
            setRemovingItems(prev => prev.filter(id => id !== productId));
        }
    };

    const addToCart = async (productId: number) => {
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
                    product_id: productId,
                    quantity: 1
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Product added to cart!');
                router.reload({ only: ['cartCount'] });
            } else if (response.status === 409) {
                toast.error(data.message || 'This item is already in your cart.');
            } else {
                toast.error(data.message || 'Failed to add product to cart.');
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('An error occurred while adding to cart.');
        }
    };

    const clearWishlist = async () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            try {
                // Get CSRF token from meta tag
                const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                
                const response = await fetch('/wishlist/clear', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': token || '',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(data.message || 'Wishlist cleared');
                    router.reload({ only: ['products'] });
                } else {
                    toast.error(data.message || 'Failed to clear wishlist');
                }
            } catch (error) {
                console.error('Failed to clear wishlist:', error);
                toast.error('An error occurred while clearing wishlist');
            }
        }
    };

    return (
        <>
            <Head title="My Wishlist - JPATHNEC" />
            
            <div className="min-h-screen bg-background">
                <Header user={auth.user} cartCount={cartCount} wishlistCount={wishlistCount} />
                <div className="container mx-auto px-8 md:px-12 lg:px-16 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                        <Link href="/" className="hover:text-foreground transition-hover">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">My Wishlist</span>
                    </nav>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                            <p className="text-muted-foreground mt-1">
                                Your saved items ({products.length} products)
                            </p>
                        </div>
                        
                        {products.length > 0 && (
                            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                                <div className="flex items-center border rounded-lg bg-card">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} rounded-l-lg`}
                                        title="Grid view"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} rounded-r-lg`}
                                        title="List view"
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button variant="outline" onClick={clearWishlist}>
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    {products.length > 0 && (
                        <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Search Products
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search your wishlist..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                                        title="Filter by category"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                                        title="Sort products"
                                    >
                                        <option value="newest">Recently Added</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="name">Name A-Z</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleSearch}>
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {products.length === 0 ? (
                        <div className="bg-card rounded-lg shadow-sm border p-12 text-center">
                            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</h3>
                            <p className="text-muted-foreground mb-6">
                                {filters.search || filters.category 
                                    ? "No products match your current filters."
                                    : "Save items you love to your wishlist for easy access later."
                                }
                            </p>
                            <Link href="/product-list">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${
                            viewMode === 'grid' 
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                : 'grid-cols-1'
                        }`}>
                            {products.map((product) => (
                                <div 
                                    key={product.id} 
                                    className={`bg-card rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                                        viewMode === 'list' ? 'flex' : ''
                                    } ${removingItems.includes(product.id) ? 'opacity-50' : ''}`}
                                >
                                    {/* Product Image */}
                                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                                        <Link href={`/products/${product.id}`}>
                                            <img
                                                src={product.images[0] || '/placeholder-product.jpg'}
                                                alt={product.name}
                                                className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                                            />
                                        </Link>
                                        
                                        {/* Stock badge */}
                                        {!product.in_stock && (
                                            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                                                Out of Stock
                                            </span>
                                        )}
                                        
                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            disabled={removingItems.includes(product.id)}
                                            className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
                                            title="Remove from wishlist"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    {/* Product Details */}
                                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <Link href={`/products/${product.id}`} className="flex-1">
                                                    <h3 className="text-lg font-semibold text-foreground hover:text-primary line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                            
                                            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                                            
                                            {viewMode === 'list' && (
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="text-xl font-bold text-foreground">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.compare_price && product.compare_price > product.price && (
                                                        <span className="text-sm text-muted-foreground line-through ml-2">
                                                            {formatPrice(product.compare_price)}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {product.rating > 0 && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <span className="text-yellow-400">★</span>
                                                        <span className="ml-1">{product.rating}</span>
                                                        <span className="ml-1">({product.reviews_count})</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <p className="text-xs text-muted-foreground mb-3">
                                                Added {formatDate(product.added_to_wishlist_at)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className={`grid gap-2 ${viewMode === 'list' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            <Button
                                                onClick={() => addToCart(product.id)}
                                                disabled={!product.in_stock}
                                                className="w-full"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                            </Button>
                                            
                                            {viewMode === 'list' && (
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="outline" className="w-full">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}