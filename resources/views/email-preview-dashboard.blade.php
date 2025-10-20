<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Template Previews - JPATHNEC</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2d3748;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #718096;
            margin-bottom: 40px;
        }
        .template-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            transition: border-color 0.2s;
        }
        .template-card:hover {
            border-color: #667eea;
        }
        .template-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }
        .template-description {
            color: #718096;
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin-right: 10px;
            margin-bottom: 5px;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-1px);
        }
        .button.secondary {
            background: #28a745;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 30px;
        }
        .command-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-top: 30px;
        }
        .command {
            background: #2d3748;
            color: #e2e8f0;
            padding: 10px 15px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Email Template Previews</h1>
        <p class="subtitle">Preview and test your email templates with sample data</p>

        <div class="warning">
            <strong>⚠️ Development Only:</strong> These preview routes are only available in non-production environments and will be automatically disabled in production.
        </div>

        <div class="template-card">
            <div class="template-title">🎉 Welcome Email</div>
            <div class="template-description">User registration and email verification welcome message</div>
            <a href="{{ url('/email-preview/welcome') }}" class="button" target="_blank">Preview Welcome Email</a>
            <a href="{{ url('/email-preview/welcome?user_id=1') }}" class="button secondary" target="_blank">With Real User Data</a>
        </div>

        <div class="template-card">
            <div class="template-title">📦 Order Confirmation</div>
            <div class="template-description">Order confirmation email with item details and tracking information</div>
            <a href="{{ url('/email-preview/order-confirmation') }}" class="button" target="_blank">Preview Order Email</a>
            <a href="{{ url('/email-preview/order-confirmation?user_id=1') }}" class="button secondary" target="_blank">With Real User Data</a>
        </div>

        <div class="template-card">
            <div class="template-title">🧾 Invoice Template</div>
            <div class="template-description">PDF invoice template for order receipts and records</div>
            <a href="{{ url('/email-preview/invoice') }}" class="button" target="_blank">Preview Invoice</a>
            <a href="{{ url('/email-preview/invoice?user_id=1') }}" class="button secondary" target="_blank">With Real User Data</a>
        </div>

        <div class="command-section">
            <h3>📋 Command Line Testing</h3>
            <p>You can also test templates using Artisan commands:</p>
            
            <div class="command">php artisan email:preview welcome --save-html</div>
            <div class="command">php artisan email:preview order-confirmation --save-html</div>
            <div class="command">php artisan email:preview invoice --save-html</div>
            
            <p><strong>Options:</strong></p>
            <ul>
                <li><code>--user=ID</code> - Use specific user ID</li>
                <li><code>--order=ID</code> - Use specific order ID</li>
                <li><code>--save-html</code> - Save HTML to storage/app/email-previews/</li>
            </ul>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096;">
            <p>JPATHNEC Email Template Preview Dashboard</p>
        </div>
    </div>
</body>
</html>