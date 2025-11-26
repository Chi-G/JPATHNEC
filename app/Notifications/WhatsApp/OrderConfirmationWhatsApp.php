<?php

namespace App\Notifications\WhatsApp;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Services\WhatsAppService;

class OrderConfirmationWhatsApp extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct($order)
    {
        $this->order = $order;
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

        // Template parameters for order_confirmation template
        // Template body: Hi {{1}}, your order {{2}} has been confirmed! Total: {{3}}. Track: {{4}}
        $parameters = [
            ['type' => 'text', 'text' => $notifiable->name],
            ['type' => 'text', 'text' => $this->order->order_number],
            ['type' => 'text', 'text' => $this->order->formatted_total],
            ['type' => 'text', 'text' => route('my-orders.track', $this->order->id)],
        ];

        return $whatsappService->sendTemplateMessage(
            $notifiable->phone,
            'order_confirmation',
            $parameters
        );
    }
}
