<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
        // Get product ID from route parameter or query
        $productId = $id ?? $request->query('id');

        return Inertia::render('product-detail/index', [
            'product' => $this->getProduct($productId),
            'related_products' => $this->getRelatedProducts($productId),
            'reviews' => $this->getProductReviews($productId),
        ]);
    }

    /**
     * Get products based on filters
     */
    private function getProducts($category = null, $filter = null, $search = null): array
    {
        // Mock data - replace with actual database queries
        $products = [
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
                'in_stock' => true,
            ],
            // Add more products...
        ];

        // Apply filters here
        return $products;
    }

    /**
     * Get single product details
     */
    private function getProduct($id): array
    {
        return [
            'id' => $id,
            'name' => 'Premium Cotton T-Shirt',
            'category' => "Men's Clothing",
            'price' => 29.99,
            'original_price' => 39.99,
            'rating' => 4.5,
            'review_count' => 128,
            'description' => 'High-quality cotton t-shirt perfect for everyday wear.',
            'images' => [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
            ],
            'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
            'colors' => ['#000000', '#FFFFFF', '#1E3A8A'],
            'in_stock' => true,
            'features' => [
                '100% Premium Cotton',
                'Machine Washable',
                'Comfortable Fit',
                'Breathable Fabric'
            ]
        ];
    }

    /**
     * Get related products
     */
    private function getRelatedProducts($productId): array
    {
        return [
            // Related products array
        ];
    }

    /**
     * Get product reviews
     */
    private function getProductReviews($productId): array
    {
        return [
            // Reviews array
        ];
    }

    /**
     * Get available categories
     */
    private function getCategories(): array
    {
        return [
            ['id' => 'mens', 'name' => "Men's Clothing"],
            ['id' => 'womens', 'name' => "Women's Clothing"],
            ['id' => 'footwear', 'name' => 'Footwear'],
            ['id' => 'corporate', 'name' => 'Corporate Wear'],
        ];
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
