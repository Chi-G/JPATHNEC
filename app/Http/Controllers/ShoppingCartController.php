<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShoppingCartController extends Controller
{
    /**
     * Display shopping cart page
     */
    public function index(Request $request): Response
    {
        $subtotal = $this->calculateSubtotal($request);
        $tax = $this->calculateTax($request);
        $shipping = $this->calculateShipping($request);
        $serviceFee = $this->calculateServiceFee($request);
        $promoDiscount = $this->calculatePromoDiscount($request);

        return Inertia::render('shopping-cart/index', [
            'cart_items' => $this->getCartItems($request), 

            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'serviceFee' => $serviceFee,
            'promoDiscount' => $promoDiscount,
            'total' => $subtotal + $tax + $shipping + $serviceFee - $promoDiscount,

            'recommended_products' => $this->getRecommendedProducts(),
        ]); 
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully',
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy($itemId)
    {
        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
        ]);
    }

    /**
     * Get cart items
     */
    private function getCartItems($request): array
    {
        return [
            [
                'id' => 1,
                'product' => [
                    'id' => 1,
                    'name' => 'Premium Cotton T-Shirt',
                    'price' => 29.99,
                    'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
                ],
                'quantity' => 2,
                'size' => 'M',
                'color' => 'Black',
                'subtotal' => 59.98,
            ],
        ];
    }

    /**
     * Calculate subtotal
     */
    private function calculateSubtotal($request): float
    {
        return 59.98;
    }

    /**
     * Calculate tax
     */
    private function calculateTax($request): float
    {
        return 5.40;
    }

    /**
     * Calculate shipping
     */
    private function calculateShipping($request): float
    {
        return 1500; // Flat shipping rate of ₦1500
    }

    /**
     * NEW: Service Fee
     */
    private function calculateServiceFee($request): float
    {
        return 4.99;
    }

    /**
     * NEW: Promo Discount (optional)
     */
    private function calculatePromoDiscount($request): float
    {
        return 0;
    }

    /**
     * Calculate total
     */
    private function calculateTotal($request): float
    {
        return
            $this->calculateSubtotal($request)
            + $this->calculateTax($request)
            + $this->calculateShipping($request)
            + $this->calculateServiceFee($request)
            - $this->calculatePromoDiscount($request);
    }

    /**
     * Recommended products
     */
    private function getRecommendedProducts(): array
    {
        return [];
    }
}
