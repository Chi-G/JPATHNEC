<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroSlide;

class HeroSlideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slides = [
            [
                'title' => 'New Autumn Collection',
                'subtitle' => "Discover the latest trends in men's and women's fashion",
                'description' => 'Shop premium quality apparel with up to 40% off on selected items',
                'image' => 'images/hero/hero1.jpg',
                'cta' => 'Shop Now',
                'link' => '/product-list?filter=new-arrivals',
                'badge' => 'New Collection',
                'alt_text' => 'New Autumn Collection - Premium fashion trends',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Corporate Essentials',
                'subtitle' => 'Professional attire for the modern workplace',
                'description' => 'Elevate your professional wardrobe with our premium corporate collection',
                'image' => 'images/hero/hero2.jpg',
                'cta' => 'Explore Corporate',
                'link' => '/product-list?category=mens',
                'badge' => 'Professional',
                'alt_text' => 'Corporate Essentials - Professional workplace attire',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Footwear Sale',
                'subtitle' => 'Step into comfort and style',
                'description' => 'Premium shoes, sneakers, and sandals with free shipping on orders over $75',
                'image' => 'images/hero/hero3.jpg',
                'cta' => 'Shop Footwear',
                'link' => '/product-list?category=womens',
                'badge' => 'Free Shipping',
                'alt_text' => 'Footwear Sale - Premium shoes and sneakers',
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($slides as $slide) {
            HeroSlide::updateOrCreate(
                ['title' => $slide['title']],
                $slide
            );
        }
    }
}
