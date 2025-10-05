<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CartItem;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display checkout page
     */
    public function index(Request $request)
    {
        $cartItems = $this->getCartItems();

        // Redirect to cart if no items
        if (empty($cartItems)) {
            return redirect()->route('cart')
                ->with('error', 'Your cart is empty. Please add items before checkout.');
        }

        // Get cart count for authenticated users
        $cartCount = Auth::check() ? $this->getCartCount() : 0;

        return Inertia::render('checkout/index', [
            'auth' => [
                'user' => Auth::user() ? [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ] : null,
            ],
            'cartCount' => $cartCount,
            'cartItems' => $cartItems,
            'cartSummary' => $this->getCartSummary($cartItems),
            'shippingOptions' => $this->getShippingOptions(),
            'paymentMethods' => $this->getPaymentMethods(),
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
     * Display order success page
     */
    public function orderSuccess(\App\Models\Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to order');
        }

        // Load order with relationships
        $order->load(['items']);

        return Inertia::render('Checkout/Success', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'payment_reference' => $order->payment_reference,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->toISOString(),
                'shipping_address' => $order->shipping_address ? [
                    'full_name' => $order->shipping_address['fullName'] ?? $order->shipping_address['full_name'] ?? '',
                    'address_line_1' => $order->shipping_address['address'] ?? $order->shipping_address['address_line_1'] ?? '',
                    'address_line_2' => $order->shipping_address['address_line_2'] ?? '',
                    'city' => $order->shipping_address['city'] ?? '',
                    'state' => $order->shipping_address['state'] ?? '',
                    'postal_code' => $order->shipping_address['zipCode'] ?? $order->shipping_address['postal_code'] ?? '',
                    'phone' => $order->shipping_address['phone'] ?? '',
                ] : null,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => $item->unit_price,
                        'total' => $item->total_price,
                    ];
                })->toArray(),
            ],
        ]);
    }

    /**
     * Display checkout success page
     */
    public function success(Request $request)
    {
        $orderNumber = $request->query('order');
        
        if (!$orderNumber) {
            return redirect()->route('home')->with('error', 'Invalid order reference');
        }

        $order = \App\Models\Order::where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->with('items')
            ->first();

        if (!$order) {
            return redirect()->route('home')->with('error', 'Order not found');
        }

        return Inertia::render('checkout/success', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'payment_reference' => $order->payment_reference,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->toISOString(),
                'shipping_address' => $order->shipping_address ? [
                    'full_name' => $order->shipping_address['fullName'] ?? $order->shipping_address['full_name'] ?? '',
                    'address_line_1' => $order->shipping_address['address'] ?? $order->shipping_address['address_line_1'] ?? '',
                    'address_line_2' => $order->shipping_address['address_line_2'] ?? '',
                    'city' => $order->shipping_address['city'] ?? '',
                    'state' => $order->shipping_address['state'] ?? '',
                    'postal_code' => $order->shipping_address['zipCode'] ?? $order->shipping_address['postal_code'] ?? '',
                    'phone' => $order->shipping_address['phone'] ?? '',
                ] : null,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => $item->unit_price,
                        'total' => $item->total_price,
                    ];
                })->toArray(),
            ],
        ]);
    }

    /**
     * Get cart items for checkout
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
                        'price' => (float) $item->product->price,
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
        $shipping = $subtotal > 75 ? 0 : 9.99; // Free shipping over ₦75
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
     * Calculate subtotal
     */
    private function calculateSubtotal(array $cartItems): float
    {
        return round(array_sum(array_column($cartItems, 'total_price')), 2);
    }

    /**
     * Calculate tax
     */
    private function calculateTax(array $cartItems): float
    {
        $subtotal = $this->calculateSubtotal($cartItems);
        return round($subtotal * 0.1, 2); // 10% tax
    }

    /**
     * Calculate shipping
     */
    private function calculateShipping(array $cartItems): float
    {
        $subtotal = $this->calculateSubtotal($cartItems);
        return $subtotal > 75 ? 0 : 9.99; // Free shipping over $75
    }

    /**
     * Calculate total
     */
    private function calculateTotal(array $cartItems): float
    {
        return $this->calculateSubtotal($cartItems) + $this->calculateTax($cartItems) + $this->calculateShipping($cartItems);
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
