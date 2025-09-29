<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CartItem;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart page
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        
        return Inertia::render('shopping-cart/index', [
            'cartItems' => $cartItems,
            'cartSummary' => $this->getCartSummary($cartItems),
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if item already exists in cart
        $existingItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->where('color', $request->color)
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity
            ]);
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'size' => $request->size,
                'color' => $request->color,
                'price' => $product->price,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart successfully!',
            'cart_count' => $this->getCartCount(),
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cart updated successfully!',
            'cart_count' => $this->getCartCount(),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function remove($id)
    {
        CartItem::where('user_id', Auth::id())
            ->where('id', $id)
            ->delete();

        return response()->json([
            'message' => 'Item removed from cart!',
            'cart_count' => $this->getCartCount(),
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared!',
            'cart_count' => 0,
        ]);
    }

    /**
     * Get cart items for current user
     */
    private function getCartItems(): array
    {
        if (!Auth::check()) {
            return [];
        }

        return CartItem::with(['product.images'])
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'image' => $item->product->primary_image_url ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                        'in_stock' => $item->product->inStock(),
                    ],
                    'quantity' => $item->quantity,
                    'size' => $item->size,
                    'color' => $item->color,
                    'unit_price' => (float) $item->price,
                    'total_price' => (float) $item->total_price,
                ];
            })
            ->toArray();
    }

    /**
     * Get cart summary
     */
    private function getCartSummary(array $cartItems): array
    {
        $subtotal = array_sum(array_column($cartItems, 'total_price'));
        $tax = $subtotal * 0.1; // 10% tax
        $shipping = $subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        $total = $subtotal + $tax + $shipping;

        return [
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'shipping' => round($shipping, 2),
            'total' => round($total, 2),
            'item_count' => array_sum(array_column($cartItems, 'quantity')),
        ];
    }

    /**
     * Get cart count
     */
    private function getCartCount(): int
    {
        if (!Auth::check()) {
            return 0;
        }
        
        return CartItem::where('user_id', Auth::id())->sum('quantity');
    }
}
 