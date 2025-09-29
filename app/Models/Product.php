<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'compare_price',
        'cost_price',
        'stock_quantity',
        'track_stock',
        'is_active',
        'is_featured',
        'is_new',
        'is_bestseller',
        'brand',
        'material',
        'fit',
        'origin',
        'sizes',
        'colors',
        'features',
        'care_instructions',
        'size_chart',
        'meta_title',
        'meta_description',
        'tags',
        'category_id',
        'rating',
        'review_count',
        'sales_count',
        'view_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_bestseller' => 'boolean',
        'track_stock' => 'boolean',
        'sizes' => 'array',
        'colors' => 'array',
        'features' => 'array',
        'care_instructions' => 'array',
        'size_chart' => 'array',
        'tags' => 'array',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = strtoupper(Str::random(8));
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the product images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Get the primary image.
     */
    public function primaryImage(): HasMany
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true);
    }

    /**
     * Get cart items for this product.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get order items for this product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get users who wishlisted this product.
     */
    public function wishlistUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    /**
     * Scope to get only active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to get new products.
     */
    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    /**
     * Scope to get bestseller products.
     */
    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    /**
     * Scope to filter by category.
     */
    public function scopeInCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope to search products.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('short_description', 'like', "%{$search}%")
              ->orWhere('brand', 'like', "%{$search}%")
              ->orWhere('sku', 'like', "%{$search}%");
        });
    }

    /**
     * Get the primary image URL.
     */
    public function getPrimaryImageUrlAttribute(): ?string
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        if ($primaryImage) {
            return asset('storage/' . $primaryImage->image_path);
        }

        $firstImage = $this->images()->first();
        if ($firstImage) {
            return asset('storage/' . $firstImage->image_path);
        }

        return asset('images/placeholder-product.jpg'); // Fallback image
    }

    /**
     * Get the discount percentage.
     */
    public function getDiscountPercentageAttribute(): ?float
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100, 1);
        }
        return null;
    }

    /**
     * Check if product is in stock.
     */
    public function inStock(): bool
    {
        if (!$this->track_stock) {
            return true;
        }
        return $this->stock_quantity > 0;
    }

    /**
     * Check if product is on sale.
     */
    public function isOnSale(): bool
    {
        return $this->compare_price && $this->compare_price > $this->price;
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format((float) $this->price, 2);
    }

    /**
     * Get formatted compare price.
     */
    public function getFormattedComparePriceAttribute(): ?string
    {
        return $this->compare_price ? '$' . number_format((float) $this->compare_price, 2) : null;
    }

    /**
     * Increment view count.
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Increment sales count.
     */
    public function incrementSalesCount(int $quantity = 1): void
    {
        $this->increment('sales_count', $quantity);
    }
}
