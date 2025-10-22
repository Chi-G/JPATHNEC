import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Color {
    name: string;
    hex: string;
}

export interface Product {
    id: string | number;
    name?: string;
    brand?: string;
    price?: number;
    originalPrice?: number;
    original_price?: number;
    image?: string;
    description?: string;
    category?: string;
    isNew?: boolean;
    is_new?: boolean;
    isBestseller?: boolean;
    is_bestseller?: boolean;
    discount?: number;
    rating?: number;
    reviewCount?: number;
    review_count?: number;
    isWishlisted?: boolean;
    colors?: Color[];
    sizes?: string[];
    stock?: number;
    sku?: string;
    slug?: string;
    featured?: boolean;
    selectedColor?: string;
    selectedSize?: string;
    selected_size?: string;
    created_at?: string;
    updated_at?: string;
    material?: string;
    fit?: string;
    origin?: string;
    sizeChart?: Array<{
      size?: string;
      chest?: string | number | null;
      waist?: string | number | null;
      length?: string | number | null;
    }>;
    careInstructions?: string[];
    shippingOptions?: ShippingOption[];
    returnShippingFee?: number | null;
    return_shipping_fee?: number | null;
}

export interface Category {
    id: string | number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    parent_id?: number | null;
    sort_order: number;
    is_active: boolean;
    gender?: 'men' | 'women' | 'unisex' | null;
    created_at: string;
    updated_at: string;
    product_count?: number;
}


// Checkout Types
export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  size?: string;
  color?: string;
  unit_price: number;
  total_price: number;
}

export interface CheckoutFormData {
  shipping?: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    country?: string;
    saveAddress?: boolean;
  };
  delivery?: {
    option?: string;
    name?: string;
    price?: number;
    estimatedDate?: string;
  };
  payment?: {
    method?: string;
    cardNumber?: string;
    cardName?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    saveCard?: boolean;
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  item_count: number;
}
