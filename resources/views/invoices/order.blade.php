<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - Order #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #000;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
        }
        .invoice-info {
            margin-bottom: 30px;
        }
        .invoice-info table {
            width: 100%;
        }
        .invoice-info td {
            padding: 5px 0;
        }
        .billing-shipping {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .billing, .shipping {
            width: 45%;
        }
        .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .items-table .text-right {
            text-align: right;
        }
        .totals {
            margin-left: auto;
            width: 300px;
        }
        .totals table {
            width: 100%;
        }
        .totals td {
            padding: 5px 10px;
            border-bottom: 1px solid #ddd;
        }
        .totals .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #000;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">JPATHNEC</div>
        <div style="margin-top: 10px;">
            Your Premium Fashion Destination<br>
            Email: info@jpathnec.com<br>
            Phone: +234 XXX XXX XXXX
        </div>
    </div>

    <div class="invoice-title">INVOICE</div>

    <div class="invoice-info">
        <table>
            <tr>
                <td><strong>Invoice Number:</strong> {{ $order->order_number }}</td>
                <td><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y') }}</td>
            </tr>
            <tr>
                <td><strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}</td>
                <td><strong>Order Status:</strong> {{ ucfirst($order->status) }}</td>
            </tr>
            @if($order->payment_method)
            <tr>
                <td><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</td>
                <td></td>
            </tr>
            @endif
        </table>
    </div>

    <div class="billing-shipping">
        <div class="billing">
            <div class="section-title">Billing Address</div>
            @if($order->billing_address)
                {{ $order->billing_address['full_name'] ?? $order->billing_address['name'] ?? 'N/A' }}<br>
                {{ $order->billing_address['address_line_1'] ?? $order->billing_address['address'] ?? '' }}<br>
                {{ $order->billing_address['city'] ?? '' }}{{ $order->billing_address['state'] ? ', ' . $order->billing_address['state'] : '' }} {{ $order->billing_address['postal_code'] ?? $order->billing_address['zip'] ?? '' }}<br>
                @if($order->billing_address['phone'] ?? false)
                    Phone: {{ $order->billing_address['phone'] }}
                @endif
            @else
                <em>No billing address provided</em>
            @endif
        </div>

        <div class="shipping">
            <div class="section-title">Shipping Address</div>
            @if($order->shipping_address)
                {{ $order->shipping_address['full_name'] ?? $order->shipping_address['name'] ?? 'N/A' }}<br>
                {{ $order->shipping_address['address_line_1'] ?? $order->shipping_address['address'] ?? '' }}<br>
                {{ $order->shipping_address['city'] ?? '' }}{{ $order->shipping_address['state'] ? ', ' . $order->shipping_address['state'] : '' }} {{ $order->shipping_address['postal_code'] ?? $order->shipping_address['zip'] ?? '' }}<br>
                @if($order->shipping_address['phone'] ?? false)
                    Phone: {{ $order->shipping_address['phone'] }}
                @endif
            @else
                <em>Same as billing address</em>
            @endif
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Size</th>
                <th>Color</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->product_sku ?? 'N/A' }}</td>
                <td>{{ $item->size ?? 'N/A' }}</td>
                <td>{{ $item->color ?? 'N/A' }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($item->total_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            @if($order->subtotal)
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($order->subtotal, 2) }}</td>
            </tr>
            @endif
            @if($order->tax_amount)
            <tr>
                <td>Tax:</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($order->tax_amount, 2) }}</td>
            </tr>
            @endif
            @if($order->shipping_amount)
            <tr>
                <td>Shipping:</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($order->shipping_amount, 2) }}</td>
            </tr>
            @endif
            @if($order->discount_amount)
            <tr>
                <td>Discount:</td>
                <td class="text-right">-{{ $order->currency }}{{ number_format($order->discount_amount, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">{{ $order->currency }}{{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    @if($order->tracking_number)
    <div style="margin-top: 30px;">
        <strong>Tracking Number:</strong> {{ $order->tracking_number }}
    </div>
    @endif

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>For questions about this invoice, please contact us at info@jpathnec.com</p>
    </div>
</body>
</html>