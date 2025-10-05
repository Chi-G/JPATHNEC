<x-mail::message>
# Order Confirmation

Hi {{ $user->name }},

Thank you for your order! We've received your payment and your order is being processed.

## Order Details
- **Order Number:** {{ $order->order_number }}
- **Order Date:** {{ $order->created_at->format('F j, Y') }}
- **Total Amount:** {{ $order->currency }}{{ number_format($order->total_amount, 2) }}
- **Payment Status:** {{ ucfirst($order->payment_status) }}

## Items Ordered
@foreach($items as $item)
- {{ $item->product_name }} (Qty: {{ $item->quantity }})
  @if($item->size) - Size: {{ $item->size }} @endif
  @if($item->color) - Color: {{ $item->color }} @endif
  - {{ $order->currency }}{{ number_format($item->total_price, 2) }}
@endforeach

## Shipping Information
@if($order->shipping_address)
**Shipping Address:**
{{ $order->shipping_address['full_name'] ?? $order->shipping_address['name'] ?? '' }}
{{ $order->shipping_address['address_line_1'] ?? $order->shipping_address['address'] ?? '' }}
{{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['state'] ?? '' }} {{ $order->shipping_address['postal_code'] ?? '' }}
@if(isset($order->shipping_address['phone']))
Phone: {{ $order->shipping_address['phone'] }}
@endif
@endif

## What's Next?
1. **Processing:** We're preparing your order for shipment
2. **Shipping:** You'll receive tracking information once your order ships
3. **Delivery:** Your order will be delivered to your specified address

<x-mail::button :url="$url">
Track Your Order
</x-mail::button>

## Need Help?
If you have any questions about your order, feel free to contact us.

WhatsApp: {{ config('app.whatsapp_phone', '+2348035139046') }}
Email: {{ config('mail.from.address') }}

Thanks,<br>
{{ config('app.name') }} Team

---
**Order Reference:** {{ $order->order_number }}
</x-mail::message>
