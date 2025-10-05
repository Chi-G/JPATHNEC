<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'product_name',
        'product_sku',
        'product_image',
        'product_options',
        'size',
        'color',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'product_options' => 'array',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            // Calculate total price if not set
            if (empty($orderItem->total_price)) {
                $orderItem->total_price = $orderItem->quantity * $orderItem->unit_price;
            }

            // Store product details for historical purposes
            if ($orderItem->product && empty($orderItem->product_name)) {
                $orderItem->product_name = $orderItem->product->name;
                $orderItem->product_sku = $orderItem->product->sku;
                $orderItem->product_image = $orderItem->product->primary_image_url;
            }
        });
    }

    /**
     * Get the order that owns the item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product associated with the item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get formatted unit price.
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return '₦' . number_format((float) $this->unit_price, 2);
    }

    /**
     * Get formatted total price.
     */
    public function getFormattedTotalPriceAttribute(): string
    {
        return '₦' . number_format((float) $this->total_price, 2);
    }

    /**
     * Get product image URL.
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->product_image) {
            // If product_image is already a full URL, return it
            if (filter_var($this->product_image, FILTER_VALIDATE_URL)) {
                return $this->product_image;
            }
            // If it's a storage path, add the storage URL
            if (strpos($this->product_image, 'storage/') === 0) {
                return asset($this->product_image);
            }
            // If it's just a filename, add storage path
            return asset('storage/' . $this->product_image);
        }

        // Fallback to current product image or placeholder
        return $this->product?->primary_image_url ?? asset('images/placeholder-product.svg');
    }

    /**
     * Calculate and update total price.
     */
    public function calculateTotal(): void
    {
        $this->update([
            'total_price' => $this->quantity * $this->unit_price
        ]);
    }
}
