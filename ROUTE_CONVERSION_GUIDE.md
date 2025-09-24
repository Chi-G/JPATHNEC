# Laravel + Inertia.js Route Conversion Guide

## Overview

This guide explains how your React Router application has been converted to work with Laravel routes and Inertia.js navigation.

## Route Structure

### Laravel Routes (Backend)

**File: `routes/web.php`**
```php
// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/product-list', [ProductController::class, 'index'])->name('products.index');
Route::get('/product-detail', [ProductController::class, 'show'])->name('products.show');
Route::get('/shopping-cart', [ShoppingCartController::class, 'index'])->name('cart.index');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');

// API routes for AJAX operations
Route::post('/api/cart/add', [ShoppingCartController::class, 'store']);
Route::put('/api/cart/{item}', [ShoppingCartController::class, 'update']);
Route::delete('/api/cart/{item}', [ShoppingCartController::class, 'destroy']);
```

**File: `routes/auth.php`**
```php
// Authentication routes (already configured)
Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
```

### Frontend Route Helpers

**File: `resources/js/utils/routes.ts`**
```typescript
export const routes = {
  home: '/',
  productList: '/product-list',
  productDetail: '/product-detail',
  shoppingCart: '/shopping-cart',
  checkout: '/checkout',
  // ... more routes
};

// Helper functions
export const buildProductListUrl = (params?: { category?: string; filter?: string }) => {
  // Builds URLs like: /product-list?category=mens&filter=new
};
```

## Controllers (Laravel Backend)

### HomeController
- **Route:** `/` and `/home`
- **Returns:** Home page with featured products, categories, hero slides
- **Data:** Mock data (replace with database queries)

### ProductController
- **Routes:** `/product-list`, `/product-detail`
- **Returns:** Product listing and detail pages
- **Handles:** Category filtering, search, product details

### ShoppingCartController
- **Routes:** `/shopping-cart` + API endpoints
- **Returns:** Cart page with items, totals, recommendations
- **Handles:** Add, update, remove cart operations

### CheckoutController
- **Routes:** `/checkout`, `/checkout/success`
- **Returns:** Checkout page and success page
- **Handles:** Payment processing, order creation

## Frontend Components (React + Inertia.js)

### Navigation
Replace React Router `<Link>` with Inertia `<Link>`:

**Before (React Router):**
```jsx
import { Link } from 'react-router-dom';
<Link to="/product-list?category=mens">Products</Link>
```

**After (Inertia.js):**
```jsx
import { Link } from '@inertiajs/react';
import { buildProductListUrl } from '../utils/routes';
<Link href={buildProductListUrl({ category: 'mens' })}>Products</Link>
```

### Page Components
Pages now receive props from Laravel controllers:

**File: `resources/js/pages/home/index.tsx`**
```tsx
interface HomeProps {
  featured_products?: {
    new_arrivals?: Product[];
    best_sellers?: Product[];
    trending?: Product[];
  };
  categories?: Category[];
  hero_slides?: HeroSlide[];
}

const Home: React.FC<HomeProps> = ({ featured_products, categories, hero_slides }) => {
  // Use data from Laravel or fallback to mock data
  const newArrivals = featured_products?.new_arrivals || mockData;

  return (
    <div>
      <Head title="JPATHNEC - Home" />
      <HeroSection slides={hero_slides} />
      <FeaturedProducts products={newArrivals} />
    </div>
  );
};
```

## API Services

### CartService
Handles AJAX operations with Laravel API:

**File: `resources/js/services/CartService.ts`**
```typescript
class CartService {
  static async addToCart(item: CartItem): Promise<ApiResponse> {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      },
      body: JSON.stringify(item),
    });
    return response.json();
  }
}
```

## Data Flow

### 1. Page Load
```
User visits URL → Laravel Route → Controller → Inertia::render() → React Component
```

### 2. Navigation
```
User clicks Link → Inertia.js → Laravel Route → Controller → New Page Component
```

### 3. AJAX Operations
```
User action → CartService.addToCart() → Laravel API → JSON Response → Update UI
```

## Migration Steps

### 1. Update Existing Components
- Replace React Router imports with Inertia.js
- Update navigation links to use route helpers
- Add TypeScript interfaces for Laravel data

### 2. Add Laravel Controllers
- Create controllers for each page
- Add mock data (replace with database queries later)
- Return Inertia responses with data

### 3. Update Routes
- Add Laravel routes for all pages
- Add API routes for AJAX operations
- Remove React Router configuration

### 4. Test Navigation
- Verify all links work with Inertia.js
- Test AJAX operations (add to cart, etc.)
- Ensure proper data passing from Laravel to React

## Benefits

1. **SEO Friendly:** Server-side rendering with Laravel
2. **Better Performance:** No full page reloads with Inertia.js
3. **Unified Backend:** All data and business logic in Laravel
4. **Type Safety:** TypeScript interfaces for Laravel data
5. **Scalable:** Easy to add authentication, database, etc.

## Next Steps

1. Replace mock data with actual database queries
2. Add user authentication integration
3. Implement proper cart/session management
4. Add error handling and loading states
5. Set up proper SEO meta tags and sitemap
