<?php

namespace App\Http\Middleware;

use App\Models\UserDevice;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\Response;

class TrackUserDevice
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $this->trackDevice($request);
        }

        return $next($request);
    }

    /**
     * Track the user's device.
     */
    private function trackDevice(Request $request): void
    {
        $agent = new Agent();
        $user = Auth::user();
        $userAgent = $request->userAgent();
        $ipAddress = $request->ip();

        // Create a unique identifier for this device
        $deviceName = $this->generateDeviceName($agent);
        
        // Check if this device already exists
        $device = UserDevice::where('user_id', $user->id)
            ->where('ip_address', $ipAddress)
            ->where('user_agent', $userAgent)
            ->first();

        if ($device) {
            // Update existing device
            $device->update([
                'last_used_at' => now(),
                'is_current' => true,
            ]);
        } else {
            // Create new device record
            UserDevice::create([
                'user_id' => $user->id,
                'device_name' => $deviceName,
                'browser' => $agent->browser() . ' ' . $agent->version($agent->browser()),
                'platform' => $agent->platform() . ' ' . $agent->version($agent->platform()),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'is_current' => true,
                'last_used_at' => now(),
            ]);
        }

        // Mark all other devices as not current
        UserDevice::where('user_id', $user->id)
            ->where('ip_address', '!=', $ipAddress)
            ->orWhere('user_agent', '!=', $userAgent)
            ->update(['is_current' => false]);
    }

    /**
     * Generate a device name based on the user agent.
     */
    private function generateDeviceName(Agent $agent): string
    {
        $deviceType = 'Computer';
        
        if ($agent->isPhone()) {
            $deviceType = 'Phone';
        } elseif ($agent->isTablet()) {
            $deviceType = 'Tablet';
        }

        $browser = $agent->browser();
        $platform = $agent->platform();

        return "{$deviceType} ({$browser} on {$platform})";
    }
}
