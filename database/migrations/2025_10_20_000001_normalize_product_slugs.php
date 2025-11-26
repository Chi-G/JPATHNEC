<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration will:
     *  - Fill empty/null slugs using Str::slug(name)
     *  - Normalize duplicates by appending -{id}
     *  - Add a unique index on slug
     */
    public function up(): void
    {
        // 1) Fill empty slugs
        DB::table('products')->whereNull('slug')->orWhere('slug', '')->chunkById(100, function ($products) {
            foreach ($products as $p) {
                $slug = Str::slug($p->name ?: "product-{$p->id}");
                DB::table('products')->where('id', $p->id)->update(['slug' => $slug]);
            }
        });

        // 2) Deduplicate existing slugs if necessary
        $all = DB::table('products')->select('id', 'slug')->get();
        $seen = [];
        foreach ($all as $p) {
            $slug = $p->slug;
            if (!isset($seen[$slug])) {
                $seen[$slug] = [$p->id];
                continue;
            }
            // Duplicate found: append -{id}
            $newSlug = $slug . '-' . $p->id;
            DB::table('products')->where('id', $p->id)->update(['slug' => $newSlug]);
            $seen[$slug][] = $p->id;
        }

        // 3) Add unique index if it doesn't already exist
        if (!Schema::hasIndex('products', 'products_slug_unique')) {
            Schema::table('products', function (Blueprint $table) {
                // make sure column is not nullable
                $table->string('slug')->nullable(false)->change();
                $table->unique('slug');
            });
        }
    }

    public function down(): void
    {
        // Only drop the unique index if it exists
        if (Schema::hasIndex('products', 'products_slug_unique')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropUnique(['slug']);
            });
        }

        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->change();
        });
    }
};
