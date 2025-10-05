<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_name',
        'browser',
        'platform',
        'ip_address',
        'user_agent',
        'is_current',
        'last_used_at',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    /**
     * Get the user that owns the device.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get a human-readable device description.
     */
    public function getDescriptionAttribute(): string
    {
        $parts = [];
        
        if ($this->browser) {
            $parts[] = $this->browser;
        }
        
        if ($this->platform) {
            $parts[] = $this->platform;
        }
        
        return implode(' on ', $parts) ?: 'Unknown Device';
    }
}
