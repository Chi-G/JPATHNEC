<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\ProductImage;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample product images to download and store locally
        $productImages = [
            1 => [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=800&fit=crop',
            ],
            2 => [
                'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
            ],
            3 => [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop',
            ],
            4 => [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
            ],
            5 => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            ],
        ];

        foreach ($productImages as $productId => $images) {
            $product = Product::find($productId);
            if (!$product) continue;

            // Clear existing images for this product
            ProductImage::where('product_id', $productId)->delete();

            foreach ($images as $index => $imageUrl) {
                $this->downloadAndStoreImage($product, $imageUrl, $index);
            }
        }
    }

    /**
     * Download image from URL and store locally
     */
    private function downloadAndStoreImage(Product $product, string $imageUrl, int $index): void
    {
        try {
            // Download the image
            $imageContents = file_get_contents($imageUrl);
            
            if ($imageContents === false) {
                $this->command->warn("Failed to download image: {$imageUrl}");
                return;
            }

            // Generate filename
            $filename = "product-{$product->id}-image-" . ($index + 1) . '.jpg';
            $filePath = "products/{$filename}";

            // Store the image
            Storage::disk('public')->put($filePath, $imageContents);

            // Create database record
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $filePath,
                'alt_text' => $product->name . ' - Image ' . ($index + 1),
                'is_primary' => $index === 0, // First image is primary
                'sort_order' => $index + 1,
            ]);

            $this->command->info("Downloaded and stored: {$filename}");

        } catch (\Exception $e) {
            $this->command->error("Error processing {$imageUrl}: " . $e->getMessage());
        }
    }
}