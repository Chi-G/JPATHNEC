<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        
        if (strpos($this->image_path, 'products/') === 0) {
            return asset('storage/' . $this->image_path);
        }
        
        return url($this->image_path);
    }

    /**
     * Get product image URL with fallback.
     */
    public function getImageUrlAttribute(): string
    {
        if (strpos($this->image_path, 'hero/') === 0 || strpos($this->image_path, 'products/') === 0) {
            return asset('storage/' . $this->image_path);
        }
        
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        
        return url($this->image_path);
    }

    /**
     * Scope to get hero images.
     */
    public function scopeHero($query)
    {
        return $query->where('type', 'hero')->orderBy('sort_order');
    }

    /**
     * Ensure image_path is normalized to storage 'products/' and move files from
     * private disk to public/products if necessary.
     */
    public function setImagePathAttribute($value)
    {
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            $this->attributes['image_path'] = $value;
            return;
        }

        if (strpos($value, 'products/') === 0 || strpos($value, 'hero/') === 0) {
            $this->attributes['image_path'] = $value;
            return;
        }

        if (Storage::disk('public')->exists($value)) {
            $this->attributes['image_path'] = $value;
            return;
        }

        if (Storage::disk('local')->exists($value) || Storage::disk('local')->exists('private/' . $value)) {
            $source = Storage::disk('local')->exists($value) ? $value : 'private/' . $value;
            $basename = basename($value);
            $dest = 'products/' . $basename;

            try {
                $contents = Storage::disk('local')->get($source);
                Storage::disk('public')->put($dest, $contents);
                Storage::disk('local')->delete($source);
                $this->attributes['image_path'] = $dest;
                return;
            } catch (\Throwable $e) {
                $this->attributes['image_path'] = $value;
                return;
            }
        }

        $this->attributes['image_path'] = $value;
    }
}
 