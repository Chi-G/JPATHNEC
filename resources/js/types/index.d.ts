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
    image?: string;
    description?: string;
    category?: string;
    isNew?: boolean;
    isBestseller?: boolean;
    discount?: number;
    rating?: number;
    reviewCount?: number;
    isWishlisted?: boolean;
    colors?: Color[];
    sizes?: string[];
    stock?: number;
    sku?: string;
    slug?: string;
    featured?: boolean;
    created_at?: string;
    updated_at?: string;
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
