<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Store a new address.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:billing,shipping',
            'full_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        // If this is set as default, unset other defaults of the same type
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', Auth::id())
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        Address::create($validated);

        return back()->with('status', 'Address added successfully!');
    }

    /**
     * Update an existing address.
     */
    public function update(Request $request, Address $address): RedirectResponse
    {
        // Ensure user can only update their own addresses
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:billing,shipping',
            'full_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        // If this is set as default, unset other defaults of the same type
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', Auth::id())
                ->where('type', $validated['type'])
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('status', 'Address updated successfully!');
    }

    /**
     * Delete an address.
     */
    public function destroy(Address $address): RedirectResponse
    {
        // Ensure user can only delete their own addresses
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return back()->with('status', 'Address deleted successfully!');
    }
}
