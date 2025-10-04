<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class ClearCartCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:clear {user?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear cart items for a user or all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user');
        
        if ($userId) {
            $count = CartItem::where('user_id', $userId)->count();
            $this->info("Found {$count} cart items for user {$userId}");
            
            CartItem::where('user_id', $userId)->delete();
            $this->info("Cleared cart for user {$userId}");
        } else {
            $count = CartItem::count();
            $this->info("Found {$count} total cart items");
            
            CartItem::truncate();
            $this->info("Cleared all cart items");
        }
        
        $remaining = CartItem::count();
        $this->info("Remaining cart items: {$remaining}");
    }
}
