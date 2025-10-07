<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'session_id',
        'order_number',
        'status',
        'total_amount',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'currency',
        'shipping_address',
        'billing_address',
        'email',
        'phone',
        'payment_method',
        'payment_reference',
        'payment_status',
        'shipping_method',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'notes',
        'admin_notes',
        'status_updated_at',
        'current_location',
        'status_description',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'status_updated_at' => 'datetime',
        'total_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'JP-' . strtoupper(Str::random(8));
            }
            if (empty($order->currency)) {
                $order->currency = '₦'; // Nigerian Naira as default
            }
        });
    }

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    /**
     * Get the order items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by payment status.
     */
    public function scopePaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }

    /**
     * Check if order is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if order is processing.
     */
    public function isProcessing(): bool
    {
        return $this->status === 'processing';
    }

    /**
     * Check if order is shipped.
     */
    public function isShipped(): bool
    {
        return $this->status === 'shipped';
    }

    /**
     * Check if order is delivered.
     */
    public function isDelivered(): bool
    {
        return $this->status === 'delivered';
    }

    /**
     * Check if order is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if payment is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Get formatted total amount.
     */
    public function getFormattedTotalAttribute(): string
    {
        $currency = $this->currency ?? '$';
        return $currency . number_format((float) $this->total_amount, 2);
    }

    /**
     * Get total item count.
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items()->sum('quantity');
    }

    /**
     * Update order status.
     */
    public function updateStatus(string $status, ?string $description = null, ?string $notes = null, ?string $location = null, ?string $updatedBy = null): void
    {
        $this->update([
            'status' => $status,
            'status_updated_at' => now(),
            'current_location' => $location,
            'status_description' => $description ?? $this->getDefaultStatusDescription($status),
        ]);

        // Update specific timestamp fields based on status
        if ($status === 'shipped' && !$this->shipped_at) {
            $this->update(['shipped_at' => now()]);
        } elseif ($status === 'delivered' && !$this->delivered_at) {
            $this->update(['delivered_at' => now()]);
        }
    }

    /**
     * Get order status history using existing fields.
     */
    public function getStatusHistory(): array
    {
        $history = [];

        // Add creation status
        $history[] = [
            'status' => 'pending',
            'timestamp' => $this->created_at,
            'description' => 'Order placed',
        ];

        // Add shipped status if available
        if ($this->shipped_at) {
            $history[] = [
                'status' => 'shipped',
                'timestamp' => $this->shipped_at,
                'description' => 'Order shipped' . ($this->tracking_number ? " (Tracking: {$this->tracking_number})" : ''),
            ];
        }

        // Add delivered status if available
        if ($this->delivered_at) {
            $history[] = [
                'status' => 'delivered',
                'timestamp' => $this->delivered_at,
                'description' => 'Order delivered',
            ];
        }

        // Add current status if different and status_updated_at exists
        if ($this->status_updated_at && !in_array($this->status, ['pending', 'shipped', 'delivered'])) {
            $history[] = [
                'status' => $this->status,
                'timestamp' => $this->status_updated_at,
                'description' => $this->status_description ?? ucfirst($this->status),
                'location' => $this->current_location,
            ];
        }

        return collect($history)->sortBy('timestamp')->values()->toArray();
    }

    /**
     * Get progress percentage for visual display.
     */
    public function getProgressPercentage(): int
    {
        return match($this->status) {
            'pending' => 25,
            'processing' => 50,
            'shipped' => 75,
            'delivered' => 100,
            'cancelled', 'refunded' => 0,
            default => 25,
        };
    }

    /**
     * Get default status description.
     */
    private function getDefaultStatusDescription(string $status): string
    {
        return match ($status) {
            'pending' => 'Order received and awaiting payment confirmation',
            'processing' => 'Order is being prepared for shipment',
            'shipped' => 'Order has been shipped and is on its way',
            'delivered' => 'Order has been successfully delivered',
            'cancelled' => 'Order has been cancelled',
            default => 'Order status updated',
        };
    }

    /**
     * Calculate order totals.
     */
    public function calculateTotals(): void
    {
        $subtotal = $this->items->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });

        $taxRate = 0.10; // 10% tax
        $taxAmount = $subtotal * $taxRate;

        $shippingAmount = $subtotal > 50 ? 0 : 5.99; // Free shipping over $50

        $total = $subtotal + $taxAmount + $shippingAmount - ($this->discount_amount ?? 0);

        $this->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $total,
        ]);
    }
}
