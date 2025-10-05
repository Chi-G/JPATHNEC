<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\UserDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    /**
     * Display a listing of the user's devices.
     */
    public function index(): Response
    {
        $devices = UserDevice::where('user_id', Auth::id())
            ->orderBy('last_used_at', 'desc')
            ->get();

        $cartCount = CartItem::where('user_id', Auth::id())->sum('quantity');

        return Inertia::render('settings/devices', [
            'devices' => $devices,
            'auth' => [
                'user' => Auth::user()
            ],
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Remove a device from the user's account.
     */
    public function destroy(UserDevice $device)
    {
        // Ensure the device belongs to the authenticated user
        if ($device->user_id !== Auth::id()) {
            abort(403);
        }

        // Prevent deletion of current device
        if ($device->is_current) {
            return back()->withErrors([
                'device' => 'You cannot remove the current device.'
            ]);
        }

        $device->delete();

        return back()->with('success', 'Device removed successfully.');
    }

    /**
     * Remove all devices except the current one.
     */
    public function destroyOthers()
    {
        UserDevice::where('user_id', Auth::id())
            ->where('is_current', false)
            ->delete();

        return back()->with('success', 'All other devices have been removed.');
    }
}
