<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CartItem;
use App\Models\Order;

class CheckCartCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:check {user?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check cart and order status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user');
        
        if ($userId) {
            $cartCount = CartItem::where('user_id', $userId)->count();
            $orderCount = Order::where('user_id', $userId)->count();
            
            $this->info("User {$userId}:");
            $this->info("  Cart items: {$cartCount}");
            $this->info("  Orders: {$orderCount}");
            
            if ($cartCount > 0) {
                $this->table(['ID', 'Product ID', 'Quantity', 'Size', 'Color'], 
                    CartItem::where('user_id', $userId)
                        ->get(['id', 'product_id', 'quantity', 'size', 'color'])
                        ->toArray()
                );
            }
            
            if ($orderCount > 0) {
                $this->table(['ID', 'Reference', 'Status', 'Total'], 
                    Order::where('user_id', $userId)
                        ->get(['id', 'payment_reference', 'status', 'total_amount'])
                        ->toArray()
                );
            }
        } else {
            $totalCartItems = CartItem::count();
            $totalOrders = Order::count();
            
            $this->info("System totals:");
            $this->info("  Total cart items: {$totalCartItems}");
            $this->info("  Total orders: {$totalOrders}");
            
            $this->info("\nCart items by user:");
            $cartByUser = CartItem::selectRaw('user_id, count(*) as count')
                ->groupBy('user_id')
                ->get();
            
            foreach ($cartByUser as $item) {
                $this->info("  User {$item->user_id}: {$item->count} items");
            }
            
            $this->info("\nOrders by user:");
            $ordersByUser = Order::selectRaw('user_id, count(*) as count')
                ->groupBy('user_id')
                ->get();
            
            foreach ($ordersByUser as $item) {
                $this->info("  User {$item->user_id}: {$item->count} orders");
            }
        }
    }
}
