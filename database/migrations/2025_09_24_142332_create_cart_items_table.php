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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable(); // For guest users
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity');
            $table->string('size', 10)->nullable();
            $table->string('color', 20)->nullable();
            $table->decimal('price', 10, 2); // Store price at time of adding to cart
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['session_id']);
            $table->index(['product_id']);

            // Create a composite index instead of unique constraint
            $table->index(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
