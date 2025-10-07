<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $order;
    public $previousStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, ?string $previousStatus = null)
    {
        $this->order = $order;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusMessages = [
            'pending' => [
                'subject' => 'Order Confirmed',
                'greeting' => 'Thank you for your order!',
                'message' => 'Your order has been confirmed and is being prepared.',
            ],
            'processing' => [
                'subject' => 'Order Processing',
                'greeting' => 'Your order is being processed',
                'message' => 'We are currently preparing your order for shipment.',
            ],
            'shipped' => [
                'subject' => 'Order Shipped',
                'greeting' => 'Great news! Your order is on its way',
                'message' => 'Your order has been shipped and is on its way to you.',
            ],
            'delivered' => [
                'subject' => 'Order Delivered',
                'greeting' => 'Your order has been delivered!',
                'message' => 'Your order has been successfully delivered. We hope you enjoy your purchase!',
            ],
            'cancelled' => [
                'subject' => 'Order Cancelled',
                'greeting' => 'Order Cancellation Notice',
                'message' => 'Your order has been cancelled. If you have any questions, please contact our support team.',
            ],
        ];

        $statusInfo = $statusMessages[$this->order->status] ?? [
            'subject' => 'Order Status Update',
            'greeting' => 'Order Update',
            'message' => 'Your order status has been updated.',
        ];

        $mailMessage = (new MailMessage)
            ->subject($statusInfo['subject'] . ' - Order #' . $this->order->order_number)
            ->greeting($statusInfo['greeting'])
            ->line($statusInfo['message'])
            ->line('**Order Details:**')
            ->line('Order Number: #' . $this->order->order_number)
            ->line('Status: ' . ucfirst($this->order->status))
            ->line('Total Amount: ' . $this->order->formatted_total);

        // Add tracking information if available
        if ($this->order->tracking_number) {
            $mailMessage->line('Tracking Number: ' . $this->order->tracking_number);
        }

        if ($this->order->current_location) {
            $mailMessage->line('Current Location: ' . $this->order->current_location);
        }

        if ($this->order->status_description) {
            $mailMessage->line('Additional Info: ' . $this->order->status_description);
        }

        // Add action button based on status
        if ($this->order->status === 'shipped') {
            $mailMessage->action('Track Your Order', url('/my-orders/' . $this->order->id . '/track'));
        } elseif (in_array($this->order->status, ['pending', 'processing', 'delivered'])) {
            $mailMessage->action('View Order Details', url('/my-orders/' . $this->order->id));
        }

        $mailMessage->line('Thank you for shopping with JPATHNEC!');

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status,
            'previous_status' => $this->previousStatus,
            'message' => "Order #{$this->order->order_number} status updated to " . ucfirst($this->order->status),
        ];
    }
}
