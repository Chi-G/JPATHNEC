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
        Schema::table('addresses', function (Blueprint $table) {
            // Add the new full_name column
            $table->string('full_name')->after('type')->nullable();
        });

        // Migrate existing data: combine first_name and last_name into full_name
        DB::statement("UPDATE addresses SET full_name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))) WHERE first_name IS NOT NULL OR last_name IS NOT NULL");

        Schema::table('addresses', function (Blueprint $table) {
            // Remove the old columns
            $table->dropColumn(['first_name', 'last_name']);
            
            // Make full_name required after data migration
            $table->string('full_name')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            // Add back the old columns
            $table->string('first_name')->after('type')->nullable();
            $table->string('last_name')->after('first_name')->nullable();
        });

        // Split full_name back into first_name and last_name
        DB::statement("
            UPDATE addresses 
            SET 
                first_name = TRIM(SUBSTRING_INDEX(full_name, ' ', 1)),
                last_name = TRIM(SUBSTRING(full_name, LOCATE(' ', full_name) + 1))
            WHERE full_name IS NOT NULL
        ");

        Schema::table('addresses', function (Blueprint $table) {
            // Remove the full_name column
            $table->dropColumn('full_name');
        });
    }
};
