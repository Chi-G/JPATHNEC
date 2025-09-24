/**
 * Route helper functions for Inertia.js navigation
 * This replaces React Router with Laravel route-based navigation
 */

// Route names that correspond to Laravel routes
export const routes = {
  // Public routes
  home: '/',
  productList: '/product-list',
  productDetail: '/product-detail',
  shoppingCart: '/shopping-cart',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/success',

  // Auth routes
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
} as const;

// Helper function to build product list URLs with filters
export const buildProductListUrl = (params?: {
  category?: string;
  filter?: string;
  search?: string;
}): string => {
  const url = new URL(routes.productList, window.location.origin);

  if (params?.category) {
    url.searchParams.set('category', params.category);
  }

  if (params?.filter) {
    url.searchParams.set('filter', params.filter);
  }

  if (params?.search) {
    url.searchParams.set('search', params.search);
  }

  return url.pathname + url.search;
};

// Helper function to build product detail URLs
export const buildProductDetailUrl = (productId: string | number): string => {
  return `${routes.productDetail}?id=${productId}`;
};

// API endpoints for AJAX calls
export const apiRoutes = {
  cartAdd: '/api/cart/add',
  cartUpdate: (itemId: string | number) => `/api/cart/${itemId}`,
  cartRemove: (itemId: string | number) => `/api/cart/${itemId}`,
} as const;

// Types for type safety
export type RouteKey = keyof typeof routes;
export type Route = typeof routes[RouteKey];
