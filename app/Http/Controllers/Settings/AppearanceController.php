<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    /**
     * Show the appearance settings form.
     */
    public function edit(): Response
    {
        $cartCount = CartItem::where('user_id', Auth::id())->sum('quantity');

        return Inertia::render('settings/appearance', [
            'auth' => [
                'user' => Auth::user()
            ],
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Update the user's appearance preferences.
     */
    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'nullable|in:light,dark,system',
            'language' => 'nullable|string|max:10',
        ]);

        // For now, we'll store preferences in session
        // Later you can add a user_preferences table if needed
        session([
            'theme' => $request->theme ?? 'system',
            'language' => $request->language ?? 'en',
        ]);

        return back()->with('success', 'Appearance settings updated successfully.');
    }
}
