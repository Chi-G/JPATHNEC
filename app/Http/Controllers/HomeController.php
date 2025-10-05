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
use App\Models\HeroSlide;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    /**
     * Display the home page
     */
    public function index(Request $request): Response
    {
        // Get cart count for authenticated users
        $cartCount = Auth::check() ? $this->getCartCount(Auth::id()) : 0;

        return Inertia::render('home/index', [
            'auth' => [
                'user' => Auth::user() ? [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ] : null,
            ],
            'cartCount' => $cartCount,
            'featured_products' => $this->getFeaturedProducts($request),
            'categories' => $this->getCategories(),
            'hero_slides' => $this->getHeroSlides(),
            'verified' => $request->query('verified') === '1',
        ]);
    }

    /**
     * Get featured products data
     */
    private function getFeaturedProducts(Request $request): array
    {
        $user = $request->user();

        $mapProduct = function ($product) use ($user) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'brand' => $product->brand,
                'category' => $product->category ? $product->category->name : 'Uncategorized',
                'price' => (float) $product->price,
                'originalPrice' => $product->compare_price ? (float) $product->compare_price : null,
                'rating' => (float) ($product->rating ?? 0),
                'reviewCount' => $product->review_count ?? 0,
                'image' => $product->primary_image_url ?? asset('images/placeholder-product.jpg'),
                'isNew' => $product->is_new,
                'isBestseller' => $product->is_bestseller,
                'discount' => $product->discount_percentage,
                'colors' => $product->colors ?? [],
                'sizes' => $product->sizes ?? [],
                'isWishlisted' => $user ? $product->wishlistUsers()->where('user_id', $user->id)->exists() : false,
                'slug' => $product->slug,
            ];
        };

        $newArrivals = Product::with(['images', 'category'])
            ->active()
            ->new()
            ->limit(8)
            ->get()
            ->map($mapProduct);

        $bestSellers = Product::with(['images', 'category'])
            ->active()
            ->bestseller()
            ->orderBy('sales_count', 'desc')
            ->limit(8)
            ->get()
            ->map($mapProduct);

        $trending = Product::with(['images', 'category'])
            ->active()
            ->orderBy('view_count', 'desc')
            ->limit(8)
            ->get()
            ->map($mapProduct);

        return [
            'new_arrivals' => $newArrivals,
            'best_sellers' => $bestSellers,
            'trending' => $trending,
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
                    'image' => $category->image ? asset('storage/' . $category->image) : ($category->gender === 'men'
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
        return HeroSlide::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($slide) {
                return [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'subtitle' => $slide->subtitle,
                    'description' => $slide->description,
                    'image' => asset($slide->image),
                    'cta' => $slide->cta,
                    'link' => $slide->link,
                    'badge' => $slide->badge,
                    'alt' => $slide->alt_text,
                ];
            })->toArray();
    }

    /**
     * Get cart item count for a user
     */
    private function getCartCount($userId): int
    {
        return CartItem::where('user_id', $userId)->sum('quantity');
    }
}
