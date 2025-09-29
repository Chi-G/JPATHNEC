<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'alt_text',
        'is_primary',
        'sort_order',
        'type',
        'identifier',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Get the product that owns this image.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope to get only primary images.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Get the full image URL.
     */
    public function getFullUrlAttribute(): string
    {
        // If it's already a full URL, return as is
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        
        // Check if it's a local storage path
        if (strpos($this->image_path, 'products/') === 0) {
            return asset('storage/' . $this->image_path);
        }
        
        // Otherwise, prepend the app URL
        return url($this->image_path);
    }

    /**
     * Get product image URL with fallback.
     */
    public function getImageUrlAttribute(): string
    {
        // For hero images or other storage paths
        if (strpos($this->image_path, 'hero/') === 0 || strpos($this->image_path, 'products/') === 0) {
            return asset('storage/' . $this->image_path);
        }
        
        // If it's already a full URL, return as is
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        
        // Otherwise, prepend the app URL
        return url($this->image_path);
    }

    /**
     * Scope to get hero images.
     */
    public function scopeHero($query)
    {
        return $query->where('type', 'hero')->orderBy('sort_order');
    }
}
 