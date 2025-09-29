<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main categories
        $menCategory = Category::create([
            'name' => "Men's Clothing",
            'slug' => 'mens',
            'description' => 'Quality clothing for men',
            'gender' => 'men',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $womenCategory = Category::create([
            'name' => "Women's Clothing",
            'slug' => 'womens',
            'description' => 'Quality clothing for women',
            'gender' => 'women',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create men's subcategories
        $menSubcategories = [
            ['name' => 'T-Shirts', 'slug' => 'mens-tshirts', 'sort_order' => 1],
            ['name' => 'Polos', 'slug' => 'mens-polos', 'sort_order' => 2],
            ['name' => 'Corporate Shirts', 'slug' => 'mens-corporate', 'sort_order' => 3],
            ['name' => 'Trousers', 'slug' => 'mens-trousers', 'sort_order' => 4],
            ['name' => 'Pants', 'slug' => 'mens-pants', 'sort_order' => 5],
            ['name' => 'Shoes', 'slug' => 'mens-shoes', 'sort_order' => 6],
            ['name' => 'Sneakers', 'slug' => 'mens-sneakers', 'sort_order' => 7],
            ['name' => 'Sandals', 'slug' => 'mens-sandals', 'sort_order' => 8],
        ];

        foreach ($menSubcategories as $subcategory) {
            Category::create([
                'name' => $subcategory['name'],
                'slug' => $subcategory['slug'],
                'parent_id' => $menCategory->id,
                'gender' => 'men',
                'is_active' => true,
                'sort_order' => $subcategory['sort_order'],
            ]);
        }

        // Create women's subcategories
        $womenSubcategories = [
            ['name' => 'T-Shirts', 'slug' => 'womens-tshirts', 'sort_order' => 1],
            ['name' => 'Polos', 'slug' => 'womens-polos', 'sort_order' => 2],
            ['name' => 'Corporate Shirts', 'slug' => 'womens-corporate', 'sort_order' => 3],
            ['name' => 'Trousers', 'slug' => 'womens-trousers', 'sort_order' => 4],
            ['name' => 'Pants', 'slug' => 'womens-pants', 'sort_order' => 5],
            ['name' => 'Shoes', 'slug' => 'womens-shoes', 'sort_order' => 6],
            ['name' => 'Sneakers', 'slug' => 'womens-sneakers', 'sort_order' => 7],
            ['name' => 'Sandals', 'slug' => 'womens-sandals', 'sort_order' => 8],
            ['name' => 'Slippers', 'slug' => 'womens-slippers', 'sort_order' => 9],
        ];

        foreach ($womenSubcategories as $subcategory) {
            Category::create([
                'name' => $subcategory['name'],
                'slug' => $subcategory['slug'],
                'parent_id' => $womenCategory->id,
                'gender' => 'women',
                'is_active' => true,
                'sort_order' => $subcategory['sort_order'],
            ]);
        }
    }
}
 