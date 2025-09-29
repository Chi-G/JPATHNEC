<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories for relationships
        $mensTshirts = Category::where('slug', 'mens-tshirts')->first();
        $mensPolos = Category::where('slug', 'mens-polos')->first();
        $mensCorporate = Category::where('slug', 'mens-corporate')->first();
        $womensTshirts = Category::where('slug', 'womens-tshirts')->first();
        $womensShoes = Category::where('slug', 'womens-shoes')->first();

        $products = [
            [
                'name' => 'Classic Cotton T-Shirt',
                'description' => 'Comfortable 100% cotton t-shirt perfect for everyday wear. Features a regular fit and crew neck design.',
                'short_description' => 'Comfortable 100% cotton t-shirt for everyday wear.',
                'price' => 29.99,
                'compare_price' => 39.99,
                'category_id' => $mensTshirts->id,
                'brand' => 'JPATHNEC',
                'material' => '100% Cotton',
                'fit' => 'Regular',
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'colors' => [
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Navy', 'hex' => '#1E3A8A'],
                ],
                'features' => ['Pre-shrunk', 'Machine washable', 'Tagless comfort'],
                'care_instructions' => ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
                'stock_quantity' => 100,
                'is_active' => true,
                'is_featured' => true,
                'is_new' => true,
                'rating' => 4.5,
                'review_count' => 23,
                'images' => [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
                ]
            ],
            [
                'name' => 'Professional Polo Shirt',
                'description' => 'Premium pique polo shirt designed for professional settings. Moisture-wicking fabric keeps you comfortable all day.',
                'short_description' => 'Premium pique polo shirt for professional wear.',
                'price' => 45.99,
                'category_id' => $mensPolos->id,
                'brand' => 'Adidas',
                'material' => 'Cotton-Polyester Blend',
                'fit' => 'Regular',
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'colors' => [
                    ['name' => 'Navy', 'hex' => '#1E3A8A'],
                    ['name' => 'Gray', 'hex' => '#6B7280'],
                    ['name' => 'Green', 'hex' => '#10B981'],
                ],
                'features' => ['Moisture-wicking', 'Easy care', 'Professional fit'],
                'care_instructions' => ['Machine wash warm', 'Tumble dry medium', 'Iron if needed'],
                'stock_quantity' => 75,
                'is_active' => true,
                'is_bestseller' => true,
                'rating' => 4.3,
                'review_count' => 89,
                'images' => [
                    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
                ]
            ],
            [
                'name' => 'Business Formal Shirt',
                'description' => 'Crisp white dress shirt perfect for business meetings and formal occasions. Non-iron technology for easy maintenance.',
                'short_description' => 'Crisp white dress shirt with non-iron technology.',
                'price' => 89.99,
                'category_id' => $mensCorporate->id,
                'brand' => 'Hugo Boss',
                'material' => 'Cotton',
                'fit' => 'Slim',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Light Blue', 'hex' => '#3B82F6'],
                ],
                'features' => ['Non-iron', 'French cuffs', 'Spread collar'],
                'care_instructions' => ['Machine wash cold', 'Hang dry', 'Professional clean preferred'],
                'stock_quantity' => 50,
                'is_active' => true,
                'rating' => 4.7,
                'review_count' => 156,
                'images' => [
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
                ]
            ],
            [
                'name' => "Women's Vintage T-Shirt",
                'description' => 'Soft vintage-style t-shirt with a relaxed fit. Made from sustainable materials for the environmentally conscious.',
                'short_description' => 'Soft vintage-style t-shirt made from sustainable materials.',
                'price' => 34.99,
                'compare_price' => 42.99,
                'category_id' => $womensTshirts->id,
                'brand' => 'Patagonia',
                'material' => 'Organic Cotton',
                'fit' => 'Relaxed',
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Sage Green', 'hex' => '#9CA3AF'],
                    ['name' => 'Dusty Rose', 'hex' => '#F3E8FF'],
                    ['name' => 'Cream', 'hex' => '#FEF3C7'],
                ],
                'features' => ['Organic cotton', 'Fair trade', 'Vintage wash'],
                'care_instructions' => ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
                'stock_quantity' => 60,
                'is_active' => true,
                'is_new' => true,
                'rating' => 4.6,
                'review_count' => 42,
                'images' => [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                ]
            ],
            [
                'name' => "Women's Athletic Sneakers",
                'description' => 'High-performance athletic sneakers designed for comfort and style. Perfect for workouts or casual wear.',
                'short_description' => 'High-performance athletic sneakers for workouts and casual wear.',
                'price' => 129.99,
                'compare_price' => 149.99,
                'category_id' => $womensShoes->id,
                'brand' => 'Nike',
                'material' => 'Synthetic/Mesh',
                'sizes' => ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
                'colors' => [
                    ['name' => 'White/Pink', 'hex' => '#FFFFFF'],
                    ['name' => 'Black/Gray', 'hex' => '#000000'],
                    ['name' => 'Blue/White', 'hex' => '#3B82F6'],
                ],
                'features' => ['Air cushioning', 'Breathable mesh', 'Flexible outsole'],
                'care_instructions' => ['Spot clean', 'Air dry', 'Remove before washing'],
                'stock_quantity' => 40,
                'is_active' => true,
                'is_featured' => true,
                'rating' => 4.8,
                'review_count' => 234,
                'images' => [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
                ]
            ]
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            unset($productData['images']);

            $product = Product::create($productData);

            // Add images
            foreach ($images as $index => $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imageUrl,
                    'alt_text' => $product->name,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
