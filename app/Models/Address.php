<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'first_name',
        'last_name',
        'company',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($address) {
            // If this is the first address for the user, make it default
            if (!static::where('user_id', $address->user_id)->where('type', $address->type)->exists()) {
                $address->is_default = true;
            }
        });

        static::updating(function ($address) {
            // If setting as default, unset other defaults of the same type
            if ($address->is_default && $address->isDirty('is_default')) {
                static::where('user_id', $address->user_id)
                    ->where('type', $address->type)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }
        });
    }

    /**
     * Get the user that owns the address.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get default addresses.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get formatted address.
     */
    public function getFormattedAddressAttribute(): string
    {
        $parts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state . ' ' . $this->postal_code,
            $this->country,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Get single line address.
     */
    public function getSingleLineAddressAttribute(): string
    {
        $parts = [
            $this->address_line_1,
            $this->city,
            $this->state,
            $this->postal_code,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Set as default address.
     */
    public function setAsDefault(): void
    {
        // Unset other defaults of the same type
        static::where('user_id', $this->user_id)
            ->where('type', $this->type)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    /**
     * Convert to array format for orders.
     */
    public function toOrderFormat(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'company' => $this->company,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'phone' => $this->phone,
        ];
    }

    /**
     * Validate address completeness.
     */
    public function isComplete(): bool
    {
        $required = ['first_name', 'last_name', 'address_line_1', 'city', 'state', 'postal_code', 'country'];

        foreach ($required as $field) {
            if (empty($this->{$field})) {
                return false;
            }
        }

        return true;
    }
}
