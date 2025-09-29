<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Product;
use App\Models\Category;
use App\Models\CartItem;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Log;

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
        $newArrivals = Product::with(['images', 'category'])
            ->active()
            ->new()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'price' => (float) $product->price,
                    'original_price' => $product->compare_price ? (float) $product->compare_price : null,
                    'rating' => (float) $product->rating,
                    'review_count' => $product->review_count,
                    'image' => $product->primary_image_url ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'is_new' => $product->is_new,
                    'discount' => $product->discount_percentage,
                    'colors' => collect($product->colors ?? [])->pluck('hex')->toArray(),
                    'is_wishlisted' => false, // TODO: Check if user has wishlisted
                    'slug' => $product->slug,
                ];
            });

        $bestSellers = Product::with(['images', 'category'])
            ->active()
            ->bestseller()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'price' => (float) $product->price,
                    'original_price' => $product->compare_price ? (float) $product->compare_price : null,
                    'rating' => (float) $product->rating,
                    'review_count' => $product->review_count,
                    'image' => $product->primary_image_url ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'is_new' => $product->is_new,
                    'discount' => $product->discount_percentage,
                    'colors' => collect($product->colors ?? [])->pluck('hex')->toArray(),
                    'is_wishlisted' => false, // TODO: Check if user has wishlisted
                    'slug' => $product->slug,
                ];
            });

        $featured = Product::with(['images', 'category'])
            ->active()
            ->featured()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'price' => (float) $product->price,
                    'original_price' => $product->compare_price ? (float) $product->compare_price : null,
                    'rating' => (float) $product->rating,
                    'review_count' => $product->review_count,
                    'image' => $product->primary_image_url ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'is_new' => $product->is_new,
                    'discount' => $product->discount_percentage,
                    'colors' => collect($product->colors ?? [])->pluck('hex')->toArray(),
                    'is_wishlisted' => false, // TODO: Check if user has wishlisted
                    'slug' => $product->slug,
                ];
            });

        return [
            'new_arrivals' => $newArrivals,
            'best_sellers' => $bestSellers,
            'trending' => $featured, // Using featured as trending for now
        ];
    }

    /**
     * Get categories data
     */
    private function getCategories(): array
    {
        return Category::active()
            ->parents()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->slug,
                    'name' => $category->name,
                    'description' => $category->description ?? "Discover premium {$category->name}",
                    'image' => $category->image ?? ($category->gender === 'men'
                        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
                        : 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=600&h=400&fit=crop'),
                    'product_count' => $category->activeProducts()->count(),
                ];
            })->toArray();
    }

    /**
     * Get hero slides data from database
     */
    private function getHeroSlides(): array
    {
        $heroImages = ProductImage::where('type', 'hero')
            ->orderBy('sort_order')
            ->get();

        $slides = [];

        foreach ($heroImages as $image) {
            $slideData = [
                'id' => $image->id,
                'image' => asset($image->image_path),
                'alt' => $image->alt_text,
            ];

            // Set slide content based on identifier
            switch ($image->identifier) {
                case 'hero1':
                    $slideData = array_merge($slideData, [
                        'title' => 'New Autumn Collection',
                        'subtitle' => "Discover the latest trends in men's and women's fashion",
                        'description' => 'Shop premium quality apparel with up to 40% off on selected items',
                        'cta' => 'Shop Now',
                        'link' => '/product-list?filter=new-arrivals',
                        'badge' => 'New Collection'
                    ]);
                    break;

                case 'hero2':
                    $slideData = array_merge($slideData, [
                        'title' => 'Corporate Essentials',
                        'subtitle' => 'Professional attire for the modern workplace',
                        'description' => 'Elevate your professional wardrobe with our premium corporate collection',
                        'cta' => 'Explore Corporate',
                        'link' => '/product-list?category=mens',
                        'badge' => 'Professional'
                    ]);
                    break;

                case 'hero3':
                    $slideData = array_merge($slideData, [
                        'title' => 'Footwear Sale',
                        'subtitle' => 'Step into comfort and style',
                        'description' => 'Premium shoes, sneakers, and sandals with free shipping on orders over $75',
                        'cta' => 'Shop Footwear',
                        'link' => '/product-list?category=womens',
                        'badge' => 'Free Shipping'
                    ]);
                    break;
            }

            $slides[] = $slideData;
        }

        return $slides;
    }

    /**
     * Get cart item count for a user
     */
    private function getCartCount($userId): int
    {
        return CartItem::where('user_id', $userId)->sum('quantity');
    }
}
