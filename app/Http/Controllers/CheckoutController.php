<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display checkout page
     */
    public function index(Request $request): Response
    {
        return Inertia::render('checkout/index', [
            'cart_items' => $this->getCartItems($request),
            'subtotal' => $this->calculateSubtotal($request),
            'tax' => $this->calculateTax($request),
            'shipping' => $this->calculateShipping($request),
            'total' => $this->calculateTotal($request),
            'shipping_options' => $this->getShippingOptions(),
            'payment_methods' => $this->getPaymentMethods(),
        ]);
    }

    /**
     * Process checkout
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'billing_address' => 'required|array',
            'payment_method' => 'required|string',
            'shipping_method' => 'required|string',
        ]);

        // Process checkout logic here
        // This would involve payment processing, order creation, etc.

        return redirect()->route('checkout.success')->with('success', 'Order placed successfully!');
    }

    /**
     * Display checkout success page
     */
    public function success(): Response
    {
        return Inertia::render('checkout/success', [
            'order' => $this->getLastOrder(),
        ]);
    }

    /**
     * Get cart items for checkout
     */
    private function getCartItems($request): array
    {
        // Similar to ShoppingCartController but for checkout
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
        return 9.99;
    }

    /**
     * Calculate total
     */
    private function calculateTotal($request): float
    {
        return $this->calculateSubtotal($request) + $this->calculateTax($request) + $this->calculateShipping($request);
    }

    /**
     * Get shipping options
     */
    private function getShippingOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Shipping',
                'price' => 0,
                'duration' => '5-7 business days',
            ],
            [
                'id' => 'express',
                'name' => 'Express Shipping',
                'price' => 9.99,
                'duration' => '2-3 business days',
            ],
            [
                'id' => 'overnight',
                'name' => 'Overnight Shipping',
                'price' => 24.99,
                'duration' => '1 business day',
            ],
        ];
    }

    /**
     * Get payment methods
     */
    private function getPaymentMethods(): array
    {
        return [
            ['id' => 'card', 'name' => 'Credit/Debit Card'],
            ['id' => 'paypal', 'name' => 'PayPal'],
            ['id' => 'apple_pay', 'name' => 'Apple Pay'],
        ];
    }

    /**
     * Get last order for success page
     */
    private function getLastOrder(): array
    {
        return [
            'id' => 'ORD-12345',
            'status' => 'confirmed',
            'total' => 75.37,
            'items_count' => 2,
        ];
    }
}
