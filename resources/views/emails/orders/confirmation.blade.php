<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order Confirmation - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            padding: 30px 40px;
            text-align: center;
            color: white;
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .success-badge {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 10px;
            font-weight: 600;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .order-summary {
            background-color: #f8f9ff;
            border: 2px solid #28a745;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
        }
        .order-summary h3 {
            margin-top: 0;
            color: #28a745;
            font-size: 20px;
        }
        .order-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .order-detail:last-child {
            border-bottom: none;
            font-weight: 600;
            font-size: 16px;
            color: #28a745;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .items-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .shipping-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .shipping-info h4 {
            margin-top: 0;
            color: #856404;
            display: flex;
            align-items: center;
        }
        .status-steps {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
            position: relative;
        }
        .status-step {
            text-align: center;
            flex: 1;
            position: relative;
        }
        .status-step .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #28a745;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-weight: 600;
            position: relative;
            z-index: 2;
        }
        .status-step .step-inactive {
            background: #dee2e6;
            color: #6c757d;
        }
        .status-step::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #dee2e6;
            z-index: 1;
        }
        .status-step:last-child::after {
            display: none;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .contact-info {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ddd;
        }
        .contact-info h4 {
            margin-top: 0;
            color: #28a745;
        }
        .reference-number {
            font-family: 'Courier New', monospace;
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .greeting {
                font-size: 20px;
            }
            .status-steps {
                flex-direction: column;
            }
            .status-step {
                margin-bottom: 20px;
            }
            .status-step::after {
                display: none;
            }
            .items-table {
                font-size: 14px;
            }
            .items-table th,
            .items-table td {
                padding: 10px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
            <img src="{{ asset('logo.png') }}" alt="{{ config('app.name') }} Logo" class="logo">
            <h1>{{ config('app.name') }}</h1>
            <p>Order Confirmation</p>
            <div class="success-badge">✅ Payment Successful</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Thank you, {{ $user->name }}! 🎉</div>

            <p>Your order has been successfully placed and payment confirmed! We're excited to get your items ready for shipment.</p>

            <!-- Order Summary -->
            <div class="order-summary">
                <h3>📋 Order Summary</h3>
                <div class="order-detail">
                    <span><strong>Order Number:</strong></span>
                    <span class="reference-number">{{ $order->order_number }}</span>
                </div>
                <div class="order-detail">
                    <span><strong>Order Date:</strong></span>
                    <span>{{ $order->created_at->format('F j, Y \a\t g:i A') }}</span>
                </div>
                <div class="order-detail">
                    <span><strong>Payment Status:</strong></span>
                    <span style="color: #28a745;">✅ {{ ucfirst($order->payment_status) }}</span>
                </div>
                <div class="order-detail">
                    <span><strong>Total Amount:</strong></span>
                    <span>{{ $order->currency }}{{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>

            <!-- Order Items -->
            <h3 style="color: #333;">🛍️ Items Ordered</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Details</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td><strong>{{ $item->product_name }}</strong></td>
                        <td>
                            @if($item->size)
                                <span style="display: inline-block; background: #e9ecef; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px;">Size: {{ $item->size }}</span>
                            @endif
                            @if($item->color)
                                <span style="display: inline-block; background: #e9ecef; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Color: {{ $item->color }}</span>
                            @endif
                        </td>
                        <td>{{ $item->quantity }}</td>
                        <td><strong>{{ $order->currency }}{{ number_format($item->total_price, 2) }}</strong></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Shipping Information -->
            @if($order->shipping_address)
            <div class="shipping-info">
                <h4>🚚 Shipping Address</h4>
                <p style="margin: 0;">
                    <strong>{{ $order->shipping_address['full_name'] ?? $order->shipping_address['name'] ?? '' }}</strong><br>
                    {{ $order->shipping_address['address_line_1'] ?? $order->shipping_address['address'] ?? '' }}<br>
                    @if(isset($order->shipping_address['address_line_2']) && $order->shipping_address['address_line_2'])
                        {{ $order->shipping_address['address_line_2'] }}<br>
                    @endif
                    {{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['state'] ?? '' }} {{ $order->shipping_address['postal_code'] ?? '' }}<br>
                    @if(isset($order->shipping_address['phone']))
                        📱 {{ $order->shipping_address['phone'] }}
                    @endif
                </p>
            </div>
            @endif

            <!-- Order Status Steps -->
            <h3 style="color: #333;">📦 What Happens Next?</h3>
            <div class="status-steps">
                <div class="status-step">
                    <div class="step-number">1</div>
                    <div style="font-weight: 600;">Order Received</div>
                    <div style="font-size: 12px; color: #6c757d;">Payment confirmed</div>
                </div>
                <div class="status-step">
                    <div class="step-number step-inactive">2</div>
                    <div style="font-weight: 600;">Processing</div>
                    <div style="font-size: 12px; color: #6c757d;">Preparing your items</div>
                </div>
                <div class="status-step">
                    <div class="step-number step-inactive">3</div>
                    <div style="font-weight: 600;">Shipped</div>
                    <div style="font-size: 12px; color: #6c757d;">On the way to you</div>
                </div>
                <div class="status-step">
                    <div class="step-number step-inactive">4</div>
                    <div style="font-weight: 600;">Delivered</div>
                    <div style="font-size: 12px; color: #6c757d;">Enjoy your purchase!</div>
                </div>
            </div>

            <p>We'll send you tracking information as soon as your order ships. You can also track your order anytime using the button below:</p>

            <div style="text-align: center;">
                <a href="{{ $url }}" class="button">📦 Track Your Order</a>
            </div>

            <div class="contact-info">
                <h4>💬 Questions About Your Order?</h4>
                <p>Our customer service team is here to help!</p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/{{ str_replace(['+', ' '], '', config('app.whatsapp_phone', '+2348035139046')) }}">{{ config('app.whatsapp_phone', '+2348035139046') }}</a></p>
                <p><strong>Email:</strong> <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a></p>
                <p><strong>Support Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0; font-weight: 600; color: #333;">Thank you for shopping with {{ config('app.name') }}!</p>
            <p style="margin: 10px 0 0 0; color: #6c757d;">Your premium fashion destination</p>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
                <strong>Order Reference:</strong> <span class="reference-number">{{ $order->order_number }}</span>
            </div>
        </div>
    </div>
</body>
</html>
