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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            // Product details at time of purchase (for historical accuracy)
            $table->string('product_name');
            $table->string('product_sku');
            $table->text('product_description')->nullable();
            $table->string('product_image')->nullable();

            // Order item details
            $table->integer('quantity');
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);

            $table->timestamps();

            $table->index(['order_id']);
            $table->index(['product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
