<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    private $client;
    private $secretKey;
    private $publicKey;
    private $baseUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->secretKey = env('PAYSTACK_SECRET_KEY');
        $this->publicKey = env('PAYSTACK_PUBLIC_KEY');
        $this->baseUrl = 'https://api.paystack.co';
    }

    /**
     * Initialize a payment transaction
     */
    public function initializePayment(array $data)
    {
        try {
            $response = $this->client->post($this->baseUrl . '/transaction/initialize', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->secretKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'amount' => (int) $data['amount'],
                    'email' => $data['email'],
                    'reference' => $data['reference'],
                    'currency' => 'NGN',
                    'callback_url' => $data['callback_url'],
                    'metadata' => [
                        'order_id' => $data['order_id'],
                        'custom_fields' => [
                            [
                                'display_name' => 'Order ID',
                                'variable_name' => 'order_id',
                                'value' => $data['order_id']
                            ]
                        ]
                    ]
                ]
            ]);

            $body = json_decode($response->getBody(), true);

            if ($body['status'] && $body['data']) {
                return [
                    'status' => true,
                    'data' => $body['data'],
                    'message' => 'Payment initialized successfully'
                ];
            }

            return [
                'status' => false,
                'message' => $body['message'] ?? 'Payment initialization failed'
            ];

        } catch (RequestException $e) {
            Log::error('Paystack payment initialization failed: ' . $e->getMessage());

            return [
                'status' => false,
                'message' => 'Payment initialization failed. Please try again.'
            ];
        }
    }

    /**
     * Verify a payment transaction
     */
    public function verifyPayment($reference)
    {
        try {
            $response = $this->client->get($this->baseUrl . '/transaction/verify/' . $reference, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->secretKey,
                    'Content-Type' => 'application/json',
                ]
            ]);

            $body = json_decode($response->getBody(), true);

            if ($body['status'] && $body['data']) {
                return [
                    'status' => true,
                    'data' => $body['data'],
                    'message' => 'Payment verification successful'
                ];
            }

            return [
                'status' => false,
                'message' => $body['message'] ?? 'Payment verification failed'
            ];

        } catch (RequestException $e) {
            Log::error('Paystack payment verification failed: ' . $e->getMessage());

            return [
                'status' => false,
                'message' => 'Payment verification failed. Please contact support.'
            ];
        }
    }

    /**
     * Get public key for frontend
     */
    public function getPublicKey()
    {
        return $this->publicKey;
    }

    /**
     * Generate payment reference
     */
    public function generateReference($prefix = 'JP')
    {
        return $prefix . '_' . time() . '_' . random_int(100000, 999999);
    }
}
