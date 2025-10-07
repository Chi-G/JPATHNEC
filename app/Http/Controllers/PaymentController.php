<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\PaymentService;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Mail\OrderConfirmation;
use Inertia\Inertia;

class PaymentController extends Controller
{
    private $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Initialize payment
     */
    public function initialize(Request $request)
    {
        $request->validate([
            'order_data' => 'required|array',
            'amount' => 'required|numeric|min:1',
        ]);

        try {
            DB::beginTransaction();

            // Create order
            $order = $this->createOrder($request->order_data, $request->amount);

            // Generate payment reference
            $reference = $this->paymentService->generateReference('JP');

            // Initialize payment with Paystack
            $paymentData = [
                'amount' => $request->amount,
                'email' => Auth::user()->email,
                'reference' => $reference,
                'order_id' => $order->id,
                'callback_url' => route('payment.callback')
            ];

            $paymentResponse = $this->paymentService->initializePayment($paymentData);

            if (!$paymentResponse['status']) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'message' => $paymentResponse['message']
                ], 400);
            }

            // Update order with payment reference
            $order->update([
                'payment_reference' => $reference,
                'payment_method' => 'paystack'
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'data' => [
                    'authorization_url' => $paymentResponse['data']['authorization_url'],
                    'access_code' => $paymentResponse['data']['access_code'],
                    'reference' => $reference,
                    'order_id' => $order->id,
                    'public_key' => $this->paymentService->getPublicKey()
                ],
                'message' => 'Payment initialized successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment initialization error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Payment initialization failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Handle payment callback
     */
    public function callback(Request $request)
    {
        $reference = $request->query('reference');

        Log::info('Payment callback received', [
            'reference' => $reference,
            'all_params' => $request->all(),
            'user_id' => Auth::id()
        ]);

        if (!$reference) {
            Log::error('Payment callback: No reference provided');
            return redirect()->route('checkout.index')
                ->with('error', 'Invalid payment reference');
        }

        // Verify payment
        $verification = $this->paymentService->verifyPayment($reference);

        Log::info('Payment verification result', [
            'reference' => $reference,
            'verification_status' => $verification['status'],
            'verification_data' => $verification
        ]);

        if (!$verification['status']) {
            Log::error('Payment verification failed', [
                'reference' => $reference,
                'verification' => $verification
            ]);
            return redirect()->route('checkout.index')
                ->with('error', 'Payment verification failed');
        }

        $paymentData = $verification['data'];

        // Find order by reference
        $order = Order::where('payment_reference', $reference)->first();

        Log::info('Order lookup result', [
            'reference' => $reference,
            'order_found' => $order ? true : false,
            'order_id' => $order ? $order->id : null,
            'order_payment_status' => $order ? $order->payment_status : null
        ]);

        if (!$order) {
            Log::error('Order not found for payment callback', [
                'reference' => $reference,
                'user_id' => Auth::id()
            ]);

            // If payment was successful but order doesn't exist, we need to create a recovery order
            if ($paymentData['status'] === 'success') {
                Log::info('Creating recovery order for successful payment without existing order', [
                    'reference' => $reference,
                    'user_id' => Auth::id(),
                    'payment_amount' => $paymentData['amount'] ?? 0
                ]);

                try {
                    // Get user's cart items to create recovery order
                    $cartItems = CartItem::with('product')->where('user_id', Auth::id())->get();

                    if ($cartItems->isNotEmpty()) {
                        // Calculate totals from cart
                        $subtotal = $cartItems->sum('total_price');
                        $taxAmount = $subtotal * 0.1;
                        $shippingAmount = 0; // Default to free shipping in recovery
                        $totalAmount = $subtotal + $taxAmount + $shippingAmount;

                        // Create recovery order
                        $order = Order::create([
                            'user_id' => Auth::id(),
                            'subtotal' => $subtotal,
                            'tax_amount' => $taxAmount,
                            'shipping_amount' => $shippingAmount,
                            'total_amount' => $totalAmount,
                            'currency' => '₦',
                            'billing_address' => [
                                'recovery' => true,
                                'full_name' => Auth::user()->name ?? 'Recovery User',
                                'address_line_1' => 'Address not provided during payment',
                                'city' => 'Recovery',
                                'state' => 'Nigeria',
                                'phone' => 'Not provided'
                            ],
                            'shipping_address' => [
                                'recovery' => true,
                                'full_name' => Auth::user()->name ?? 'Recovery User',
                                'address_line_1' => 'Address not provided during payment',
                                'address_line_2' => '',
                                'city' => 'Recovery',
                                'state' => 'Nigeria',
                                'postal_code' => '000000',
                                'phone' => 'Not provided'
                            ],
                            'email' => Auth::user()->email,
                            'payment_status' => 'paid',
                            'status' => 'processing',
                            'payment_reference' => $reference,
                            'payment_method' => 'paystack',
                            'shipping_method' => 'Standard Shipping',
                            'notes' => 'Recovery order - created after successful payment'
                        ]);

                        // Create order items from cart
                        foreach ($cartItems as $cartItem) {
                            OrderItem::create([
                                'order_id' => $order->id,
                                'product_id' => $cartItem->product_id,
                                'product_name' => $cartItem->product->name ?? 'Unknown Product',
                                'product_sku' => $cartItem->product->sku ?? 'RECOVERY-SKU',
                                'quantity' => $cartItem->quantity,
                                'unit_price' => $cartItem->price,
                                'total_price' => $cartItem->total_price,
                                'size' => $cartItem->size,
                                'color' => $cartItem->color
                            ]);
                        }

                        // Clear cart
                        $deletedItems = $cartItems->count();
                        CartItem::where('user_id', Auth::id())->delete();

                        Log::info('Recovery order created successfully', [
                            'order_id' => $order->id,
                            'order_number' => $order->order_number,
                            'reference' => $reference,
                            'deleted_cart_items' => $deletedItems
                        ]);

                        return redirect()->route('checkout.success', ['order' => $order->order_number])
                            ->with('success', 'Payment successful! Your order has been confirmed.');
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to create recovery order', [
                        'reference' => $reference,
                        'error' => $e->getMessage(), 
                        'user_id' => Auth::id()
                    ]);
                }
            }

            return redirect()->route('checkout.index')
                ->with('error', 'Order not found');
        }

        // Update order based on payment status
        if ($paymentData['status'] === 'success') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing'
            ]);

            // Send order confirmation email
            try {
                $order->load('items.product', 'user');
                Mail::to($order->user->email)->send(new OrderConfirmation($order));
                Log::info('Order confirmation email sent', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_email' => $order->user->email
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send order confirmation email', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage()
                ]);
            }

            // Clear user's cart with logging (only if user is authenticated)
            if (Auth::check()) {
                $deletedItems = CartItem::where('user_id', Auth::id())->count();
                CartItem::where('user_id', Auth::id())->delete();

                Log::info('Payment successful - Cart cleared', [
                    'user_id' => Auth::id(),
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'deleted_cart_items' => $deletedItems
                ]);
            } else {
                // Clear cart for the order's user if auth is not available
                $deletedItems = CartItem::where('user_id', $order->user_id)->count();
                CartItem::where('user_id', $order->user_id)->delete();

                Log::info('Payment successful - Cart cleared for order user', [
                    'order_user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'deleted_cart_items' => $deletedItems
                ]);
            }

            // Instead of redirecting to the protected route, redirect to a simpler success page
            // or use the old route that doesn't require model binding
            return redirect()->route('checkout.success', ['order' => $order->order_number])
                ->with('success', 'Payment successful! Your order has been confirmed.');
        } else {
            $order->update([
                'payment_status' => 'failed'
            ]);

            return redirect()->route('checkout.index')
                ->with('error', 'Payment failed. Please try again.');
        }
    }

    /**
     * Verify payment via AJAX
     */
    public function verify(Request $request)
    {
        $request->validate([
            'reference' => 'required|string'
        ]);

        try {
            $verification = $this->paymentService->verifyPayment($request->reference);

            if (!$verification['status']) {
                return response()->json([
                    'status' => false,
                    'message' => $verification['message']
                ], 400);
            }

            $paymentData = $verification['data'];

            // Find order by reference - if not found, wait a moment and try again
            $order = Order::where('payment_reference', $request->reference)->first();

            if (!$order) {
                // Wait a moment for database consistency
                sleep(1);
                $order = Order::where('payment_reference', $request->reference)->first();
            }

            if (!$order) {
                Log::error('Order not found for payment verification', [
                    'reference' => $request->reference,
                    'payment_data' => $paymentData,
                    'user_id' => Auth::id()
                ]);

                return response()->json([
                    'status' => false,
                    'message' => 'Order not found. Please contact support with reference: ' . $request->reference
                ], 404);
            }

            if ($paymentData['status'] === 'success') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing'
                ]);

                // Send order confirmation email
                try {
                    $order->load('items.product', 'user');
                    Mail::to($order->user->email)->send(new OrderConfirmation($order));
                    Log::info('Order confirmation email sent via AJAX verification', [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'user_email' => $order->user->email
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send order confirmation email via AJAX', [
                        'order_id' => $order->id,
                        'error' => $e->getMessage()
                    ]);
                }

                // Clear user's cart with logging
                $deletedItems = CartItem::where('user_id', Auth::id())->count();
                CartItem::where('user_id', Auth::id())->delete();

                Log::info('AJAX Payment verified - Cart cleared', [
                    'user_id' => Auth::id(),
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'payment_reference' => $request->reference,
                    'deleted_cart_items' => $deletedItems
                ]);

                return response()->json([
                    'status' => true,
                    'message' => 'Payment verified successfully',
                    'order_number' => $order->order_number,
                    'order_id' => $order->id
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Payment verification failed'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Payment verification exception', [
                'reference' => $request->reference,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Payment verification error. Please contact support.'
            ], 500);
        }
    }

    /**
     * Create order from request data
     */
    private function createOrder(array $orderData, float $amount)
    {
        // Get cart items
        $cartItems = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            throw new \Exception('Cart is empty');
        }

        // Calculate totals
        $subtotal = $cartItems->sum('total_price');
        $taxAmount = $subtotal * 0.1; // 10% tax
        $shippingAmount = $orderData['delivery']['price'] ?? 0;
        $totalAmount = $subtotal + $taxAmount + $shippingAmount;

        // Create order
        $order = Order::create([
            'user_id' => Auth::id(),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'currency' => '₦',
            'billing_address' => $orderData['billing'] ?? $orderData['shipping'],
            'shipping_address' => $orderData['shipping'],
            'email' => Auth::user()->email,
            'phone' => $orderData['shipping']['phone'] ?? null,
            'payment_status' => 'pending',
            'shipping_method' => $orderData['delivery']['name'] ?? 'Standard Shipping',
            'notes' => $orderData['notes'] ?? null
        ]);

        // Create order items
        foreach ($cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->price,
                'total_price' => $cartItem->total_price,
                'size' => $cartItem->size,
                'color' => $cartItem->color
            ]);
        }

        return $order;
    }

    /**
     * Manual cart clearing (for testing/emergency)
     */
    public function clearCart(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $cartItems = CartItem::where('user_id', Auth::id())->get();
        $itemCount = $cartItems->count();

        // Log cart items before deletion
        Log::info('Manual cart clearing initiated', [
            'user_id' => Auth::id(),
            'cart_items_count' => $itemCount,
            'cart_items' => $cartItems->toArray()
        ]);

        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'status' => true,
            'message' => "Cart cleared successfully. {$itemCount} items removed.",
            'deleted_items' => $itemCount
        ]);
    }

    /**
     * Get cart status (for debugging)
     */
    public function getCartStatus(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $cartItems = CartItem::with('product')->where('user_id', Auth::id())->get();

        return response()->json([
            'user_id' => Auth::id(),
            'cart_items_count' => $cartItems->count(),
            'cart_items' => $cartItems->map(function($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product->name ?? 'Unknown',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total_price' => $item->total_price,
                    'created_at' => $item->created_at
                ];
            })
        ]);
    }
}
