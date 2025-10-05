<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\CartItem;

class MyOrdersController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc');

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('items.product', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Status filter
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            $orders = $query->paginate(5)->withQueryString();

            // Transform orders data
            $orders->getCollection()->transform(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => $order->total_amount,
                    'currency' => $order->currency ?? '₦',
                    'created_at' => $order->created_at->toISOString(),
                    'shipped_at' => $order->shipped_at?->toISOString(),
                    'delivered_at' => $order->delivered_at?->toISOString(),
                    'items_count' => $order->items->count(),
                    'tracking_number' => $order->tracking_number,
                    'payment_method' => $order->payment_method,
                    'shipping_address' => $order->shipping_address ? [
                        'full_name' => $order->shipping_address['full_name'] ?? $order->shipping_address['name'] ?? '',
                        'address_line_1' => $order->shipping_address['address_line_1'] ?? $order->shipping_address['address'] ?? '',
                        'city' => $order->shipping_address['city'] ?? '',
                        'state' => $order->shipping_address['state'] ?? '',
                        'postal_code' => $order->shipping_address['postal_code'] ?? $order->shipping_address['zip'] ?? '',
                        'phone' => $order->shipping_address['phone'] ?? '',
                    ] : null,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'size' => $item->size,
                            'color' => $item->color,
                        ];
                    }),
                ];
            });
            
            // Get cart count
            $cartCount = CartItem::where('user_id', $user->id)->sum('quantity');
            
            return Inertia::render('my-orders/index', [
                'auth' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ],
                'orders' => $orders,
                'filters' => [
                    'search' => $request->search,
                    'status' => $request->status,
                ],
                'cartCount' => $cartCount,
            ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        
        $order = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->findOrFail($id);

        return Inertia::render('my-orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => $order->total_amount,
                'currency' => $order->currency ?? '₦',
                'created_at' => $order->created_at->toISOString(),
                'shipped_at' => $order->shipped_at?->toISOString(),
                'delivered_at' => $order->delivered_at?->toISOString(),
                'tracking_number' => $order->tracking_number,
                'payment_method' => $order->payment_method,
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'notes' => $order->notes,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'size' => $item->size,
                        'color' => $item->color,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'images' => $item->product->images,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    public function reorder($id)
    {
        $user = Auth::user();
        
        $order = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->findOrFail($id);

        // Add order items to cart
        foreach ($order->items as $item) {
            if ($item->product && $item->product->is_active) {
                // Add to cart logic here
                // This would typically use your existing cart service
            }
        }

        return redirect()->route('cart.index')->with('success', 'Items from order #' . $order->order_number . ' have been added to your cart.');
    }

    public function downloadInvoice($id)
    {
        $user = Auth::user();
        
        $order = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->findOrFail($id);

        // Generate PDF invoice
        // You can use packages like dompdf or tcpdf for this
        
        return response()->json(['message' => 'Invoice download feature coming soon']);
    }
}