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
        Schema::table('orders', function (Blueprint $table) {
            // Add minimal tracking fields to existing orders table
            $table->timestamp('status_updated_at')->nullable()->after('delivered_at');
            $table->string('current_location')->nullable()->after('tracking_number');
            $table->text('status_description')->nullable()->after('admin_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['status_updated_at', 'current_location', 'status_description']);
        });
    }
};
