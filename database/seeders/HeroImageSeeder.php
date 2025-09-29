<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class HeroImageSeeder extends Seeder
{
    public function run()
    {
        $heroImages = [
            [
                'identifier' => 'hero1',
                'image_path' => 'images/hero/hero1.jpg',
                'alt_text' => 'New Autumn Collection - Premium fashion trends',
                'sort_order' => 1,
            ],
            [
                'identifier' => 'hero2',
                'image_path' => 'images/hero/hero2.jpg',
                'alt_text' => 'Corporate Essentials - Professional workplace attire',
                'sort_order' => 2,
            ],
            [
                'identifier' => 'hero3',
                'image_path' => 'images/hero/hero3.jpg',
                'alt_text' => 'Footwear Sale - Premium shoes and sneakers',
                'sort_order' => 3,
            ]
        ];

        $this->command->info('Creating hero image database records...');

        foreach ($heroImages as $imageData) {
            // Check if the local file exists
            $publicPath = public_path($imageData['image_path']);

            if (!file_exists($publicPath)) {
                $this->command->warn("Warning: Image file not found at {$publicPath}");
                continue;
            }

            // Create or update database record
            ProductImage::updateOrCreate(
                [
                    'product_id' => null,
                    'type' => 'hero',
                    'identifier' => $imageData['identifier']
                ],
                [
                    'image_path' => $imageData['image_path'],
                    'alt_text' => $imageData['alt_text'],
                    'is_primary' => false,
                    'sort_order' => $imageData['sort_order']
                ]
            );

            $this->command->info("✓ Created database record for {$imageData['identifier']}");
        }

        $this->command->info('Hero images seeding completed!');
    }
}
