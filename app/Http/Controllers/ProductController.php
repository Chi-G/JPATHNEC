<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display product listing page
     */
    public function index(Request $request): Response
    {
        $category = $request->query('category');
        $filter = $request->query('filter');
        $search = $request->query('search');

        return Inertia::render('product-list/index', [
            'products' => $this->getProducts($category, $filter, $search),
            'categories' => $this->getCategories(),
            'filters' => $this->getAvailableFilters(),
            'current_category' => $category,
            'current_filter' => $filter,
            'search_query' => $search,
        ]);
    }

    /**
     * Display product detail page
     */
    public function show(Request $request, $id = null): Response
    {
        $productId = $id ?? $request->query('id');

        if (!$productId) {
            abort(404, 'Product ID not provided');
        }

        $product = $this->getProduct($productId);

        if (!$product) {
            abort(404, 'Product not found');
        }

        $user = $request->user();

        return Inertia::render('product-detail/index', [
            'product' => $product,
            'related_products' => $this->getRelatedProducts($productId),
            'reviews' => $this->getProductReviews($productId),
            'user' => $user,
            'cartCount' => $user ? $user->cartItems()->sum('quantity') : 0,
        ]);
    }

    /**
     * Get products based on filters
     */
    private function getProducts($category = null, $filter = null, $search = null): array
    {
        $query = Product::with(['images', 'category'])->active();

        // Apply category filter
        if ($category) {
            $categoryModel = Category::where('slug', $category)->first();
            if ($categoryModel) {
                $query->where('category_id', $categoryModel->id);
            }
        }

        // Apply search filter
        if ($search) {
            $query->search($search);
        }

        // Apply other filters
        if ($filter === 'new-arrivals') {
            $query->new();
        } elseif ($filter === 'bestsellers') {
            $query->bestseller();
        } elseif ($filter === 'featured') {
            $query->featured();
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate(12)
            ->through(function ($product) {
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
                    'is_bestseller' => $product->is_bestseller,
                    'discount' => $product->discount_percentage,
                    'in_stock' => $product->inStock(),
                    'slug' => $product->slug,
                    'colors' => $product->colors ?? [],
                    'sizes' => $product->sizes ?? [],
                ];
            })
            ->toArray();
    }

    /**
     * Get single product details
     */
    private function getProduct($id): ?array
    {
        Log::info("Fetching product with ID/slug: {$id}");

        $product = Product::with(['images', 'category'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->active()
            ->first();

        if (!$product) {
            Log::error("Product not found for ID or slug: {$id}");
            return null;
        }

        // Increment view count
        $product->incrementViewCount();

        // Normalize colors to match frontend expectation
        $colors = array_map(function ($color) {
            return is_array($color) ? $color['name'] : $color;
        }, $product->colors ?? []);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category ? $product->category->name : 'Uncategorized',
            'category_slug' => $product->category ? $product->category->slug : 'uncategorized',
            'price' => (float) $product->price,
            'original_price' => $product->compare_price ? (float) $product->compare_price : null,
            'rating' => (float) ($product->rating ?? 0),
            'review_count' => $product->review_count ?? 0,
            'description' => $product->description ?? '',
            'short_description' => $product->short_description ?? '',
            'images' => $product->images->isEmpty() ? [
                [
                    'url' => asset('images/placeholder-product.svg'),
                    'alt' => $product->name,
                    'is_primary' => true,
                ]
            ] : $product->images->map(function ($image) {
                return [
                    'url' => $image->image_url ?? asset('images/placeholder-product.svg'),
                    'alt' => $image->alt_text ?? 'Product Image',
                    'is_primary' => $image->is_primary ?? false,
                ];
            })->toArray(),
            'sizes' => $product->sizes ?? [],
            'colors' => $colors, // Use normalized colors
            'in_stock' => $product->inStock(),
            'stock_quantity' => $product->track_stock ? $product->stock_quantity : null,
            'features' => $product->features ?? [],
            'care_instructions' => $product->care_instructions ?? [],
            'brand' => $product->brand ?? null,
            'material' => $product->material ?? null,
            'fit' => $product->fit ?? null,
            'sku' => $product->sku ?? '',
            'slug' => $product->slug ?? '',
        ];
    }

    /**
     * Get related products
     */
    private function getRelatedProducts($productId): array
    {
        $product = Product::find($productId);
        if (!$product) {
            return [];
        }

        return Product::with(['images', 'category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $productId)
            ->active()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'original_price' => $product->compare_price ? (float) $product->compare_price : null,
                    'rating' => (float) $product->rating,
                    'review_count' => $product->review_count,
                    'image' => $product->primary_image_url ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'slug' => $product->slug,
                ];
            })
            ->toArray();
    }

    /**
     * Get product reviews
     */
    private function getProductReviews($productId): array
    {
        // TODO: Implement reviews system
        return [
            [
                'id' => 1,
                'user_name' => 'John Doe',
                'rating' => 5,
                'comment' => 'Great quality product! Very satisfied.',
                'created_at' => '2024-01-15',
            ],
            [
                'id' => 2,
                'user_name' => 'Jane Smith',
                'rating' => 4,
                'comment' => 'Good product, fast delivery.',
                'created_at' => '2024-01-10',
            ],
        ];
    }

    /**
     * Get available categories
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
                    'children' => $category->children()
                        ->active()
                        ->orderBy('sort_order')
                        ->get()
                        ->map(function ($child) {
                            return [
                                'id' => $child->slug,
                                'name' => $child->name,
                                'product_count' => $child->activeProducts()->count(),
                            ];
                        })
                        ->toArray(),
                ];
            })
            ->toArray();
    }

    /**
     * Get available filters
     */
    private function getAvailableFilters(): array
    {
        return [
            'price_ranges' => [
                ['min' => 0, 'max' => 25, 'label' => 'Under $25'],
                ['min' => 25, 'max' => 50, 'label' => '$25 - $50'],
                ['min' => 50, 'max' => 100, 'label' => '$50 - $100'],
                ['min' => 100, 'max' => null, 'label' => 'Over $100'],
            ],
            'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            'colors' => ['Black', 'White', 'Blue', 'Red', 'Green'],
        ];
    }
}
