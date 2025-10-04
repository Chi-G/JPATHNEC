<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;

class UpdateOrderStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:update-status {order_id} {status}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update order status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderId = $this->argument('order_id');
        $status = $this->argument('status');
        
        $order = Order::find($orderId);
        
        if (!$order) {
            $this->error("Order {$orderId} not found");
            return;
        }
        
        $oldStatus = $order->status;
        $oldPaymentStatus = $order->payment_status;
        
        // Update status based on input
        if (in_array($status, ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])) {
            $order->status = $status;
        }
        
        if (in_array($status, ['paid', 'failed', 'pending', 'refunded', 'partially_refunded'])) {
            $order->payment_status = $status;
        }
        
        $order->save();
        
        $this->info("Order {$orderId} updated:");
        $this->info("  Status: {$oldStatus} → {$order->status}");
        $this->info("  Payment: {$oldPaymentStatus} → {$order->payment_status}");
        $this->info("  Reference: {$order->payment_reference}");
        $this->info("  Total: {$order->total_amount}");
    }
}
