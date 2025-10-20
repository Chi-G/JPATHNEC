<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\File;

class TestEmailTemplates extends Command
{
    protected $signature = 'email:preview {template} {--user=1} {--order=} {--save-html}';

    protected $description = 'Preview email templates with sample data';

    public function handle()
    {
        $template = $this->argument('template');
        $userId = $this->option('user');
        $orderId = $this->option('order');
        $saveHtml = $this->option('save-html');

        // Get or create sample user
        $user = User::find($userId) ?? $this->createSampleUser();

        $this->info("Testing email template: {$template}");
        $this->info("Using user: {$user->name} ({$user->email})");

        try {
            switch ($template) {
                case 'welcome':
                    $html = $this->previewWelcomeEmail($user);
                    break;

                case 'order-confirmation':
                    $order = $orderId ? Order::find($orderId) : $this->createSampleOrder($user);
                    $html = $this->previewOrderConfirmation($user, $order);
                    break;

                case 'invoice':
                    $order = $orderId ? Order::find($orderId) : $this->createSampleOrder($user);
                    $html = $this->previewInvoice($order);
                    break;

                default:
                    $this->error("Unknown template: {$template}");
                    $this->info("Available templates: welcome, order-confirmation, invoice");
                    return 1;
            }

            if ($saveHtml) {
                $filename = "email-preview-{$template}-" . now()->format('Y-m-d-H-i-s') . '.html';
                $path = storage_path("app/email-previews/{$filename}");

                // Create directory if it doesn't exist
                File::ensureDirectoryExists(dirname($path));

                File::put($path, $html);
                $this->info("HTML saved to: {$path}");
                $this->info("Open this file in your browser to see the email preview.");
            } else {
                // Create a temporary file and open it
                $tempFile = sys_get_temp_dir() . '/email-preview-' . $template . '.html';
                File::put($tempFile, $html);

                $this->info("Email preview generated!");
                $this->info("Temporary file: {$tempFile}");
                $this->info("Opening in browser...");

                // Try to open in browser (works on Windows/Mac/Linux)
                if (PHP_OS_FAMILY === 'Windows') {
                    exec("start {$tempFile}");
                } elseif (PHP_OS_FAMILY === 'Darwin') {
                    exec("open {$tempFile}");
                } else {
                    exec("xdg-open {$tempFile}");
                }
            }

        } catch (\Exception $e) {
            $this->error("Error generating preview: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function previewWelcomeEmail($user)
    {
        $data = [
            'user' => $user,
            'verifyUrl' => url('/email/verify/' . base64_encode($user->email)),
            'url' => url('/'),
        ];

        return View::make('emails.welcome', $data)->render();
    }

    private function previewOrderConfirmation($user, $order)
    {
        $data = [
            'user' => $user,
            'order' => $order,
            'items' => $order->items,
            'url' => url("/my-orders/{$order->id}"),
        ];

        return View::make('emails.orders.confirmation', $data)->render();
    }

    private function previewInvoice($order)
    {
        $data = [
            'order' => $order,
        ];

        return View::make('invoices.order', $data)->render();
    }

    private function createSampleUser()
    {
        // Try to find existing user first
        $user = User::where('email', 'john.doe@example.com')->first();

        if ($user) {
            return $user;
        }

        return User::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
        ]);
    }

    private function createSampleOrder($user)
    {
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'JP-' . strtoupper(substr(md5(time()), 0, 8)),
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
            'product_id' => 1, // Use a dummy product ID
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
            'product_id' => 2, // Use a dummy product ID
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
