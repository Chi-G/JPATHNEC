<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
    ];

    /**
     * Get the user that owns the wishlist item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product in the wishlist.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Check if a product is in user's wishlist.
     */
    public static function isInWishlist($userId, $productId): bool
    {
        return static::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Add product to wishlist.
     */
    public static function addToWishlist($userId, $productId): self
    {
        return static::firstOrCreate([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }

    /**
     * Remove product from wishlist.
     */
    public static function removeFromWishlist($userId, $productId): bool
    {
        return static::where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete() > 0;
    }

    /**
     * Toggle product in wishlist.
     */
    public static function toggleWishlist($userId, $productId): array
    {
        $exists = static::isInWishlist($userId, $productId);

        if ($exists) {
            static::removeFromWishlist($userId, $productId);
            return ['action' => 'removed', 'in_wishlist' => false];
        } else {
            static::addToWishlist($userId, $productId);
            return ['action' => 'added', 'in_wishlist' => true];
        }
    }

    /**
     * Get user's wishlist count.
     */
    public static function getWishlistCount($userId): int
    {
        return static::where('user_id', $userId)->count();
    }
}
