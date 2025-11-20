<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\URL;

class EmailPreviewController extends Controller
{
    public function showWelcome(Request $request)
    {
        $user = $this->getSampleUser($request->get('user_id', 1));

        // Generate the correct signed verification URL
        $verifyUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->email),
            ]
        );

        $data = [
            'user' => $user,
            'verifyUrl' => $verifyUrl,
            'url' => url('/'),
        ];

        return View::make('emails.welcome', $data);
    }

    public function showOrderConfirmation(Request $request)
    {
        $userId = $request->get('user_id', 1);
        $orderId = $request->get('order_id');

        $user = $this->getSampleUser($userId);

        if ($orderId && Order::find($orderId)) {
            $order = Order::with('items')->find($orderId);
        } else {
            $order = $this->createSampleOrder($user);
        }

        $data = [
            'user' => $user,
            'order' => $order,
            'items' => $order->items,
            'url' => url("/my-orders/{$order->id}"),
        ];

        return View::make('emails.orders.confirmation', $data);
    }

    public function showInvoice(Request $request)
    {
        $userId = $request->get('user_id', 1);
        $orderId = $request->get('order_id');

        $user = $this->getSampleUser($userId);

        if ($orderId && Order::find($orderId)) {
            $order = Order::with('items')->find($orderId);
        } else {
            $order = $this->createSampleOrder($user);
        }

        $data = [
            'order' => $order,
        ];

        return View::make('invoices.order', $data);
    }

    private function getSampleUser($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            $user = User::where('email', 'sample@example.com')->first();

            if (!$user) {
                $user = User::create([
                    'name' => 'Sample User',
                    'email' => 'sample@example.com',
                    'email_verified_at' => now(),
                    'password' => bcrypt('password'),
                ]);
            }
        }

        return $user;
    }

    private function createSampleOrder($user)
    {
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'JP-SAMPLE-' . time(),
            'status' => 'pending',
            'payment_status' => 'paid',
            'total_amount' => 150.00,
            'subtotal' => 120.00,
            'tax_amount' => 12.00,
            'shipping_amount' => 18.00,
            'discount_amount' => 0.00,
            'currency' => '₦',
            'email' => $user->email,
            'phone' => '+234 801 234 5678',
            'payment_method' => 'paystack',
            'shipping_method' => 'standard',
            'shipping_address' => [
                'full_name' => $user->name,
                'address_line_1' => '123 Lagos Street',
                'address_line_2' => 'Victoria Island',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'postal_code' => '101001',
                'phone' => '+234 801 234 5678',
            ],
            'billing_address' => [
                'full_name' => $user->name,
                'address_line_1' => '123 Lagos Street',
                'address_line_2' => 'Victoria Island',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'postal_code' => '101001',
                'phone' => '+234 801 234 5678',
            ],
        ]);

        // Create sample order items
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => 1,
            'product_name' => 'Premium Cotton T-Shirt',
            'product_sku' => 'JPTSHIRT001',
            'quantity' => 2,
            'unit_price' => 25.00,
            'total_price' => 50.00,
            'size' => 'L',
            'color' => 'Navy Blue',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => 2,
            'product_name' => 'Designer Jeans',
            'product_sku' => 'JPJEANS002',
            'quantity' => 1,
            'unit_price' => 70.00,
            'total_price' => 70.00,
            'size' => '32',
            'color' => 'Dark Blue',
        ]);

        return $order->fresh(['items']);
    }
}
