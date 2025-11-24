<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $appName ?? config('app.name') }} - Newsletter Subscription</title>
    <style>
        body { margin:0; padding:0; background-color:#f4f4f7; color:#333333; }
        table { border-collapse:collapse; }
        .email-wrapper { width:100%; background-color:#f4f4f7; padding:20px 0; }
        .email-content { width:100%; max-width:600px; margin:0 auto; background:white; border-radius:6px; overflow:hidden; }
        .email-masthead { padding:24px; text-align:center; }
        .email-body { padding:24px; }
        .button { display:inline-block; background:#2563eb; color:#ffffff; padding:12px 20px; border-radius:4px; text-decoration:none; }
        .subtle { color:#6b7280; font-size:14px; }
        .footer { padding:20px; text-align:center; color:#9ca3af; font-size:13px; }
        @media only screen and (max-width:600px) {
            .email-content { width:100% !important; border-radius:0; }
        }
    </style> 
</head> 
<body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="email-content" width="600" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td class="email-masthead">
                            @if(!empty($logoUrl))
                                <img src="{{ $logoUrl }}" alt="{{ $appName ?? config('app.name') }}" width="120" style="max-width:120px; height:auto; display:block; margin:0 auto 12px;" />
                            @endif
                            <h1 style="margin:0; font-size:20px; font-weight:700;">{{ $appName ?? config('app.name') }}</h1>
                        </td>
                    </tr>

                    <tr>
                        <td class="email-body">
                            <p style="margin:0 0 16px; font-size:16px;">Hi there,</p>

                            <p style="margin:0 0 16px; font-size:16px;">Thanks for subscribing to the {{ $appName ?? config('app.name') }} newsletter.</p>

                            <p style="margin:0 0 16px;">We'll send occasional updates, deals, and curated picks straight to <strong>{{ $email }}</strong>. If you didn't sign up for this email address, you can safely ignore this message.</p>

                            <p style="margin:0 0 20px;">
                                <a href="{{ $unsubscribeUrl ?? route('newsletter.unsubscribe', ['token' => $token]) }}" class="button">Unsubscribe</a>
                            </p>

                            <p class="subtle" style="margin:0;">If the button above doesn't work, copy and paste the following link into your browser:</p>
                            <p class="subtle" style="word-break:break-all; margin:8px 0 0; font-size:13px;">{{ $unsubscribeUrl ?? route('newsletter.unsubscribe', ['token' => $token]) }}</p>

                            <hr style="border:none; border-top:1px solid #eef2ff; margin:20px 0;" />

                            <p style="margin:0; font-size:14px; color:#6b7280;">Thanks,<br>{{ $appName ?? config('app.name') }} Team</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="footer">
                            <p style="margin:0;">{{ $appName ?? config('app.name') }} — <a href="{{ url('/') }}" style="color:#6b7280; text-decoration:underline;">Visit our site</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
