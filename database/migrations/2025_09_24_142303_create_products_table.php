<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('track_stock')->default(true);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_bestseller')->default(false);

            // Product specifications
            $table->string('brand')->nullable();
            $table->string('material')->nullable();
            $table->string('fit')->nullable();
            $table->string('origin')->nullable();
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->json('features')->nullable();
            $table->json('care_instructions')->nullable();
            $table->json('size_chart')->nullable();

            // SEO and Marketing
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('tags')->nullable();

            // Relationships
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            // Performance
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->integer('view_count')->default(0);

            $table->timestamps();

            // Indexes for performance
            $table->index(['is_active', 'is_featured']);
            $table->index(['category_id', 'is_active']);
            $table->index(['price', 'is_active']);
            $table->index(['created_at', 'is_active']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
