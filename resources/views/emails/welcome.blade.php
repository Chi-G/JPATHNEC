<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to {{ config('app.name') }}</title>
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
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .highlight-box {
            background-color: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }
        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 25px;
        }
        .feature-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .secondary-button {
            background: #28a745;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
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
            color: #667eea;
        }
        .disclaimer {
            font-size: 12px;
            color: #6c757d;
            margin-top: 20px;
            font-style: italic;
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
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
            <img src="{{ asset('logo.png') }}" alt="{{ config('app.name') }} Logo" class="logo">
            <h1>{{ config('app.name') }}</h1>
            <p>Premium Fashion & Lifestyle</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Welcome, {{ $user->name }}! 🎉</div>

            <p>We're absolutely thrilled to have you join the <strong>{{ config('app.name') }}</strong> family! Your account has been successfully created, and you're just one step away from unlocking an amazing shopping experience.</p>

            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #667eea;">📧 Verify Your Email Address</h3>
                <p style="margin-bottom: 0;">To ensure the security of your account and enable all features, please verify your email address by clicking the button below:</p>
            </div>

            <div style="text-align: center;">
                <a href="{{ $verifyUrl }}" class="button">✉️ Verify Email Address</a>
            </div>

            <h3 style="color: #333; margin-top: 40px;">🛡️ Why Verify Your Email?</h3>
            <ul class="feature-list">
                <li><strong>Account Security:</strong> Protect your account from unauthorized access</li>
                <li><strong>Order Updates:</strong> Receive real-time notifications about your purchases</li>
                <li><strong>Exclusive Offers:</strong> Get first access to sales and special promotions</li>
                <li><strong>Easy Returns:</strong> Hassle-free returns and exchange process</li>
                <li><strong>Wishlist Sync:</strong> Save your favorite items across all devices</li>
            </ul>

            <h3 style="color: #333;">🛍️ Start Your Shopping Journey</h3>
            <p>Discover our curated collection of premium fashion items, accessories, and lifestyle products. From trending styles to timeless classics, we have something for everyone.</p>

            <div style="text-align: center;">
                <a href="{{ $url }}" class="button secondary-button">🛍️ Explore Our Collection</a>
            </div>

            <div class="contact-info">
                <h4>🤝 Need Help? We're Here for You!</h4>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/{{ str_replace(['+', ' '], '', config('app.whatsapp_phone', '+2348035139046')) }}">{{ config('app.whatsapp_phone', '+2348035139046') }}</a></p>
                <p><strong>Email:</strong> <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a></p>
                <p><strong>Support Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0; font-weight: 600; color: #333;">Thank you for choosing {{ config('app.name') }}!</p>
            <p style="margin: 10px 0 0 0; color: #6c757d;">Your premium fashion destination</p>

            <div class="disclaimer">
                If you didn't create an account with us, please ignore this email or <a href="mailto:{{ config('mail.from.address') }}">contact our support team</a>.
            </div>
        </div>
    </div>
</body>
</html>
