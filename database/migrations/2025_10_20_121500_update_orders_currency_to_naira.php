<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing rows to use Naira symbol and alter default
        DB::table('orders')->whereNull('currency')->orWhere('currency', '$')->update(['currency' => '₦']);

        Schema::table('orders', function (Blueprint $table) {
            $table->string('currency', 3)->default('₦')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('orders')->where('currency', '₦')->update(['currency' => '$']);

        Schema::table('orders', function (Blueprint $table) {
            $table->string('currency', 3)->default('$')->change();
        });
    }
};
