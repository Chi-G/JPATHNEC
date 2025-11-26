<?php

namespace App\Notifications\WhatsApp;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Services\WhatsAppService;

class OrderStatusUpdateWhatsApp extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $previousStatus;

    public function __construct($order, $previousStatus = null)
    {
        $this->order = $order;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    { 
        return ['whatsapp'];
    }

    /**
     * Send WhatsApp notification
     */
    public function toWhatsapp($notifiable)
    {
        $whatsappService = app(WhatsAppService::class);

        if (!$whatsappService->isEnabled()) {
            return null;
        }

        // Select template based on status
        $templateName = match($this->order->status) {
            'shipped' => 'order_shipped',
            'delivered' => 'order_delivered',
            'processing' => 'order_processing',
            default => 'order_status_update',
        };

        // Build parameters based on template
        $parameters = [
            ['type' => 'text', 'text' => $notifiable->name],
            ['type' => 'text', 'text' => $this->order->order_number],
        ];

        // Add status-specific parameters
        if ($this->order->status === 'shipped' && $this->order->tracking_number) {
            $parameters[] = ['type' => 'text', 'text' => $this->order->tracking_number];
        } else {
            $parameters[] = ['type' => 'text', 'text' => ucfirst($this->order->status)];
        }

        return $whatsappService->sendTemplateMessage(
            $notifiable->phone,
            $templateName,
            $parameters
        );
    }
}
