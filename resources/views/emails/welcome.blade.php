<x-mail::message>
# Welcome to {{ config('app.name') }}!

Hi {{ $user->name }},

Welcome to JPATHNEC! We're excited to have you as part of our community.

## What's Next?

To get started and access all features of your account, please verify your email address by clicking the link we sent to your inbox.

### Why verify your email?
- **Security:** Protect your account from unauthorized access
- **Shopping:** Complete purchases and track your orders
- **Updates:** Receive important order and shipping notifications
- **Exclusive offers:** Get access to special deals and promotions

<x-mail::button :url="$verifyUrl">
Verify Email Address
</x-mail::button>

## Explore Our Collection

While you're here, check out our amazing collection of fashion items:
- Latest trendy clothing
- Shoes and accessories
- Quality products at great prices
- Fast and reliable delivery

<x-mail::button :url="$url">
Start Shopping
</x-mail::button>

## Need Help?

If you have any questions or need assistance, our support team is here to help:

- **WhatsApp:** {{ config('app.whatsapp_phone', '+2348035139046') }}
- **Email:** {{ config('mail.from.address') }}

We're committed to providing you with the best shopping experience!

Thanks,<br>
The {{ config('app.name') }} Team

---
*If you didn't create an account with us, please ignore this email.*
</x-mail::message>
