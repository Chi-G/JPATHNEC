<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page
     */
    public function index(Request $request): Response
    {
        // Get cart count for authenticated users
        $cartCount = 0;
        if (Auth::check()) {
            // Replace with actual cart count logic from your database
            $cartCount = $this->getCartCount(Auth::id());
        }

        return Inertia::render('home/index', [
            'auth' => [
                'user' => Auth::user()
            ],
            'cartCount' => $cartCount,
            'featured_products' => $this->getFeaturedProducts(),
            'categories' => $this->getCategories(),
            'hero_slides' => $this->getHeroSlides(),
        ]);
    }

    /**
     * Get featured products data
     */
    private function getFeaturedProducts(): array
    {
        // Mock data - replace with actual database queries
        return [
            'new_arrivals' => [
                [
                    'id' => 1,
                    'name' => 'Premium Cotton T-Shirt',
                    'category' => "Men's Clothing",
                    'price' => 29.99,
                    'original_price' => 39.99,
                    'rating' => 4.5,
                    'review_count' => 128,
                    'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'is_new' => true,
                    'discount' => 25,
                    'colors' => ['#000000', '#FFFFFF', '#1E3A8A', '#10B981'],
                    'is_wishlisted' => false
                ],
                // Add more products...
            ],
            'best_sellers' => [
                // Best selling products...
            ],
            'trending' => [
                // Trending products...
            ]
        ];
    }

    /**
     * Get categories data
     */
    private function getCategories(): array
    {
        return [
            [
                'id' => 'mens',
                'name' => "Men's Collection",
                'description' => "Discover premium men's apparel and footwear",
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
                'product_count' => 500
            ],
            [
                'id' => 'womens',
                'name' => "Women's Collection",
                'description' => "Elegant women's fashion and accessories",
                'image' => 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=600&h=400&fit=crop',
                'product_count' => 450
            ]
        ];
    }

    /**
     * Get hero slides data
     */
    private function getHeroSlides(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'New Autumn Collection',
                'subtitle' => "Discover the latest trends in men's and women's fashion",
                'description' => 'Shop premium quality apparel with up to 40% off on selected items',
                'image' => '/photo1.jpg',
                'cta' => 'Shop Now',
                'link' => '/product-list?category=new-arrivals',
                'badge' => 'New Collection'
            ],
            [
                'id' => 2,
                'title' => 'Corporate Essentials',
                'subtitle' => 'Professional attire for the modern workplace',
                'description' => 'Elevate your professional wardrobe with our premium corporate collection',
                'image' => '/photo2.jpg',
                'cta' => 'Explore Corporate',
                'link' => '/product-list?category=corporate',
                'badge' => 'Professional'
            ],
            [
                'id' => 3,
                'title' => 'Footwear Sale',
                'subtitle' => 'Step into comfort and style',
                'description' => 'Premium shoes, sneakers, and sandals with free shipping on orders over $75',
                'image' => '/photo3.jpg',
                'cta' => 'Shop Footwear',
                'link' => '/product-list?category=footwear',
                'badge' => 'Free Shipping'
            ]
        ];
    }

    /**
     * Get cart item count for a user
     */
    private function getCartCount($userId): int
    {
        // Mock data - replace with actual cart count logic from your database
        // Example: return CartItem::where('user_id', $userId)->sum('quantity');
        return rand(0, 5); // Random count for demo purposes
    }
}
