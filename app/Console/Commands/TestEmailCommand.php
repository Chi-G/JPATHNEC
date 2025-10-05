<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Order;
use App\Mail\OrderConfirmation;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {type=verification} {--user=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email functionality (verification or order-confirmation)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type');
        $userId = $this->option('user');

        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found");
            return 1;
        }

        try {
            switch ($type) {
                case 'verification':
                    $user->sendEmailVerificationNotification();
                    $this->info("Email verification sent to: {$user->email}");
                    break;

                case 'order-confirmation':
                    $order = Order::with('items.product', 'user')->where('user_id', $userId)->latest()->first();

                    if (!$order) {
                        $this->error("No orders found for user {$userId}");
                        return 1;
                    }

                    Mail::to($user->email)->send(new OrderConfirmation($order));
                    $this->info("Order confirmation email sent to: {$user->email} for order: {$order->order_number}");
                    break;

                default:
                    $this->error("Invalid email type. Use 'verification' or 'order-confirmation'");
                    return 1;
            }

            $this->info("Email sent successfully!");
            $this->info("Check your Mailtrap inbox at: https://mailtrap.io/inboxes");

        } catch (\Exception $e) {
            $this->error("Failed to send email: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
