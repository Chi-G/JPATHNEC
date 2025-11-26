<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $token;
    protected $phoneNumberId;
    protected $fromNumber;
    protected $enabled;

    public function __construct()
    {
        $this->token = config('services.whatsapp.token');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id');
        $this->fromNumber = config('services.whatsapp.from_number');
        $this->enabled = config('services.whatsapp.enabled', false);
    }

    /**
     * Send a template message via WhatsApp
     */
    public function sendTemplateMessage(string $to, string $templateName, array $parameters = [], string $language = 'en')
    {
        if (!$this->enabled) {
            Log::info('WhatsApp is disabled, skipping message', [
                'to' => $to,
                'template' => $templateName 
            ]);
            return ['status' => false, 'message' => 'WhatsApp is disabled'];
        }

        if (!$this->token || !$this->phoneNumberId) {
            Log::error('WhatsApp credentials not configured');
            return ['status' => false, 'message' => 'WhatsApp not configured'];
        }

        // Format phone number to E.164 format if needed
        $to = $this->formatPhoneNumber($to);

        try {
            $response = Http::withToken($this->token)
                ->post("https://graph.facebook.com/v18.0/{$this->phoneNumberId}/messages", [ 
                    'messaging_product' => 'whatsapp',
                    'to' => $to,
                    'type' => 'template',
                    'template' => [
                        'name' => $templateName,
                        'language' => [
                            'code' => $language
                        ],
                        'components' => [
                            [
                                'type' => 'body',
                                'parameters' => $parameters
                            ]
                        ]
                    ]
                ]);

            if ($response->successful()) {
                Log::info('WhatsApp message sent successfully', [
                    'to' => $to,
                    'template' => $templateName,
                    'message_id' => $response->json('messages.0.id')
                ]);

                return [
                    'status' => true,
                    'message_id' => $response->json('messages.0.id'),
                    'data' => $response->json()
                ];
            }

            Log::error('WhatsApp API error', [
                'to' => $to,
                'template' => $templateName,
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return [
                'status' => false,
                'message' => $response->json('error.message', 'Failed to send WhatsApp message'),
                'error' => $response->json()
            ];

        } catch (\Exception $e) {
            Log::error('WhatsApp service exception', [
                'to' => $to,
                'template' => $templateName,
                'error' => $e->getMessage()
            ]);

            return [
                'status' => false,
                'message' => 'Exception: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number to E.164 format
     */
    private function formatPhoneNumber(string $phone): string
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // If it starts with 0, replace with country code (234 for Nigeria)
        if (substr($phone, 0, 1) === '0') {
            $phone = '234' . substr($phone, 1);
        }

        // Add + prefix if not present
        if (substr($phone, 0, 1) !== '+') {
            $phone = '+' . $phone;
        }

        return $phone;
    }

    /**
     * Check if WhatsApp is enabled
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }
}
